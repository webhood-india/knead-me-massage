const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { generateBookingRef } = require('../utils/generateRef');
const { createCalendarEvent, deleteCalendarEvent } = require('../utils/googleCalendar');

const BUSINESS_HOURS = Object.fromEntries([0,1,2,3,4,5,6].map(day => [day, {open:'08:30',close:'19:45'}]));
const SLOT_INTERVAL_MIN = 15;
const ukParts = (instant) => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant).map(p=>[p.type,p.value]));
const ukToday = () => {const p=ukParts(new Date());return `${p.year}-${p.month}-${p.day}`;};
const ukNowMinutes = () => {const p=ukParts(new Date());return Number(p.hour)*60+Number(p.minute);};
const timeToMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Returns array of available start times ('HH:MM', 24h) for a given date + duration,
 * excluding slots that overlap existing non-cancelled bookings.
 */
const computeAvailableSlots = async (dateStr, durationMin) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !Number.isInteger(durationMin) || durationMin <= 0) return [];
  if (dateStr < ukToday()) return [];
  const date = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== dateStr) return [];
  const dayHours = BUSINESS_HOURS[date.getDay()];
  if (!dayHours) return [];

  const openMin = timeToMinutes(dayHours.open);
  const closeMin = timeToMinutes(dayHours.close);

  const existing = await Booking.find({
    date: dateStr,
    status: { $in: ['pending_payment', 'confirmed'] },
  }).select('startTime endTime');

  const busyRanges = existing.map((b) => [timeToMinutes(b.startTime), timeToMinutes(b.endTime)]);

  const slots = [];
  for (let start = openMin; start + durationMin <= closeMin; start += SLOT_INTERVAL_MIN) {
    const end = start + durationMin;
    const overlaps = busyRanges.some(([bStart, bEnd]) => start < bEnd && end > bStart);
    if (!overlaps) slots.push(minutesToTime(start));
  }

  // If date is today, filter out past slots
  const now = new Date();
  if (dateStr === ukToday()) {
    const nowMin = ukNowMinutes();
    return slots.filter((s) => timeToMinutes(s) > nowMin);
  }

  return slots;
};

// @route GET /api/bookings/availability?serviceId=&duration=&date=
const checkAvailability = asyncHandler(async (req, res) => {
  const { serviceId, duration, date } = req.query;
  if (!serviceId || !duration || !date) {
    res.status(400);
    throw new Error('serviceId, duration and date are required');
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  const validDuration = service.durationOptions.find((d) => d.duration === Number(duration));
  if (!validDuration) {
    res.status(400);
    throw new Error('Selected duration is not available for this treatment');
  }

  const slots = await computeAvailableSlots(date, Number(duration));
  res.json({ success: true, date, duration: Number(duration), slots });
});

// @route POST /api/bookings  (auth required) - creates a pending booking, ready for payment
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, duration, date, startTime, customerNotes } = req.body;

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  const durationOption = service.durationOptions.find((d) => d.duration === Number(duration));
  if (!durationOption) {
    res.status(400);
    throw new Error('Selected duration is not available for this treatment');
  }

  // re-validate slot is still free (avoid race conditions)
  const availableSlots = await computeAvailableSlots(date, Number(duration));
  if (!availableSlots.includes(startTime)) {
    res.status(409);
    throw new Error('Selected time slot is no longer available. Please choose another slot.');
  }

  const endMinutes = timeToMinutes(startTime) + Number(duration);
  const bookingRef = await generateBookingRef();

  const booking = await Booking.create({
    bookingRef,
    customer: req.user._id,
    service: service._id,
    serviceName: service.name,
    duration: Number(duration),
    price: durationOption.price,
    date,
    startTime,
    endTime: minutesToTime(endMinutes),
    customerNotes,
    status: 'pending_payment',
    payment: { status: 'unpaid', amount: durationOption.price, currency: (process.env.SUMUP_CURRENCY || 'GBP').toLowerCase() },
  });

  res.status(201).json({ success: true, booking });
});

// @route GET /api/bookings/mine  (auth required)
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate('service', 'name category')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @route PUT /api/bookings/:id/cancel  (auth required, own booking only)
const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by customer';
  await booking.save();

  if (booking.googleCalendar?.eventId) {
    await deleteCalendarEvent(booking.googleCalendar.eventId);
  }

  res.json({ success: true, booking });
});

// ---------- ADMIN ----------

// @route POST /api/admin/bookings  - staff manually add an appointment (phone/walk-in booking)
const adminCreateBooking = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    serviceId,
    duration,
    date,
    startTime,
    customerNotes,
    paymentStatus, // 'paid' | 'unpaid' — admin decides (e.g. paid in person, or invoice later)
    force, // true = skip the slot-conflict check (for manual overrides)
  } = req.body;

  if (!customerName || !customerEmail) {
    res.status(400);
    throw new Error('Customer name and email are required');
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Treatment not found');
  }
  const durationOption = service.durationOptions.find((d) => d.duration === Number(duration));
  if (!durationOption) {
    res.status(400);
    throw new Error('Selected duration is not available for this treatment');
  }

  if (!force) {
    const availableSlots = await computeAvailableSlots(date, Number(duration));
    if (!availableSlots.includes(startTime)) {
      res.status(409);
      throw new Error('Selected time slot conflicts with an existing booking. Set force=true to override.');
    }
  }

  // Find or create the customer record
  let customer = await User.findOne({ email: customerEmail.toLowerCase() });
  if (!customer) {
    const tempPassword = Math.random().toString(36).slice(-10);
    customer = await User.create({
      name: customerName,
      email: customerEmail.toLowerCase(),
      phone: customerPhone,
      password: tempPassword, // customer can use "forgot password" flow later if this is added
    });
  }

  const endMinutes = timeToMinutes(startTime) + Number(duration);
  const bookingRef = await generateBookingRef();
  const paid = paymentStatus === 'paid';

  const booking = await Booking.create({
    bookingRef,
    customer: customer._id,
    service: service._id,
    serviceName: service.name,
    duration: Number(duration),
    price: durationOption.price,
    date,
    startTime,
    endTime: minutesToTime(endMinutes),
    customerNotes,
    status: 'confirmed',
    bookingSource: 'admin',
    payment: {
      status: paid ? 'paid' : 'unpaid',
      provider: 'admin_manual',
      amount: durationOption.price,
      currency: 'gbp',
      paidAt: paid ? new Date() : undefined,
    },
  });

  const calendarResult = await createCalendarEvent(booking, customer);
  if (calendarResult) {
    booking.googleCalendar = calendarResult;
    await booking.save();
  }

  res.status(201).json({ success: true, booking });
});

// @route GET /api/admin/bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, from, to } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (from || to) filter.date = { ...(from && { $gte: from }), ...(to && { $lte: to }) };

  const bookings = await Booking.find(filter)
    .populate('customer', 'name email phone')
    .populate('service', 'name')
    .sort({ date: -1, startTime: -1 });

  res.json({ success: true, count: bookings.length, bookings });
});

// @route PUT /api/admin/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  booking.status = status;
  await booking.save();
  res.json({ success: true, booking });
});

module.exports = {
  checkAvailability,
  createBooking,
  getMyBookings,
  cancelMyBooking,
  adminCreateBooking,
  getAllBookings,
  updateBookingStatus,
  computeAvailableSlots,
  timeToMinutes,
  minutesToTime,
};

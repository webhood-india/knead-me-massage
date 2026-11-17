const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { generateInvoiceNumber } = require('../utils/generateRef');
const { generateInvoicePDF } = require('../utils/generateInvoice');
const { createCalendarEvent } = require('../utils/googleCalendar');
const {
  sendEmail,
  bookingConfirmationTemplate,
  adminNotificationTemplate,
} = require('../utils/sendEmail');
const { computeAvailableSlots, timeToMinutes, minutesToTime } = require('./bookingController');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const generateClaimToken = () => crypto.randomBytes(16).toString('hex');

/**
 * ============================================================================
 *  GIFT A TREATMENT
 * ============================================================================
 *  Instead of gifting a cash amount, the purchaser gifts a specific treatment.
 *  They pay for it through SumUp Hosted Checkout before the gift claim link is sent.
 *  No date/time is chosen at purchase time. The recipient gets an email with
 *  a one-time claim link; opening it lets them pick their own date/time and
 *  creates their account (or attaches to an existing session), at which
 *  point the booking is confirmed, invoiced, and synced to Google Calendar
 *  exactly like a normal booking.
 * ============================================================================
 */

// @route POST /api/gifts/purchase  (auth required — purchaser must be logged in)
const purchaseGift = asyncHandler(async (req, res) => {
  res.status(410);
  throw new Error('Gift purchases must use the SumUp checkout flow at POST /api/payments/gift/checkout.');
});

// @route GET /api/gifts/claim/:token  (public)
const getGiftByToken = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ giftClaimToken: req.params.token, isGift: true }).populate(
    'purchasedBy',
    'name'
  );
  if (!booking) {
    res.status(404);
    throw new Error('This gift link is invalid');
  }

  if (booking.payment.status !== 'paid') {
    res.status(402);
    throw new Error('This gift has not been paid for yet.');
  }

  if (booking.status !== 'pending_schedule') {
    return res.json({ success: true, claimed: true, serviceName: booking.serviceName });
  }

  res.json({
    success: true,
    claimed: false,
    serviceId: booking.service,
    serviceName: booking.serviceName,
    duration: booking.duration,
    price: booking.price,
    purchaserName: booking.purchasedBy?.name || 'a friend',
    recipientName: booking.giftRecipientName,
    recipientEmail: booking.giftRecipientEmail,
    message: booking.giftMessage,
  });
});

// @route GET /api/gifts/claim/:token/availability?date=  (public)
const getGiftAvailability = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    giftClaimToken: req.params.token,
    isGift: true,
    status: 'pending_schedule',
  });
  if (!booking) {
    res.status(404);
    throw new Error('This gift link is invalid or has already been claimed');
  }
  if (booking.payment.status !== 'paid') { res.status(402); throw new Error('This gift has not been paid for yet.'); }
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }
  const slots = await computeAvailableSlots(date, booking.duration);
  res.json({ success: true, date, duration: booking.duration, slots });
});

// @route POST /api/gifts/claim/:token  (optional auth — logged-in users skip account creation)
const claimGift = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ giftClaimToken: req.params.token, isGift: true });
  if (!booking) {
    res.status(404);
    throw new Error('This gift link is invalid');
  }
  if (booking.payment.status !== 'paid') { res.status(402); throw new Error('This gift has not been paid for yet.'); }
  if (booking.status !== 'pending_schedule') {
    res.status(400);
    throw new Error('This gift has already been claimed');
  }

  const { date, startTime, name, email, password } = req.body;
  if (!date || !startTime) {
    res.status(400);
    throw new Error('Please select a date and time');
  }

  const availableSlots = await computeAvailableSlots(date, booking.duration);
  if (!availableSlots.includes(startTime)) {
    res.status(409);
    throw new Error('Selected time slot is no longer available. Please choose another slot.');
  }

  let customer;
  if (req.user) {
    customer = req.user;
  } else {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email and password are required to create your account');
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400);
      throw new Error('An account with this email already exists — please log in first, then reopen this link.');
    }
    customer = await User.create({ name, email: email.toLowerCase(), password });
  }

  const endMinutes = timeToMinutes(startTime) + booking.duration;
  booking.customer = customer._id;
  booking.date = date;
  booking.startTime = startTime;
  booking.endTime = minutesToTime(endMinutes);
  booking.status = 'confirmed';
  booking.giftClaimedAt = new Date();

  const invoiceNumber = generateInvoiceNumber(booking.bookingRef);
  booking.invoice = { number: invoiceNumber, issuedAt: new Date() };
  const { filePath } = await generateInvoicePDF(booking, customer);
  booking.invoice.pdfPath = filePath;

  const calendarResult = await createCalendarEvent(booking, customer);
  if (calendarResult) booking.googleCalendar = calendarResult;

  await booking.save();

  const attachments = [{ filename: `${invoiceNumber}.pdf`, path: filePath }];
  try {
    await sendEmail({
      to: customer.email,
      subject: `Booking confirmed - ${booking.bookingRef}`,
      html: bookingConfirmationTemplate(booking, customer),
      attachments,
    });
    await sendEmail({
      to: process.env.NOTIFY_ADMIN_EMAIL,
      subject: `New booking (gifted): ${booking.bookingRef} - ${customer.name}`,
      html: adminNotificationTemplate(booking, customer),
      attachments,
    });
  } catch (err) {
    console.error('Email sending failed (gift claim still confirmed):', err.message);
  }

  const token = signToken(customer._id);
  res.json({
    success: true,
    token,
    user: { id: customer._id, name: customer.name, email: customer.email },
    booking,
  });
});

// @route GET /api/gifts/mine  (auth required) — treatments the logged-in user has gifted to others
const getMyGifts = asyncHandler(async (req, res) => {
  const gifts = await Booking.find({ purchasedBy: req.user._id, isGift: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: gifts.length, gifts });
});

// ---------- ADMIN ----------

// @route GET /api/admin/gifts
const getAllGifts = asyncHandler(async (req, res) => {
  const gifts = await Booking.find({ isGift: true })
    .populate('purchasedBy', 'name email')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: gifts.length, gifts });
});

module.exports = { purchaseGift, getGiftByToken, getGiftAvailability, claimGift, getMyGifts, getAllGifts };

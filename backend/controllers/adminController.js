const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStr = now.toISOString().slice(0, 10);

  const [revenueAgg, totalCustomers, upcomingBookings, todaysBookings, totalBookings] = await Promise.all([
    Booking.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]),
    User.countDocuments({}),
    Booking.find({ date: { $gte: todayStr }, status: { $in: ['confirmed', 'pending_payment'] } })
      .sort({ date: 1, startTime: 1 })
      .limit(10)
      .populate('customer', 'name email')
      .populate('service', 'name'),
    Booking.countDocuments({ date: todayStr, status: { $in: ['confirmed'] } }),
    Booking.countDocuments({}),
  ]);

  const revenueThisMonth = revenueAgg[0]?.total || 0;

  const revenueAllTimeAgg = await Booking.aggregate([
    { $match: { 'payment.status': 'paid' } },
    { $group: { _id: null, total: { $sum: '$price' } } },
  ]);

  res.json({
    success: true,
    stats: {
      revenueThisMonth,
      revenueAllTime: revenueAllTimeAgg[0]?.total || 0,
      totalCustomers,
      totalBookings,
      todaysBookingsCount: todaysBookings,
      upcomingBookings,
    },
  });
});

// @route GET /api/admin/customers
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find().select('-password').sort({ createdAt: -1 });

  // attach booking counts / total spend per customer
  const bookingStats = await Booking.aggregate([
    { $match: { 'payment.status': 'paid' } },
    { $group: { _id: '$customer', totalSpend: { $sum: '$price' }, totalBookings: { $sum: 1 } } },
  ]);
  const statsMap = Object.fromEntries(bookingStats.map((s) => [s._id.toString(), s]));

  const enriched = customers.map((c) => ({
    ...c.toObject(),
    totalSpend: statsMap[c._id.toString()]?.totalSpend || 0,
    totalBookings: statsMap[c._id.toString()]?.totalBookings || 0,
  }));

  res.json({ success: true, count: enriched.length, customers: enriched });
});

// @route GET /api/admin/analytics-link
const getAnalyticsLink = asyncHandler(async (req, res) => {
  res.json({ success: true, url: process.env.CLARITY_DASHBOARD_URL });
});

// @route GET /api/admin/calendar-embed-url
const getCalendarEmbedUrl = asyncHandler(async (req, res) => {
  res.json({ success: true, url: process.env.GOOGLE_CALENDAR_EMBED_URL || null });
});

module.exports = { getDashboardStats, getAllCustomers, getAnalyticsLink, getCalendarEmbedUrl };

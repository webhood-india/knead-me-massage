const Booking = require('../models/Booking');

/**
 * Generates a booking reference like KM-20260712-0007 (daily sequential counter).
 */
const generateBookingRef = async () => {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const countToday = await Booking.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const seq = String(countToday + 1).padStart(4, '0');
  return `KM-${datePart}-${seq}`;
};

const generateInvoiceNumber = (bookingRef) => `INV-${bookingRef.replace('KM-', '')}`;

/**
 * Generates a gift voucher code like KM-GIFT-7F3K9Q (short, human-typeable).
 */
const generateVoucherCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I)
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `KM-GIFT-${code}`;
};

module.exports = { generateBookingRef, generateInvoiceNumber, generateVoucherCode };

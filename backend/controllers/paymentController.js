const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { generateInvoicePDF } = require('../utils/generateInvoice');
const { generateInvoiceNumber } = require('../utils/generateRef');
const { createCalendarEvent } = require('../utils/googleCalendar');
const { sendEmail, bookingConfirmationTemplate, adminNotificationTemplate, giftPurchaserConfirmationTemplate, giftRecipientClaimTemplate } = require('../utils/sendEmail');
const { createHostedCheckout, getCheckout } = require('../utils/sumup');
const { generateBookingRef } = require('../utils/generateRef');
const crypto = require('crypto');

const finalizeBookingPayment = async (booking, paymentReference, provider = 'sumup') => {
  if (booking.payment.status === 'paid') return booking;
  const customer = await User.findById(booking.customer);
  if (!customer) throw new Error('Booking customer could not be found.');
  booking.status = 'confirmed';
  booking.payment.status = 'paid';
  booking.payment.provider = provider;
  booking.payment.reference = paymentReference;
  booking.payment.paidAt = new Date();
  const invoiceNumber = generateInvoiceNumber(booking.bookingRef);
  booking.invoice = { number: invoiceNumber, issuedAt: new Date() };
  const { filePath } = await generateInvoicePDF(booking, customer);
  booking.invoice.pdfPath = filePath;
  const calendarResult = await createCalendarEvent(booking, customer);
  if (calendarResult) booking.googleCalendar = calendarResult;
  await booking.save();
  await Transaction.create({ customer: customer._id, booking: booking._id, provider, paymentReference, amount: booking.price, currency: 'gbp', status: 'succeeded', invoiceNumber, invoicePdfPath: filePath });
  const attachments = [{ filename: `${invoiceNumber}.pdf`, path: filePath }];
  try {
    await sendEmail({ to: customer.email, subject: `Booking confirmed - ${booking.bookingRef}`, html: bookingConfirmationTemplate(booking, customer), attachments });
    if (process.env.NOTIFY_ADMIN_EMAIL) await sendEmail({ to: process.env.NOTIFY_ADMIN_EMAIL, subject: `New booking: ${booking.bookingRef} - ${customer.name}`, html: adminNotificationTemplate(booking, customer), attachments });
  } catch (err) { console.error('Booking confirmation email failed:', err.message); }
  return booking;
};

const finalizeGiftPayment = async (booking, paymentReference) => {
  if (booking.payment.status === 'paid') return booking;
  const purchaser = await User.findById(booking.purchasedBy);
  if (!purchaser) throw new Error('Gift purchaser could not be found.');
  booking.payment.status = 'paid';
  booking.payment.provider = 'sumup';
  booking.payment.reference = paymentReference;
  booking.payment.paidAt = new Date();
  await booking.save();
  await Transaction.create({ customer: purchaser._id, booking: booking._id, provider: 'sumup', paymentReference, amount: booking.price, currency: 'gbp', status: 'succeeded' });
  const claimUrl = `${(process.env.CLIENT_URL || 'https://kneadme.co.uk').replace(/\/$/, '')}/claim-gift/${booking.giftClaimToken}`;
  const emailData = { ...booking.toObject(), purchasedByName: purchaser.name };
  try {
    await sendEmail({ to: purchaser.email, subject: `Your gift for ${booking.giftRecipientName} is on its way`, html: giftPurchaserConfirmationTemplate(emailData) });
    await sendEmail({ to: booking.giftRecipientEmail, subject: "You've been gifted a treatment at Knead Me!", html: giftRecipientClaimTemplate(emailData, claimUrl) });
  } catch (err) { console.error('Gift confirmation email failed:', err.message); }
  return booking;
};

const createBookingCheckout = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.body.bookingId, customer: req.user._id });
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.isGift || !booking.date || !booking.startTime) { res.status(400); throw new Error('This is not a payable appointment booking.'); }
  if (booking.payment.status === 'paid') { res.status(409); throw new Error('Booking is already paid.'); }
  const checkout = await createHostedCheckout({ booking, description: `${booking.serviceName} appointment ${booking.bookingRef}` });
  res.json({ success: true, checkoutUrl: checkout.hosted_checkout_url, checkoutId: checkout.id });
});

const createGiftCheckout = asyncHandler(async (req, res) => {
  const { serviceId, duration, recipientName, recipientEmail, message } = req.body;
  if (!recipientName || !recipientEmail) { res.status(400); throw new Error('Recipient name and email are required'); }
  const Service = require('../models/Service');
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) { res.status(404); throw new Error('Treatment not found'); }
  const option = service.durationOptions.find((item) => item.duration === Number(duration));
  if (!option) { res.status(400); throw new Error('Selected duration is not available for this treatment'); }
  let giftClaimToken = crypto.randomBytes(16).toString('hex');
  while (await Booking.findOne({ giftClaimToken })) giftClaimToken = crypto.randomBytes(16).toString('hex');
  const booking = await Booking.create({
    bookingRef: await generateBookingRef(), service: service._id, serviceName: service.name,
    duration: Number(duration), price: option.price, status: 'pending_schedule', isGift: true,
    purchasedBy: req.user._id, giftRecipientName: recipientName.trim(),
    giftRecipientEmail: recipientEmail.toLowerCase().trim(), giftMessage: message, giftClaimToken,
    payment: { status: 'unpaid', provider: 'sumup', amount: option.price, currency: 'gbp' },
  });
  const checkout = await createHostedCheckout({ booking, description: `Gift treatment ${booking.bookingRef}` });
  res.status(201).json({ success: true, bookingId: booking._id, checkoutUrl: checkout.hosted_checkout_url });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, $or: [{ customer: req.user._id }, { purchasedBy: req.user._id }] });
  if (!booking) { res.status(404); throw new Error('Payment record not found'); }
  if (booking.payment.status !== 'paid') {
    if (!booking.payment.checkoutId) return res.json({ success: true, status: 'PENDING', booking });
    const checkout = await getCheckout(booking.payment.checkoutId);
    if (checkout.amount !== Number(booking.price.toFixed(2)) || checkout.currency !== 'GBP' || checkout.checkout_reference !== booking.payment.checkoutReference) {
      res.status(409); throw new Error('SumUp payment details do not match this booking.');
    }
    const successfulTransaction = (checkout.transactions || []).find((tx) => tx.status === 'SUCCESSFUL' && Number(tx.amount) === Number(booking.price.toFixed(2)) && tx.currency === 'GBP');
    if (checkout.status === 'PAID' && successfulTransaction) {
      if (booking.isGift) await finalizeGiftPayment(booking, successfulTransaction.transaction_code || checkout.id);
      else await finalizeBookingPayment(booking, successfulTransaction.transaction_code || checkout.id, 'sumup');
    } else if (['FAILED', 'EXPIRED'].includes(checkout.status)) {
      booking.payment.status = 'failed';
      await booking.save();
    }
  }
  const fresh = await Booking.findById(booking._id);
  res.json({ success: true, status: fresh.payment.status === 'paid' ? 'PAID' : fresh.payment.status.toUpperCase(), booking: fresh });
});

const sumupWebhook = asyncHandler(async (req, res) => {
  const checkoutId = req.body?.id || req.body?.checkout_id;
  if (!checkoutId) return res.status(400).json({ success: false, message: 'Missing SumUp checkout id' });
  const checkout = await getCheckout(checkoutId);
  const booking = await Booking.findOne({ 'payment.checkoutId': checkout.id, 'payment.checkoutReference': checkout.checkout_reference });
  if (!booking) return res.status(200).json({ success: true, ignored: true });
  if (checkout.status === 'PAID' && Number(checkout.amount) === Number(booking.price.toFixed(2)) && checkout.currency === 'GBP' && checkout.checkout_reference === booking.payment.checkoutReference) {
    const tx = (checkout.transactions || []).find((item) => item.status === 'SUCCESSFUL' && Number(item.amount) === Number(booking.price.toFixed(2)) && item.currency === 'GBP');
    if (tx) {
      if (booking.isGift) await finalizeGiftPayment(booking, tx.transaction_code || checkout.id);
      else await finalizeBookingPayment(booking, tx.transaction_code || checkout.id, 'sumup');
    }
  }
  res.json({ success: true });
});

module.exports = { createBookingCheckout, createGiftCheckout, verifyPayment, sumupWebhook, finalizeBookingPayment };

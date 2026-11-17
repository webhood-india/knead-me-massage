const express = require('express');
const router = express.Router();
const { createBookingCheckout, createGiftCheckout, verifyPayment, sumupWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/booking/checkout', protect, createBookingCheckout);
router.post('/gift/checkout', protect, createGiftCheckout);
router.get('/verify/:bookingId', protect, verifyPayment);
router.post('/sumup/webhook', sumupWebhook);

module.exports = router;

const express = require('express');
const router = express.Router();
const { checkAvailability, createBooking, getMyBookings, cancelMyBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/availability', checkAvailability);
router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelMyBooking);

module.exports = router;

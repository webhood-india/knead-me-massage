const express = require('express');
const router = express.Router();
const { purchaseGift, getGiftByToken, getGiftAvailability, claimGift, getMyGifts } = require('../controllers/giftController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

router.post('/purchase', protect, purchaseGift); // must be logged in to buy a gift
router.get('/claim/:token', getGiftByToken);
router.get('/claim/:token/availability', getGiftAvailability);
router.post('/claim/:token', optionalAuth, claimGift); // logged-in users skip account creation
router.get('/mine', protect, getMyGifts);

module.exports = router;

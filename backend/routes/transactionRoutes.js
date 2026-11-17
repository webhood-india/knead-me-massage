const express = require('express');
const router = express.Router();
const { getMyTransactions, downloadInvoice } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/mine', protect, getMyTransactions);
router.get('/:id/invoice', protect, downloadInvoice);

module.exports = router;

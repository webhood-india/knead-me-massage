const asyncHandler = require('express-async-handler');
const path = require('path');
const Transaction = require('../models/Transaction');

// @route GET /api/transactions/mine  (auth required)
const getMyTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ customer: req.user._id })
    .populate('booking', 'bookingRef serviceName date startTime status')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: transactions.length, transactions });
});

// @route GET /api/transactions/:id/invoice  (auth required, own invoice only) - downloads PDF
const downloadInvoice = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, customer: req.user._id });
  if (!transaction || !transaction.invoicePdfPath) {
    res.status(404);
    throw new Error('Invoice not found');
  }
  res.download(transaction.invoicePdfPath, `${transaction.invoiceNumber}.pdf`);
});

module.exports = { getMyTransactions, downloadInvoice };

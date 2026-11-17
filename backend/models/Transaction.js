const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    provider: { type: String, default: 'sumup' },
    paymentReference: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'gbp' },
    status: { type: String, enum: ['succeeded', 'failed', 'refunded', 'pending'], default: 'pending' },
    invoiceNumber: String,
    invoicePdfPath: String,
    method: { type: String, default: 'card' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

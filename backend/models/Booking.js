const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, unique: true, required: true }, // e.g. KM-20260712-0001

    // customer is the person who will actually attend/receive the treatment.
    // For a normal booking this is set immediately. For a gifted treatment, this stays
    // unset until the recipient claims it and creates/links their account.
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

    // snapshot of service/price info at time of booking (so later edits to Services don't rewrite history)
    serviceName: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, required: true }, // GBP

    // Date/time are unset until a slot is chosen — immediately for a normal booking,
    // or later by the recipient for a gifted treatment.
    date: { type: String }, // 'YYYY-MM-DD'
    startTime: { type: String }, // '14:00'
    endTime: { type: String }, // computed from duration

    customerNotes: { type: String, trim: true },

    status: {
      type: String,
      enum: ['pending_payment', 'pending_schedule', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'pending_payment',
      // pending_schedule = a gifted treatment that's paid for but the recipient hasn't picked a date/time yet
    },

    payment: {
      status: { type: String, enum: ['unpaid', 'paid', 'refunded', 'failed'], default: 'unpaid' },
      provider: { type: String, default: 'sumup' },
      reference: String,
      checkoutId: String,
      checkoutReference: String,
      amount: Number,
      currency: { type: String, default: 'gbp' },
      paidAt: Date,
    },

    invoice: {
      number: String,
      pdfPath: String, // stored file path/URL
      issuedAt: Date,
    },

    googleCalendar: {
      eventId: String,
      htmlLink: String,
    },

    bookingSource: { type: String, enum: ['online', 'admin'], default: 'online' }, // admin = manually added by clinic staff

    // ---- Gift-a-Treatment ----
    isGift: { type: Boolean, default: false },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who bought it (only set if isGift)
    giftRecipientName: String,
    giftRecipientEmail: String,
    giftMessage: { type: String, trim: true },
    giftClaimToken: { type: String, unique: true, sparse: true },
    giftClaimedAt: Date,

    cancellationReason: String,
  },
  { timestamps: true }
);

bookingSchema.index({ date: 1, startTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

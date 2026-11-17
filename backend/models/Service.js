const mongoose = require('mongoose');
const slugify = require('slugify');

// Each treatment can have multiple duration/price options, e.g.
// Deep Tissue Massage -> 30min £80, 45min £100, 60min £120
const durationOptionSchema = new mongoose.Schema(
  {
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, required: true }, // GBP
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      enum: ['Deep Tissue', 'Swedish', 'Sports', 'Relaxation', 'Recovery', 'Stress Relief', 'Specialist', 'Other'],
      default: 'Other',
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    benefits: [{ type: String }],
    image: { type: String }, // URL / uploaded path
    durationOptions: {
      type: [durationOptionSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    isCorporate: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // display order in treatment list
  },
  { timestamps: true }
);

serviceSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);

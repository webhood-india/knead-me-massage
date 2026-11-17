const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true }, // rich text / HTML from admin editor
    coverImage: { type: String },
    author: { type: String, default: 'Knead Me Team' },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);

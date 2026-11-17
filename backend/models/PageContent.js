const mongoose = require('mongoose');

// Content itself is a flexible JSON blob (Mixed) — the *shape* of that JSON (which sections/fields
// exist, their labels and input types) is defined in code at cms/pageSchemas.js, not in the DB.
// This means adding a new editable field later is a one-line schema change, no migration needed.
const pageContentSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true }, // 'home', 'about', 'site-settings', etc.
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema);

const asyncHandler = require('express-async-handler');
const PageContent = require('../models/PageContent');
const { getPageSchema, getAllPageKeys, PAGE_SCHEMAS } = require('../cms/pageSchemas');
const cmsCache = require('../utils/cmsCache');

// @route GET /api/cms/:pageKey  (public — served entirely from the in-memory cache, no DB hit)
const getPublicPageContent = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  if (!getPageSchema(pageKey)) {
    res.status(404);
    throw new Error('Unknown page');
  }
  const content = cmsCache.getPage(pageKey) || {};
  res.set('Cache-Control', 'public, max-age=60'); // short browser cache; cache is already near-instant server-side
  res.json({ success: true, pageKey, content });
});

// @route GET /api/cms/site-settings  (convenience alias, same as above but explicit for the frontend)
const getSiteSettings = asyncHandler(async (req, res) => {
  const content = cmsCache.getPage('site-settings') || {};
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ success: true, content });
});

// ---------- ADMIN ----------

// @route GET /api/admin/cms/pages  — list of editable pages (from the schema, not the DB)
const getPagesList = asyncHandler(async (req, res) => {
  const pages = getAllPageKeys().map((key) => ({
    pageKey: key,
    label: PAGE_SCHEMAS[key].label,
    description: PAGE_SCHEMAS[key].description || null,
    sectionCount: PAGE_SCHEMAS[key].sections.length,
  }));
  res.json({ success: true, pages });
});

// @route GET /api/admin/cms/pages/:pageKey  — schema (for rendering the form) + current content (prefilled)
const getPageForEdit = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  const schema = getPageSchema(pageKey);
  if (!schema) {
    res.status(404);
    throw new Error('Unknown page');
  }
  // Read current content straight from cache (already in memory, always up to date with the DB
  // since every save updates both together) — admin editor load is just as cheap as a public read.
  const content = cmsCache.getPage(pageKey) || {};
  res.json({ success: true, pageKey, schema, content });
});

// @route PUT /api/admin/cms/pages/:pageKey  — save edits: write DB, then update the in-memory cache
const updatePageContent = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  const schema = getPageSchema(pageKey);
  if (!schema) {
    res.status(404);
    throw new Error('Unknown page');
  }

  const { content } = req.body;
  if (!content || typeof content !== 'object') {
    res.status(400);
    throw new Error('content must be an object');
  }

  const doc = await PageContent.findOneAndUpdate(
    { pageKey },
    { pageKey, content },
    { upsert: true, new: true, runValidators: true }
  );

  // Update the live cache immediately — the very next public request for this page
  // (even one that arrives before this response finishes sending) gets the new content.
  cmsCache.setPage(pageKey, doc.content);

  res.json({ success: true, pageKey, content: doc.content });
});

module.exports = { getPublicPageContent, getSiteSettings, getPagesList, getPageForEdit, updatePageContent };

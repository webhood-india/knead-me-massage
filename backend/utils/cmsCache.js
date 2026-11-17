/**
 * ============================================================================
 *  CMS IN-MEMORY CACHE
 * ============================================================================
 *  This is what keeps the CMS from slowing the site down. Public content
 *  reads NEVER query MongoDB — they read from this plain in-memory Map,
 *  which is:
 *    - populated once when the server boots (loadCacheFromDB)
 *    - updated in-place the instant an admin saves a page (setPage)
 *
 *  A request for /api/cms/:pageKey is therefore just a Map lookup + JSON
 *  serialization of data already sitting in RAM — the same cost as any other
 *  static in-memory response, regardless of how many pages/fields exist.
 *
 *  Scaling note: this works perfectly for a single Node process (the normal
 *  setup for a site this size — one server via PM2/Render/Railway). If this
 *  is ever horizontally scaled to multiple server instances behind a load
 *  balancer, each instance would need to reload its cache on save (e.g. via
 *  a lightweight pub/sub or a shared cache like Redis) — flagging this now
 *  so it's a known, easy follow-up rather than a surprise later.
 * ============================================================================
 */

const PageContent = require('../models/PageContent');
const { getAllPageKeys } = require('../cms/pageSchemas');

const cache = new Map();

const loadCacheFromDB = async () => {
  const docs = await PageContent.find({});
  cache.clear();
  for (const doc of docs) {
    cache.set(doc.pageKey, doc.content);
  }
  console.log(`CMS cache loaded: ${cache.size} page(s) in memory`);
};

const getPage = (pageKey) => cache.get(pageKey) || null;

const getAllPages = () => {
  const result = {};
  for (const key of getAllPageKeys()) {
    result[key] = cache.get(key) || {};
  }
  return result;
};

const setPage = (pageKey, content) => {
  cache.set(pageKey, content);
};

module.exports = { loadCacheFromDB, getPage, getAllPages, setPage };

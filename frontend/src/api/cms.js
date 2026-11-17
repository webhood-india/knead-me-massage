import { useEffect, useState } from 'react';
import { api } from './client';

// Module-level cache (outside React state) so navigating between pages within the same
// browser session doesn't refetch content that's already been loaded once.
const pageCache = new Map();
let siteSettingsCache = null;
let siteSettingsPromise = null;

/**
 * Deep-merges CMS content over a set of local defaults, so any field not yet set in the
 * CMS (e.g. before the seed script has run) still renders sensible copy instead of blanks.
 */
function mergeDeep(defaults, override) {
  if (!override) return defaults;
  if (Array.isArray(defaults)) {
    return Array.isArray(override) && override.length > 0 ? override : defaults;
  }
  if (typeof defaults === 'object' && defaults !== null) {
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (override[key] !== undefined) result[key] = mergeDeep(defaults[key], override[key]);
    }
    return result;
  }
  return override !== undefined && override !== '' ? override : defaults;
}

/**
 * useCmsPage('home', DEFAULTS) — fetches CMS content for a page once (cached for the
 * session), merged over local defaults. Never blocks rendering — `content` starts as
 * `defaults` immediately, then updates in place once the (fast, cache-backed) fetch resolves.
 */
export function useCmsPage(pageKey, defaults) {
  const [content, setContent] = useState(pageCache.get(pageKey) || defaults);

  useEffect(() => {
    if (pageCache.has(pageKey)) {
      setContent(mergeDeep(defaults, pageCache.get(pageKey)));
      return;
    }
    api
      .get(`/cms/${pageKey}`)
      .then((res) => {
        pageCache.set(pageKey, res.data.content);
        setContent(mergeDeep(defaults, res.data.content));
      })
      .catch(() => {
        /* CMS not seeded yet or offline — keep showing defaults, never break the page */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return content;
}

/**
 * useSiteSettings(DEFAULTS) — global contact info/links used in Navbar, Footer, WhatsApp button.
 */
export function useSiteSettings(defaults) {
  const [settings, setSettings] = useState(siteSettingsCache || defaults);

  useEffect(() => {
    if (siteSettingsCache) {
      setSettings(mergeDeep(defaults, siteSettingsCache));
      return;
    }
    if (!siteSettingsPromise) {
      siteSettingsPromise = api.get('/cms/site-settings');
    }
    siteSettingsPromise
      .then((res) => {
        siteSettingsCache = res.data.content;
        setSettings(mergeDeep(defaults, res.data.content));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return settings;
}

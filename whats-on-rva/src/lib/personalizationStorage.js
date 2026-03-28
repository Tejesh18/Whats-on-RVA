/** Saved categories, price preference, and story view history for “For you”. */

const CAT = 'rva_saved_categories_v1';
const PRICE = 'rva_price_preference_v1';
const VIEWED = 'rva_viewed_stories_v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function getSavedCategories() {
  const arr = readJson(CAT, []);
  return new Set(Array.isArray(arr) ? arr : []);
}

export function toggleSavedCategory(name) {
  if (!name) return getSavedCategories();
  const s = getSavedCategories();
  if (s.has(name)) s.delete(name);
  else s.add(name);
  writeJson(CAT, [...s]);
  return s;
}

/** @returns {'any'|'free'|'paid'} */
export function getPricePreference() {
  const v = readJson(PRICE, 'any');
  return v === 'free' || v === 'paid' ? v : 'any';
}

export function setPricePreference(pref) {
  writeJson(PRICE, pref === 'free' || pref === 'paid' ? pref : 'any');
}

export function recordStoryView(slug) {
  if (!slug) return;
  const arr = readJson(VIEWED, []);
  const next = [{ slug, at: Date.now() }, ...arr.filter((x) => x.slug !== slug)].slice(0, 24);
  writeJson(VIEWED, next);
}

export function getViewedStorySlugsOrdered() {
  return readJson(VIEWED, []).map((x) => x.slug);
}

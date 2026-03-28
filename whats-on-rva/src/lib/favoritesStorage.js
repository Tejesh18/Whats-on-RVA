const EV = 'rva_fav_events_v1';
const NH = 'rva_fav_neighborhoods_v1';
const ST = 'rva_fav_stories_v1';

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

export function getFavoriteEventIds() {
  const arr = readJson(EV, []);
  return new Set(Array.isArray(arr) ? arr : []);
}

export function toggleFavoriteEvent(id) {
  const s = getFavoriteEventIds();
  if (s.has(id)) s.delete(id);
  else s.add(id);
  writeJson(EV, [...s]);
  return s;
}

export function getFavoriteNeighborhoods() {
  const arr = readJson(NH, []);
  return new Set(Array.isArray(arr) ? arr : []);
}

export function toggleFavoriteNeighborhood(name) {
  const s = getFavoriteNeighborhoods();
  if (s.has(name)) s.delete(name);
  else s.add(name);
  writeJson(NH, [...s]);
  return s;
}

export function getFavoriteStorySlugs() {
  const arr = readJson(ST, []);
  return new Set(Array.isArray(arr) ? arr : []);
}

export function toggleFavoriteStory(slug) {
  const s = getFavoriteStorySlugs();
  if (s.has(slug)) s.delete(slug);
  else s.add(slug);
  writeJson(ST, [...s]);
  return s;
}

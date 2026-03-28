/**
 * City of Richmond, VA — tight WGS84 box (excludes Petersburg, Tri-Cities, most Henrico/Chesterfield).
 * Coordinates are approximate; tweak in one place if you need a wider/narrower footprint.
 */
export const RICHMOND_VA_BOUNDS = {
  south: 37.465,
  north: 37.615,
  west: -77.585,
  east: -77.375,
};

/** Lowercase needles — venue/title/city text must not match these (catches mis-tagged regional listings). */
const OUT_OF_CITY_PATTERN =
  /\b(petersburg|petersberg|hopewell|colonial heights|fredericksburg|lynchburg|charlottesville|norfolk|virginia beach|chesapeake|suffolk|portsmouth|roanoke|harrisonburg|stafford|spotsylvania|chesterfield|midlothian|mechanicsville|ashland|montpelier)\b/i;

/**
 * @param {number} lat
 * @param {number} lng
 */
export function isWithinRichmondVaBounds(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  const { south, north, west, east } = RICHMOND_VA_BOUNDS;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

/**
 * @param {string} [text]
 */
export function mentionsOutOfCityArea(text) {
  if (!text || typeof text !== 'string') return false;
  return OUT_OF_CITY_PATTERN.test(text);
}

/**
 * CultureWorks / listings without coordinates: only keep if copy clearly ties to Richmond city.
 * @param {{ geo?: { city?: string }; title?: string; venue?: string; neighborhood?: string }} | Record<string, unknown>} fields
 */
export function passesRichmondTextGate(fields) {
  const city = String(fields.geo?.city ?? '').trim();
  const blob = [
    city,
    fields.title,
    fields.venue,
    fields.neighborhood,
  ]
    .filter(Boolean)
    .join(' ');
  if (mentionsOutOfCityArea(blob)) return false;
  if (city && !/^richmond\b/i.test(city)) return false;
  if (!city) {
    const hint = [fields.title, fields.venue, fields.neighborhood].filter(Boolean).join(' ');
    if (!/\brichmond\b|\brva\b|downtown rva|fan district|scott'?s addition|church hill|museum district|carytown\b/i.test(hint)) {
      return false;
    }
  }
  return true;
}

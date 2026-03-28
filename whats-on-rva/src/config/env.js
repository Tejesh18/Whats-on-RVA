/**
 * Runtime configuration for partner / deploy environments.
 * Vite exposes only variables prefixed with VITE_ to the client bundle.
 *
 * Future integration points:
 * - VITE_EVENTBRITE_ORG_IDS — comma-separated org IDs for serverless or proxy calls
 * - VITE_RSS_FEED_URLS — comma-separated RSS endpoints
 * - VITE_API_PROXY_BASE — optional same-origin proxy path if a thin backend is added
 */

/** @type {string} */
const cw =
  import.meta.env.VITE_CULTUREWORKS_EVENTS_URL ||
  'https://calendar.richmondcultureworks.org/api/2/events';

/** @type {string} */
const defaultImg =
  import.meta.env.VITE_DEFAULT_EVENT_IMAGE_URL ||
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80';

/** CultureWorks Localist events JSON endpoint (configurable per environment). */
export const cultureWorksEventsUrl = cw.replace(/\/$/, '');

/** Fallback image when a source omits artwork. */
export const defaultEventImageUrl = defaultImg;

/** Richmond timezone for display / “tonight” logic (single place to change for other metros). */
export const richmondTimeZone = import.meta.env.VITE_EVENT_TIMEZONE || 'America/New_York';

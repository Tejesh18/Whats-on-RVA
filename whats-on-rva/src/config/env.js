/**
 * Environment-backed settings (Vite exposes `VITE_*` to the client).
 */

/** @type {string} */
const cw =
  import.meta.env.VITE_CULTUREWORKS_EVENTS_URL ||
  'https://calendar.richmondcultureworks.org/api/2/events';

/** @type {string} */
const defaultImg =
  import.meta.env.VITE_DEFAULT_EVENT_IMAGE_URL ||
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80';

export const cultureWorksEventsUrl = cw.replace(/\/$/, '');

export const defaultEventImageUrl = defaultImg;

export const richmondTimeZone = import.meta.env.VITE_EVENT_TIMEZONE || 'America/New_York';

/**
 * Source adapters — only place that may know raw API / feed shapes.
 *
 * Pattern (repeat per source):
 *   1. fetch (or read) the raw payload.
 *   2. map each record through a normalize* function → NormalizedEvent (see lib/normalizedEvent.js).
 *   3. export fetch*Normalized() returning NormalizedEvent[].
 *
 * Plug-in points for new sources:
 *   • Eventbrite → implement fetchEventbriteNormalized() body; call from eventService.getEvents() when ready.
 *   • RSS       → implement fetchRssNormalized() body; same merge step.
 *   • Mock      → fetchMockNormalized() — bundled fallback, same schema as live adapters.
 *
 * UI and components must never import this file — only eventService.js orchestrates adapters.
 */

import { mockEvents } from '../data/mockEvents.js';
import { cultureWorksEventsUrl, defaultEventImageUrl } from '../config/env.js';

/** Bundled fallback — already NormalizedEvent-shaped; keeps mock on the same adapter path as live sources. */
export async function fetchMockNormalized() {
  return Promise.resolve([...mockEvents]);
}

function stripRichText(s) {
  if (!s) return '';
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function pickFilterName(filters, key) {
  const arr = filters?.[key];
  return Array.isArray(arr) && arr[0]?.name ? arr[0].name : '';
}

function audienceAccessibilityBadges(filters) {
  const aud = filters?.event_target_audience;
  if (!Array.isArray(aud)) return [];
  return aud
    .map((a) => a.name)
    .filter((n) =>
      /wheelchair|accessible|ada|hearing|audio description|low vision|blind/i.test(n)
    );
}

function detailViewsBelow(e, max) {
  const v = e.detail_views;
  return typeof v !== 'number' || v <= max;
}

/**
 * Map one Localist API node to NormalizedEvent.
 * @param {object} node — `{ event: {...} }` or raw event object
 * @param {string} fallbackListingUrl — used when event has no external URL
 */
export function normalizeCultureWorksNode(node, fallbackListingUrl) {
  const e = node.event ?? node;
  const inst = e.event_instances?.[0]?.event_instance;
  const ranking = typeof inst?.ranking === 'number' ? inst.ranking : 1;
  const startRaw = inst?.start || (e.first_date ? `${e.first_date}T12:00:00` : null);
  if (!startRaw) return null;

  const startTime = new Date(startRaw).toISOString();
  let endTime;
  if (inst?.end) {
    endTime = new Date(inst.end).toISOString();
  } else if (inst?.all_day) {
    const d = new Date(startTime);
    d.setUTCHours(d.getUTCHours() + 10);
    endTime = d.toISOString();
  } else {
    const d = new Date(startTime);
    d.setUTCHours(d.getUTCHours() + 2);
    endTime = d.toISOString();
  }

  const priceName = pickFilterName(e.filters, 'event_price');
  const priceNameLower = priceName.toLowerCase();
  const ticketLower = e.ticket_cost ? String(e.ticket_cost).toLowerCase() : '';
  const isFree =
    e.free === true || priceNameLower === 'free' || ticketLower === 'free';

  let price = null;
  if (!isFree && e.ticket_cost) price = String(e.ticket_cost).trim();
  else if (!isFree && priceName && priceNameLower !== 'free') price = priceName;

  const region = pickFilterName(e.filters, 'event_region');
  const city = e.geo?.city;
  const neighborhood =
    region ||
    (city && city.toLowerCase().includes('richmond') ? 'Richmond' : '') ||
    'Richmond area';

  const category =
    pickFilterName(e.filters, 'event_type') ||
    pickFilterName(e.filters, 'event_topic') ||
    'Arts & culture';

  const venue =
    e.location_name?.trim() ||
    e.address?.trim() ||
    e.geo?.street ||
    'Venue see listing';

  const desc = stripRichText(e.description_text || e.description || '');
  const description =
    desc.length > 320 ? `${desc.slice(0, 317).trim()}…` : desc || 'See source for details.';

  const rawTags = [
    ...(Array.isArray(e.tags) ? e.tags : []),
    ...(Array.isArray(e.keywords) ? e.keywords : []),
  ]
    .map((t) => String(t).trim())
    .filter(Boolean);

  const seen = new Set();
  const uniqueTags = [];
  for (const t of rawTags) {
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    uniqueTags.push(t);
    if (uniqueTags.length >= 8) break;
  }

  const accessibilityBadges = audienceAccessibilityBadges(e.filters);

  const sponsored = e.sponsored === true;
  const featured = e.featured === true;
  const hiddenGem =
    !featured && !sponsored && ranking < 0.22 && detailViewsBelow(e, 120);

  const sourceUrl =
    (e.url && String(e.url).trim()) || e.localist_url || fallbackListingUrl;

  return {
    id: `cw-${e.id}`,
    title: e.title || 'Untitled event',
    category,
    neighborhood,
    venue,
    startTime,
    endTime,
    isFree,
    price,
    description,
    sourceName: 'CultureWorks Localist',
    sourceUrl,
    imageUrl: e.photo_url || defaultEventImageUrl,
    featured,
    hiddenGem,
    tags: uniqueTags,
    accessibilityBadges,
  };
}

/**
 * Fetch CultureWorks Localist and return normalized events (empty array on hard failure).
 * @param {string} [eventsUrl] — defaults from env via caller
 */
export async function fetchCultureWorksNormalized(eventsUrl = cultureWorksEventsUrl) {
  const url = `${eventsUrl}${eventsUrl.includes('?') ? '&' : '?'}pp=50`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`CultureWorks HTTP ${res.status}`);

  const data = await res.json();
  const rawList = data.events ?? data;
  if (!Array.isArray(rawList)) return [];

  const mapped = rawList
    .map((n) => normalizeCultureWorksNode(n, eventsUrl))
    .filter(Boolean);

  mapped.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return mapped;
}

/**
 * Eventbrite — skeleton. Next step: org/venue IDs via env + token (prefer serverless proxy).
 * @returns {Promise<import('../lib/normalizedEvent.js').NormalizedEvent[]>}
 */
export async function fetchEventbriteNormalized() {
  return [];
}

/**
 * RSS — skeleton. Next step: parse VITE_RSS_FEED_URLS and map items → NormalizedEvent.
 * @returns {Promise<import('../lib/normalizedEvent.js').NormalizedEvent[]>}
 */
export async function fetchRssNormalized() {
  return [];
}

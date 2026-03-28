/**
 * Fetches raw CultureWorks JSON and maps it to the app’s event shape.
 * Eventbrite search when a dev proxy or production proxy URL is configured.
 */

import { mockEvents } from '../data/mockEvents.js';
import { cultureWorksEventsUrl, defaultEventImageUrl } from '../config/env.js';
import {
  isWithinRichmondVaBounds,
  mentionsOutOfCityArea,
  passesRichmondTextGate,
} from '../lib/richmondBounds.js';

export async function fetchMockNormalized() {
  const kept = mockEvents.filter((ev) => {
    if (typeof ev.latitude === 'number' && typeof ev.longitude === 'number') {
      return isWithinRichmondVaBounds(ev.latitude, ev.longitude);
    }
    const blob = `${ev.venue} ${ev.neighborhood} ${ev.title}`;
    return !mentionsOutOfCityArea(blob) && /\brichmond\b|\brva\b/i.test(blob);
  });
  return Promise.resolve(kept);
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

  const lat = parseFloat(e.geo?.latitude);
  const lng = parseFloat(e.geo?.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  if (hasCoords) {
    if (!isWithinRichmondVaBounds(lat, lng)) return null;
  } else {
    if (
      !passesRichmondTextGate({
        geo: e.geo,
        title: e.title,
        venue: e.location_name || e.address,
        neighborhood: region,
      })
    ) {
      return null;
    }
  }

  const textBlob = `${e.title} ${e.location_name} ${e.address} ${region}`;
  if (mentionsOutOfCityArea(textBlob)) return null;

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
    sourceName: 'CultureWorks',
    sourceUrl,
    imageUrl: e.photo_url || defaultEventImageUrl,
    featured,
    hiddenGem,
    tags: uniqueTags,
    accessibilityBadges,
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
  };
}

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

function eventbriteApiBase() {
  if (import.meta.env.DEV) return '/eventbrite-api';
  const p = import.meta.env.VITE_EVENTBRITE_PROXY?.replace(/\/$/, '');
  return p || '';
}

function ebStrip(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEventbriteEvent(raw) {
  const v = raw.venue;
  const lat = v?.latitude != null ? parseFloat(v.latitude) : NaN;
  const lng = v?.longitude != null ? parseFloat(v.longitude) : NaN;
  const city = v?.address?.localized_city || v?.address?.city || '';

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    if (!isWithinRichmondVaBounds(lat, lng)) return null;
  } else {
    const blob = `${raw.name?.text ?? ''} ${v?.name ?? ''} ${city}`;
    if (mentionsOutOfCityArea(blob)) return null;
    if (city && !/^richmond\b/i.test(String(city).trim())) return null;
  }

  const startUtc = raw.start?.utc;
  if (!startUtc) return null;
  const startTime = new Date(startUtc).toISOString();
  let endTime = startTime;
  if (raw.end?.utc) {
    endTime = new Date(raw.end.utc).toISOString();
  } else {
    const d = new Date(startTime);
    d.setUTCHours(d.getUTCHours() + 3);
    endTime = d.toISOString();
  }

  const descHtml = raw.description?.text || '';
  const desc = ebStrip(descHtml);
  const description =
    desc.length > 280 ? `${desc.slice(0, 277).trim()}…` : desc || 'See Eventbrite for details.';

  const venueName = v?.name?.trim() || 'Venue on Eventbrite';
  const neighborhood = /^richmond/i.test(String(city).trim()) ? 'Richmond' : 'Richmond area';

  const isFree = raw.is_free === true;
  const logo = raw.logo?.url ? raw.logo.url.replace(/http:/, 'https:') : null;

  return {
    id: `eb-${raw.id}`,
    title: raw.name?.text?.trim() || 'Eventbrite event',
    category: 'Eventbrite',
    neighborhood,
    venue: venueName,
    startTime,
    endTime,
    isFree,
    price: isFree ? null : 'See Eventbrite',
    description,
    sourceName: 'Eventbrite',
    sourceUrl: raw.url || 'https://www.eventbrite.com',
    imageUrl: logo || defaultEventImageUrl,
    featured: false,
    hiddenGem: false,
    tags: [],
    accessibilityBadges: [],
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
  };
}

/**
 * Eventbrite’s API blocks browser CORS. In dev, Vite proxies `/eventbrite-api` with `EVENTBRITE_PRIVATE_TOKEN`.
 * For production, set `VITE_EVENTBRITE_PROXY` to your own serverless URL that forwards to Eventbrite with the token.
 */
export async function fetchEventbriteNormalized() {
  const base = eventbriteApiBase();
  if (!base) return [];

  const params = new URLSearchParams({
    'location.address': 'Richmond, VA, USA',
    'location.within': '8km',
    expand: 'venue',
  });

  try {
    const res = await fetch(`${base}/events/search/?${params}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = data.events;
    if (!Array.isArray(list)) return [];
    const mapped = list.map(normalizeEventbriteEvent).filter(Boolean);
    mapped.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return mapped;
  } catch {
    return [];
  }
}

export async function fetchRssNormalized() {
  return [];
}

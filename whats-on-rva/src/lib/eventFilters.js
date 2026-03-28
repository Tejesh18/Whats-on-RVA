/** Search, filters, and date helpers for event objects. */
import { todayYmdRichmond } from '../data/mockEvents.js';
import { richmondTimeZone as RICHMOND_TZ } from '../config/env.js';
import { NEIGHBORHOOD_SPOTLIGHTS } from '../data/neighborhoodStories.js';

/**
 * Match feed filter to an event neighborhood (exact, substring, or spotlight regex).
 */
export function neighborhoodMatchesFilter(eventNeighborhood, filterValue) {
  if (!filterValue) return true;
  const ev = String(eventNeighborhood || '');
  if (!ev) return false;
  if (ev === filterValue) return true;
  const evL = ev.toLowerCase();
  const fvL = String(filterValue).toLowerCase();
  if (evL.includes(fvL) || fvL.includes(evL)) return true;
  const spotlight = NEIGHBORHOOD_SPOTLIGHTS.find(
    (s) => s.label === filterValue || s.label.toLowerCase() === fvL
  );
  if (spotlight && spotlight.match.test(ev)) return true;
  return false;
}

/**
 * "Tonight / later today" = same calendar day in Richmond and either
 * an evening start (5pm+) or the event start is still in the future.
 */
export function isTonightRichmond(event, now = new Date()) {
  const eventDay = todayYmdRichmond(new Date(event.startTime));
  const today = todayYmdRichmond(now);
  if (eventDay !== today) return false;

  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: RICHMOND_TZ,
      hour: 'numeric',
      hour12: false,
    })
      .formatToParts(new Date(event.startTime))
      .find((p) => p.type === 'hour')?.value
  );

  const start = new Date(event.startTime).getTime();
  if (start >= now.getTime()) return true;
  return hour >= 17;
}

export function formatEventWhen(iso) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: RICHMOND_TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Two-line date chip for cards (Richmond wall clock). */
export function formatEventDayBadge(iso) {
  const d = new Date(iso);
  const month = new Intl.DateTimeFormat('en-US', { timeZone: RICHMOND_TZ, month: 'short' }).format(d);
  const day = new Intl.DateTimeFormat('en-US', { timeZone: RICHMOND_TZ, day: 'numeric' }).format(d);
  return { month, day: String(day) };
}

export function matchesQuery(event, q) {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const tagStr = Array.isArray(event.tags) ? event.tags.join(' ') : '';
  const hay = [
    event.title,
    event.venue,
    event.neighborhood,
    event.category,
    event.description,
    event.sourceName,
    tagStr,
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
}

/** Derive filter dropdown options from the loaded event list. */
export function deriveNeighborhoods(events) {
  return [...new Set(events.map((e) => e.neighborhood).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function deriveCategories(events) {
  return [...new Set(events.map((e) => e.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

/** @param {{ neighborhood: string; category: string; price: string }} filters */
export function matchesFilters(event, filters) {
  if (filters.neighborhood && !neighborhoodMatchesFilter(event.neighborhood, filters.neighborhood)) {
    return false;
  }
  if (filters.category && event.category !== filters.category) {
    return false;
  }
  if (filters.price === 'free' && !event.isFree) return false;
  if (filters.price === 'paid' && event.isFree) return false;
  return true;
}

/** @param {'any'|'today'|'weekend'|'next7'} preset */
export function matchesDatePreset(event, preset, now = new Date()) {
  if (preset === 'any') return true;
  const d = new Date(event.startTime);
  if (preset === 'today') {
    return todayYmdRichmond(d) === todayYmdRichmond(now);
  }
  if (preset === 'next7') {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return d >= now && d <= end;
  }
  if (preset === 'weekend') {
    return isThisWeekendRichmond(event, now);
  }
  return true;
}

/**
 * Fri 5pm+ / Sat / Sun, within a loose “coming up soon” window (demo-friendly).
 */
export function isThisWeekendRichmond(event, now = new Date()) {
  const ev = new Date(event.startTime);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: RICHMOND_TZ,
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(ev);
  const day = parts.find((p) => p.type === 'weekday')?.value;
  const hr = Number(parts.find((p) => p.type === 'hour')?.value);
  const weekendish = day === 'Sat' || day === 'Sun' || (day === 'Fri' && hr >= 17);
  if (!weekendish) return false;
  const diffMs = ev.getTime() - now.getTime();
  if (diffMs < -36 * 3600 * 1000) return false;
  if (diffMs > 8 * 24 * 3600 * 1000) return false;
  return true;
}

const A11Y_RULES = {
  family: /family|kid|children|all ages|youth|parent/i,
  wheelchair: /wheelchair|ada|accessible|mobility|a11y/i,
  multilingual: /spanish|bilingual|multilingual|interpret|translation|esl/i,
  transit: /transit|gRTC|bus line|pulse|bike rack|parking nearby|walkable/i,
};

/** @param {Set<string>|string[]} accessibilityKeys */
export function matchesAccessibilityKeys(event, accessibilityKeys) {
  const keys = accessibilityKeys instanceof Set ? [...accessibilityKeys] : accessibilityKeys;
  if (!keys.length) return true;
  const badges = Array.isArray(event.accessibilityBadges) ? event.accessibilityBadges.join(' ') : '';
  const blob = [
    badges,
    event.title,
    event.description,
    event.venue,
    ...(Array.isArray(event.tags) ? event.tags : []),
  ]
    .join(' ')
    .toLowerCase();

  return keys.every((k) => {
    const rule = A11Y_RULES[k];
    if (!rule) return true;
    return rule.test(blob);
  });
}

export function isSmallVenueSupporting(event) {
  if (event.hiddenGem) return true;
  const blob = `${event.title} ${event.description} ${(event.tags || []).join(' ')}`.toLowerCase();
  return (
    /\b(community|grassroots|neighbor|collective|porch|pt\.a|school|market|craft|open mic|poetry)\b/i.test(
      blob
    ) && !event.featured
  );
}

export function displaySourceLabel(sourceName) {
  if (!sourceName) return 'Listing';
  if (sourceName === 'CultureWorks' || sourceName === 'Eventbrite') return sourceName;
  if (/community|grassroots|neighbor|volunteer|pta|collective/i.test(sourceName)) return 'Community Feed';
  return sourceName;
}

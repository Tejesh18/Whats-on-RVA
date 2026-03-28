/**
 * Pure helpers over NormalizedEvent-shaped objects (never raw API nodes).
 */
import { todayYmdRichmond } from '../data/mockEvents.js';
import { richmondTimeZone as RICHMOND_TZ } from '../config/env.js';

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
  if (filters.neighborhood && event.neighborhood !== filters.neighborhood) {
    return false;
  }
  if (filters.category && event.category !== filters.category) {
    return false;
  }
  if (filters.price === 'free' && !event.isFree) return false;
  if (filters.price === 'paid' && event.isFree) return false;
  return true;
}

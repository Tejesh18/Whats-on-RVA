/**
 * Loads events for the app. UI should use `getEvents()` only.
 */

import { cultureWorksEventsUrl } from '../config/env.js';
import {
  fetchCultureWorksNormalized,
  fetchEventbriteNormalized,
  fetchMockNormalized,
  fetchRssNormalized,
} from './sourceAdapters.js';
import { dedupeMergedEvents } from '../lib/mergeEvents.js';

/** @returns {Promise<import('../lib/normalizedEvent.js').NormalizedEvent[]>} */
export async function fetchMockEvents() {
  return fetchMockNormalized();
}

export async function fetchCultureWorksEvents() {
  return fetchCultureWorksNormalized(cultureWorksEventsUrl);
}

/** Reserved — returns [] until implemented. */
export async function fetchEventbriteEvents() {
  return fetchEventbriteNormalized();
}

/** Reserved — returns [] until implemented. */
export async function fetchRssEvents() {
  return fetchRssNormalized();
}

/**
 * @returns {Promise<{ events: import('../lib/normalizedEvent.js').NormalizedEvent[]; usingFallback: boolean; loadError: string | null }>}
 */
export async function getEvents() {
  let loadError = null;
  try {
    const [cw, eb] = await Promise.all([fetchCultureWorksEvents(), fetchEventbriteEvents()]);
    const merged = dedupeMergedEvents([...cw, ...eb]);
    if (merged.length > 0) {
      return { events: merged, usingFallback: false, loadError: null };
    }
    loadError = 'Live feeds returned no events after merging.';
  } catch (e) {
    loadError = e?.message ? String(e.message) : 'Could not reach live calendars (network or CORS).';
  }

  const fallback = await fetchMockEvents();
  return { events: fallback, usingFallback: true, loadError };
}

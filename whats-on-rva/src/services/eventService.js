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
 * @returns {Promise<{ events: import('../lib/normalizedEvent.js').NormalizedEvent[]; usingFallback: boolean }>}
 */
export async function getEvents() {
  try {
    const [cw, eb] = await Promise.all([fetchCultureWorksEvents(), fetchEventbriteEvents()]);
    const merged = dedupeMergedEvents([...cw, ...eb]);
    if (merged.length > 0) {
      return { events: merged, usingFallback: false };
    }
  } catch {
    /* network, CORS, etc. */
  }

  const fallback = await fetchMockEvents();
  return { events: fallback, usingFallback: true };
}

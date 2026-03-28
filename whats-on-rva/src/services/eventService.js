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
    const live = await fetchCultureWorksEvents();
    if (live.length > 0) {
      return { events: live, usingFallback: false };
    }
  } catch {
    /* network, CORS, etc. */
  }

  const fallback = await fetchMockEvents();
  return { events: fallback, usingFallback: true };
}

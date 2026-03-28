import { matchesMapContentFilter } from './mapContentFilters.js';

/**
 * Pick a single map pin color bucket (same dimensions as map filter chips).
 * Uses listing `category` when obvious, then the same heuristics as filter chips.
 */
export function deriveMapPinCategory(event) {
  if (!event || typeof event !== 'object') return 'other';
  const catStr = String(event.category || '').toLowerCase();
  if (/music|jazz|concert|dj|band|karaoke|opera|night|live music|outdoor music/i.test(catStr)) {
    return 'music';
  }
  if (/art|gallery|museum|visual|exhibit|opening|mural|craft|studio/i.test(catStr)) {
    return 'visual';
  }
  if (/theatre|theater|play|drama|ballet|performance|comedy/i.test(catStr)) {
    return 'theatre';
  }
  if (/family|kid|children|all ages/i.test(catStr)) {
    return 'family';
  }

  const order = ['music', 'visual', 'theatre', 'family', 'free'];
  for (const key of order) {
    if (matchesMapContentFilter(event, key)) return key;
  }
  return 'other';
}

export const MAP_PIN_LEGEND = [
  { key: 'music', label: 'Music & nightlife' },
  { key: 'visual', label: 'Visual art' },
  { key: 'theatre', label: 'Theatre & performance' },
  { key: 'family', label: 'Family friendly' },
  { key: 'free', label: 'Free' },
  { key: 'other', label: 'Other' },
];

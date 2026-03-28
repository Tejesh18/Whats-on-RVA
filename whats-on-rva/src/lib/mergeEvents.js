/**
 * Drop near-duplicates when merging CultureWorks + Eventbrite (same title + same hour).
 * First occurrence wins — list CultureWorks before Eventbrite when merging.
 * @param {Array<Record<string, unknown>>} events
 */
export function dedupeMergedEvents(events) {
  const seen = new Set();
  const out = [];
  for (const ev of events) {
    const key = `${String(ev.title).toLowerCase().slice(0, 56)}|${ev.startTime.slice(0, 13)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ev);
  }
  return out;
}

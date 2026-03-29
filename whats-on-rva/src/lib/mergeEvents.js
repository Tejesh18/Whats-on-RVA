/**
 * Drop near-duplicates when merging CultureWorks + partner ticket feed (same title + same hour).
 * First occurrence wins — CultureWorks is merged before the ticket partner when combining.
 * @param {Array<Record<string, unknown>>} events
 */
export function dedupeMergedEvents(events) {
  const seen = new Set();
  const out = [];
  for (const ev of events) {
    const st = ev?.startTime;
    const stKey =
      typeof st === 'string' && st.length >= 13 ? st.slice(0, 13) : String(st ?? 'na');
    const key = `${String(ev?.title ?? '').toLowerCase().slice(0, 56)}|${stKey}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ev);
  }
  return out;
}

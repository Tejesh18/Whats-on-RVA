/**
 * Connects live/mock events to neighborhood stories: geography + cultural/theme keywords.
 */

/**
 * @param {object} e — normalized event
 * @param {{ eventNeighborhoodHints?: RegExp[]; cultureKeywords?: RegExp[] }} story
 */
export function eventMatchesStoryGeography(e, story) {
  const n = String(e.neighborhood || '');
  return (story.eventNeighborhoodHints || []).some((re) => re.test(n));
}

/** @param {object} e — normalized event */
export function eventMatchesStoryCulture(e, story) {
  const kws = story.cultureKeywords;
  if (!kws?.length) return false;
  const blob = [
    e.title,
    e.description,
    e.category,
    ...(Array.isArray(e.tags) ? e.tags : []),
  ].join(' ');
  return kws.some((re) => re.test(blob));
}

/**
 * Upcoming events in the next `daysAhead` days, split into area match vs theme match (deduped).
 * @returns {{ nearbyArea: object[]; cultureLinked: object[] }}
 */
export function getEventsForStoryWeek(events, story, now = new Date(), daysAhead = 7) {
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  const upcoming = events.filter((e) => {
    const t = new Date(e.startTime);
    return t >= now && t <= end;
  });

  const geo = upcoming.filter((e) => eventMatchesStoryGeography(e, story));
  const geoIds = new Set(geo.map((e) => e.id));

  const themed = upcoming.filter(
    (e) => !geoIds.has(e.id) && eventMatchesStoryCulture(e, story)
  );

  const sortByTime = (a, b) => new Date(a.startTime) - new Date(b.startTime);

  return {
    nearbyArea: [...geo].sort(sortByTime).slice(0, 10),
    cultureLinked: [...themed].sort(sortByTime).slice(0, 10),
  };
}

/** Pick one upcoming event whose text matches timeline `themeTags` (substring), else first upcoming. */
export function findLinkedEventForTimelineRow(events, row, now = new Date()) {
  if (!row?.themeTags?.length) return null;
  const upcoming = events
    .filter((e) => new Date(e.startTime) >= now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  for (const e of upcoming) {
    const blob = [
      e.title,
      e.description,
      e.category,
      ...(Array.isArray(e.tags) ? e.tags : []),
    ]
      .join(' ')
      .toLowerCase();
    if (row.themeTags.some((t) => blob.includes(String(t).toLowerCase()))) return e;
  }
  return upcoming[0] || null;
}

/** Map overlay filters — OR semantics when multiple keys are active. */

const checks = {
  music: (e, blob) =>
    /music|jazz|live|concert|dj|band|karaoke|opera|soul|blues|horn/i.test(blob),
  visual: (e, blob) =>
    /art|gallery|mural|paint|sculpture|exhibit|opening|studio|craft/i.test(blob),
  theatre: (e, blob) => /theatre|theater|play|drama|ballet|comedy show|performance/i.test(blob),
  family: (e, blob) => {
    const a11y = Array.isArray(e.accessibilityBadges) ? e.accessibilityBadges.join(' ') : '';
    return /family|kid|children|all ages/i.test(`${blob} ${a11y}`);
  },
  free: (e) => e.isFree === true,
};

export function matchesMapContentFilter(event, key) {
  if (key === 'free') return checks.free(event);
  const blob = [
    event.title,
    event.description,
    event.category,
    ...(Array.isArray(event.tags) ? event.tags : []),
  ]
    .join(' ')
    .toLowerCase();
  const fn = checks[key];
  return fn ? fn(event, blob) : true;
}

/** @param {Set<string>} filterKeys */
export function matchesAnyMapContentFilter(event, filterKeys) {
  if (!filterKeys || filterKeys.size === 0) return true;
  for (const k of filterKeys) {
    if (matchesMapContentFilter(event, k)) return true;
  }
  return false;
}

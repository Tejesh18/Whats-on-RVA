/**
 * Heuristic “support local” labels — replace with organizer-supplied flags when you have an API.
 */
export function inferSupportBadges(event) {
  const badges = [];
  if (event.hiddenGem) badges.push({ id: 'small', label: 'Small venue' });

  const blob = [
    event.title,
    event.description,
    event.category,
    ...(Array.isArray(event.tags) ? event.tags : []),
  ]
    .join(' ')
    .toLowerCase();

  if (/\bwoman[\s-]?owned|womxn|women's\b/i.test(blob)) {
    badges.push({ id: 'wo', label: 'Woman-owned' });
  }
  if (/\bblack[\s-]?owned|black-owned business\b/i.test(blob)) {
    badges.push({ id: 'bo', label: 'Black-owned' });
  }
  if (/\bcommunity|grassroots|collective|volunteer|pta|neighbor|nonprofit|501\b/i.test(blob)) {
    badges.push({ id: 'org', label: 'Community / local org' });
  }

  return badges;
}

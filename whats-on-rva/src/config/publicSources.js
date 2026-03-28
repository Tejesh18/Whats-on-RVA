/**
 * Canonical list of public aggregation targets — used by the marketing / architecture section.
 * Keep in sync with README “Data source strategy”; avoid duplicating strings in components.
 */

export const publicEventSources = [
  {
    name: 'CultureWorks Localist API',
    url: 'https://calendar.richmondcultureworks.org/api/2/events',
    notes: 'Primary arts source for Richmond event discovery (anonymous public API).',
  },
  {
    name: 'Eventbrite (org / venue)',
    url: 'https://www.eventbrite.com/',
    notes: 'Use org_id or venue_id lookups; avoid deprecated location search.',
  },
  {
    name: 'Partner RSS feeds',
    url: 'https://www.rssboard.org/rss-specification',
    notes: 'Venue and media feeds where available.',
  },
];

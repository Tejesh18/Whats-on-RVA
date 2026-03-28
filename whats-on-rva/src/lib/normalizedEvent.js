/**
 * Normalized event schema — every source adapter must output objects matching this shape.
 * React components should only read these fields; they must not branch on vendor-specific payloads.
 *
 * @typedef {Object} NormalizedEvent
 * @property {string} id — stable unique id (prefix with source key, e.g. cw-123)
 * @property {string} title
 * @property {string} category
 * @property {string} neighborhood — region / area label for filtering
 * @property {string} venue
 * @property {string} startTime — ISO 8601
 * @property {string} endTime — ISO 8601
 * @property {boolean} isFree
 * @property {string|null} price — display string when paid / variable
 * @property {string} description — plain text, truncated at adapter if needed
 * @property {string} sourceName — human-readable publisher (e.g. "CultureWorks Localist")
 * @property {string} sourceUrl — canonical link for “View source”
 * @property {string} imageUrl
 * @property {boolean} featured
 * @property {boolean} hiddenGem
 * @property {string[]} tags
 * @property {string[]} accessibilityBadges
 */

export {};

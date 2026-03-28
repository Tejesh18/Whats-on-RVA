/**
 * Shared event shape used across the UI. CultureWorks responses are mapped into this structure.
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
 * @property {string} description — plain text, may be shortened for cards
 * @property {string} sourceName — human-readable publisher (e.g. "CultureWorks")
 * @property {string} sourceUrl — canonical link for “View source”
 * @property {string} imageUrl
 * @property {boolean} featured
 * @property {boolean} hiddenGem
 * @property {string[]} tags
 * @property {string[]} accessibilityBadges
 * @property {number|null} latitude — WGS84 when known (map marker); null if unknown
 * @property {number|null} longitude
 */

export {};

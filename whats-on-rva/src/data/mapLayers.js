/**
 * Map overlays: story anchors (orange) & simplified historic district polygons (purple).
 */

import { NEIGHBORHOOD_STORY_BY_SLUG } from './neighborhoodStories.js';

export function getStoryMapPoints() {
  return Object.values(NEIGHBORHOOD_STORY_BY_SLUG).map((s) => ({
    slug: s.slug,
    title: s.title,
    lat: s.storyMapPoint.lat,
    lng: s.storyMapPoint.lng,
  }));
}

/** Rough rectangles — educational only, not survey-grade */
export const HISTORIC_DISTRICT_POLYGONS = [
  {
    id: 'jw-historic',
    label: 'Jackson Ward (historic core)',
    color: '#7c3aed',
    positions: [
      [37.546, -77.442],
      [37.546, -77.428],
      [37.556, -77.428],
      [37.556, -77.442],
    ],
  },
  {
    id: 'ch-historic',
    label: 'Church Hill ridge',
    color: '#6d28d9',
    positions: [
      [37.523, -77.422],
      [37.523, -77.408],
      [37.532, -77.408],
      [37.532, -77.422],
    ],
  },
  {
    id: 'blackwell-south',
    label: 'Southside / Blackwell area',
    color: '#5b21b6',
    positions: [
      [37.512, -77.462],
      [37.512, -77.448],
      [37.524, -77.448],
      [37.524, -77.462],
    ],
  },
];

/** Illustrative arts / cultural corridors (teal) — distinct from historic districts. */
export const ARTS_DISTRICT_POLYGONS = [
  {
    id: 'arts-broad-corridor',
    label: 'Broad St arts corridor (illustrative)',
    color: '#0d9488',
    positions: [
      [37.552, -77.468],
      [37.552, -77.438],
      [37.558, -77.438],
      [37.558, -77.468],
    ],
  },
  {
    id: 'arts-vcu-edge',
    label: 'VCU / gallery edge (illustrative)',
    color: '#14b8a6',
    positions: [
      [37.544, -77.458],
      [37.544, -77.448],
      [37.552, -77.448],
      [37.552, -77.458],
    ],
  },
];

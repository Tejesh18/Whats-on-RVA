/**
 * Zones for the story explorer map: zoom in until the label shows, then a story surfaces.
 * Positions are [lat, lng] rings (illustrative, not survey-grade).
 */
export const STORY_ZONE_POLYGONS = [
  {
    slug: 'jackson-ward',
    label: 'Jackson Ward',
    minZoom: 13,
    color: '#7c3aed',
    positions: [
      [37.546, -77.442],
      [37.546, -77.428],
      [37.556, -77.428],
      [37.556, -77.442],
    ],
  },
  {
    slug: 'church-hill',
    label: 'Church Hill',
    minZoom: 13,
    color: '#6d28d9',
    positions: [
      [37.523, -77.422],
      [37.523, -77.408],
      [37.532, -77.408],
      [37.532, -77.422],
    ],
  },
  {
    slug: 'blackwell',
    label: 'Blackwell / Southside',
    minZoom: 13,
    color: '#5b21b6',
    positions: [
      [37.512, -77.462],
      [37.512, -77.448],
      [37.524, -77.448],
      [37.524, -77.462],
    ],
  },
  {
    slug: 'carytown',
    label: 'Carytown',
    minZoom: 13,
    color: '#0d9488',
    positions: [
      [37.552, -77.492],
      [37.552, -77.478],
      [37.56, -77.478],
      [37.56, -77.492],
    ],
  },
  {
    slug: 'scotts-addition',
    label: "Scott's Addition",
    minZoom: 13,
    color: '#db2777',
    positions: [
      [37.56, -77.485],
      [37.56, -77.472],
      [37.572, -77.472],
      [37.572, -77.485],
    ],
  },
  {
    slug: 'manchester',
    label: 'Manchester',
    minZoom: 13,
    color: '#2563eb',
    positions: [
      [37.518, -77.456],
      [37.518, -77.434],
      [37.532, -77.434],
      [37.532, -77.456],
    ],
  },
];

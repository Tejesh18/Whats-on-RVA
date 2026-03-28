/**
 * Mock walking tour beats — impressive UX without routing engine.
 */

export const WALKING_TOURS = {
  'jackson-ward': {
    title: 'Jackson Ward — Jazz & brick',
    neighborhood: 'Jackson Ward',
    stops: [
      {
        kind: 'story',
        title: 'Neighborhood spine',
        detail: 'Start on Leigh — imagine streetcar-era crowds moving between clubs and shops.',
      },
      {
        kind: 'historic',
        title: 'Historic jazz corners',
        detail: 'Pause at cross-streets where small venues once packed tight lines — plaques and porches tell parallel stories.',
      },
      {
        kind: 'event',
        title: 'Tonight nearby',
        detail: 'Check the live list for gallery openings or late sets — the Ward rewards wandering after dark.',
      },
    ],
  },
  'church-hill': {
    title: 'Church Hill — Views & murals',
    neighborhood: 'Church Hill',
    stops: [
      {
        kind: 'story',
        title: 'Libby Hill orientation',
        detail: 'Catch the skyline, then descend into East Broad’s mural corridor.',
      },
      {
        kind: 'historic',
        title: 'Federal rows',
        detail: 'Brick patterns and stoops are the museum — read porches as exhibit labels.',
      },
      {
        kind: 'event',
        title: 'Market & porch energy',
        detail: 'Weekend markets and porchfests often anchor the social calendar.',
      },
    ],
  },
  blackwell: {
    title: 'Blackwell — River & makers',
    neighborhood: 'Blackwell',
    stops: [
      {
        kind: 'story',
        title: 'Riverward rhythm',
        detail: 'Walk toward the James — trails link neighborhoods and sunset crowds.',
      },
      {
        kind: 'historic',
        title: 'Southside layers',
        detail: 'Industrial memory meets front-yard gardens — notice how art shows up in yards and halls.',
      },
      {
        kind: 'event',
        title: 'Community nights',
        detail: 'Look for school partnerships, markets, and small-room concerts tagged Southside.',
      },
    ],
  },
};

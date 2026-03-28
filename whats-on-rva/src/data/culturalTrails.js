/**
 * Themed trails — combine filters + story anchors (walking order is illustrative).
 */
export const CULTURAL_TRAILS = [
  {
    id: 'jazz',
    name: 'Jazz Trail',
    blurb: 'Clubs, late sets, and Jackson Ward’s sonic lineage.',
    storySlug: 'jackson-ward',
    match: (e) =>
      /jazz|live music|horn|blues|soul/i.test(
        `${e.title} ${e.category} ${(e.tags || []).join(' ')}`
      ),
  },
  {
    id: 'black-history',
    name: 'Black History Trail',
    blurb: 'Walking tours, talks, and culture-forward nights across corridors.',
    storySlug: 'jackson-ward',
    match: (e) =>
      /black history|bhm|heritage|african american|civil rights|walking tour/i.test(
        `${e.title} ${e.description} ${(e.tags || []).join(' ')}`
      ),
  },
  {
    id: 'murals',
    name: 'Murals Trail',
    blurb: 'Walls as exhibits — Church Hill eastward.',
    storySlug: 'church-hill',
    match: (e) =>
      /mural|public art|street art|walking tour/i.test(
        `${e.title} ${e.description} ${(e.tags || []).join(' ')}`
      ),
  },
  {
    id: 'family-arts',
    name: 'Family Arts Trail',
    blurb: 'All-ages openings, markets, and outdoor culture.',
    storySlug: 'blackwell',
    match: (e) =>
      /family|kid|children|market|craft|all ages/i.test(
        `${e.title} ${e.description} ${(e.tags || []).join(' ')}`
      ),
  },
  {
    id: 'free',
    name: 'Free Things to Do Trail',
    blurb: 'No ticket required — donations welcome sometimes.',
    storySlug: null,
    match: (e) => e.isFree === true,
  },
];

/**
 * Curated neighborhood narratives — editorial / educational (not live API data).
 * Hash routes: #story/jackson-ward
 */

export const STORY_SLUGS = ['jackson-ward', 'church-hill', 'blackwell'];

/**
 * Top spotlight row (spec): Jackson Ward, Church Hill, Carytown, Scott's Addition, Manchester.
 * `storySlug` opens the matching modal when present.
 */
export const NEIGHBORHOOD_SPOTLIGHTS = [
  { id: 'jackson-ward', label: 'Jackson Ward', match: /jackson/i, storySlug: 'jackson-ward' },
  { id: 'church-hill', label: 'Church Hill', match: /church hill/i, storySlug: 'church-hill' },
  { id: 'carytown', label: 'Carytown', match: /carytown/i, storySlug: null },
  { id: 'scotts-addition', label: "Scott's Addition", match: /scott/i, storySlug: null },
  { id: 'manchester', label: 'Manchester', match: /manchester/i, storySlug: null },
];

export const NEIGHBORHOOD_STORY_BY_SLUG = {
  'jackson-ward': {
    slug: 'jackson-ward',
    neighborhoodTag: 'Jackson Ward',
    title: 'Jackson Ward Jazz History',
    subtitle: 'Historic neighborhood overview',
    heroImage:
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',
    shortDescription:
      'From early 20th-century clubs to today’s stages, Jackson Ward helped shape Richmond’s sound — intimate rooms, national circuits, and a through-line to tonight’s listings.',
    cultureKeywords: [
      /jazz/i,
      /live music/i,
      /black history/i,
      /hippodrome/i,
      /walking tour/i,
      /mural/i,
      /gallery/i,
      /opening/i,
      /first friday/i,
      /poetry/i,
      /open mic/i,
    ],
    sections: [
      {
        heading: 'Intro to Jackson Ward',
        body: 'A National Historic Landmark district where commerce, faith, and nightlife stacked together — the Ward was a laboratory for Black entrepreneurship and for the sounds that traveled up and down the East Coast.',
      },
      {
        heading: 'Why Jackson Ward mattered to Richmond jazz',
        body: 'Tight geography meant musicians, audiences, and after-hours food were never far apart. That density created a listening culture — quick to adopt new styles, loyal to hometown players.',
      },
      {
        heading: 'Famous figures & venues',
        body: 'Oral histories name packed houses on Leigh and Brook, church basements turned green rooms, and visiting artists testing new charts before bigger cities. Today’s maps don’t show every door — but the pattern of small stages continues.',
      },
    ],
    timeline: [
      {
        year: '1900s — jazz rise',
        text: 'Club culture peaks; routes link Richmond to the Mid-Atlantic circuit.',
        image: 'https://images.unsplash.com/photo-1415201367414-f6f34022c59e?w=600&q=80',
        snippet: 'Second-floor rooms filled after shifts — brass, piano, and kitchen gossip in the same breath.',
        themeTags: ['jazz', 'music', 'live'],
      },
      {
        year: 'Civil rights era',
        text: 'Organizing, culture, and commerce shared the same sidewalks — music carried news as much as newspapers.',
        image: 'https://images.unsplash.com/photo-1525904094558-95b2dc70d3d6?w=600&q=80',
        snippet: 'Churches and clubs doubled as meeting rooms; benefit concerts funded bail and buses.',
        themeTags: ['history', 'walking', 'community'],
      },
      {
        year: 'Present-day arts scene',
        text: 'Breweries, galleries, and festivals re-layer music onto historic brick.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        snippet: 'First Fridays and late sets — new owners, old listening habits.',
        themeTags: ['gallery', 'opening', 'first'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1569025743873-ea3a9aae1951?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=900&q=80',
      caption:
        'Illustrative pair: mid-century street wall vs today’s lit corridors — density, signage, and night life returned block by block.',
    },
    whatChanged: {
      pastKnown: 'A capital of Black business and after-hours music — where the city learned to listen late.',
      presentKnown: 'Mixed-use arts, offices, and dining on landmark brick — tourism meets neighborhood life.',
      why: 'Preservation tax credits, population return, and festival economies changed rent and use — while oral history keeps venue names alive even when doors change.',
    },
    communityVoices: [
      {
        text: '“Jackson Ward was where everyone came to hear music.”',
        attribution: 'Illustrative oral-history style line',
      },
    ],
    keyPlaces: [
      { category: 'Clubs', name: 'Second-floor rooms & legacy halls', note: 'Look for late sets and pop-ups — the Ward still hides music above storefronts.' },
      { category: 'Streets', name: 'Leigh & Brook corridors', note: 'Walk slowly: cornices and plaques echo streetcar-era crowds.' },
      { category: 'Cultural landmarks', name: 'Theater & arts anchors', note: 'Historic venues and galleries anchor First Fridays and touring acts.' },
    ],
    quote: {
      text: '“We didn’t call it a scene — it was just home. Music was how we told the week what happened.”',
      attribution: 'Composite neighborhood voice (illustrative)',
    },
    storyMapPoint: { lat: 37.552, lng: -77.437 },
    eventNeighborhoodHints: [/jackson/i],
  },
  'church-hill': {
    slug: 'church-hill',
    neighborhoodTag: 'Church Hill',
    title: 'Church Hill Community Change',
    subtitle: 'Hills, views, murals, and reinvention',
    heroImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    shortDescription:
      'Federal rows, Libby Hill sunsets, and mural corridors — Church Hill is a timeline you can walk, from the 1800s grid to porchfests and farmers-market spillover.',
    cultureKeywords: [
      /mural/i,
      /poetry/i,
      /open mic/i,
      /market/i,
      /craft/i,
      /history talk/i,
      /walking tour/i,
      /libby/i,
      /church hill/i,
      /outdoor/i,
      /community/i,
    ],
    sections: [
      {
        heading: 'Neighborhood timeline',
        body: 'Fires, flight, and return each left a layer — visible in brick, paint, and porch gardens. Historic photos (see archives like The Valentine) show how dense row life shaped daily rhythm.',
      },
      {
        heading: 'Historic snippets',
        body: 'St. John’s and the eastern ridge anchor Richmond’s origin story; downhill toward Shockoe, layers of labor, commerce, and protest overlap.',
      },
      {
        heading: 'Community transformation',
        body: 'Grassroots groups, faith communities, and small businesses translate memory into markets, murals, and porch music — history as living calendar, not a sealed exhibit.',
      },
    ],
    timeline: [
      {
        year: '1800s — city on the hill',
        text: 'Early growth; Libby Hill views become a civic symbol.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        snippet: 'Brick rows climbed the ridge; church bells marked time before car horns.',
        themeTags: ['history', 'walking', 'libby'],
      },
      {
        year: '1970s–90s — change fast',
        text: 'Population shifts and vacant fabric — neighbors held porch lines anyway.',
        image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d6e?w=600&q=80',
        snippet: 'Church Hill changed fast, but the neighborhood still has its own identity.',
        themeTags: ['community', 'market', 'outdoor'],
      },
      {
        year: 'Present — murals & markets',
        text: 'Murals, markets, careful infill — heritage as shared backdrop.',
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80',
        snippet: 'East Broad reads like an open-air exhibit on Saturdays.',
        themeTags: ['mural', 'market', 'poetry'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d6e?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80',
      caption: 'Church Hill in a quieter era vs today’s mural-filled ridges — reinvestment without erasing porch culture.',
    },
    whatChanged: {
      pastKnown: 'Dense row life tied to church clocks, hill views, and port-side labor.',
      presentKnown: 'Mural tourism, coffee-to-dinner strips, and young families on the same stoops.',
      why: 'Historic credits, grassroots orgs, and a hunger for walkable city life rewrote block economics — slowly, unevenly, but visibly on the walls.',
    },
    communityVoices: [
      {
        text: '“Church Hill changed fast, but the neighborhood still has its own identity.”',
        attribution: 'Illustrative resident line',
      },
    ],
    keyPlaces: [
      { category: 'Views', name: 'Libby Hill Park', note: 'Skyline at golden hour — the classic Richmond postcard angle.' },
      { category: 'Streets', name: 'East Broad mural corridor', note: 'Coffee-to-dinner stroll; read walls like exhibits.' },
      { category: 'Cultural landmarks', name: 'St. John’s & oldest blocks', note: 'Start here for orientation, then wander the side streets.' },
    ],
    quote: {
      text: '“The hill teaches you to look back at downtown and forward at your neighbors at the same time.”',
      attribution: 'Illustrative resident line',
    },
    storyMapPoint: { lat: 37.526, lng: -77.417 },
    eventNeighborhoodHints: [/church hill/i, /churchhill/i],
  },
  blackwell: {
    slug: 'blackwell',
    neighborhoodTag: 'Blackwell',
    title: 'Blackwell Arts Trail',
    subtitle: 'Riverward identity & maker energy',
    heroImage:
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa88?w=1200&q=80',
    shortDescription:
      'South of the James — residential blocks, river trails, and neighbor-led arts. A quieter thread in Richmond’s map with strong school and studio ties.',
    cultureKeywords: [
      /southside/i,
      /river/i,
      /james river/i,
      /market/i,
      /craft/i,
      /community/i,
      /porch/i,
      /blackwell/i,
      /youth/i,
      /workshop/i,
    ],
    sections: [
      {
        heading: 'Story of the neighborhood',
        body: 'Working-class roots meet river access and generational memory. Artists and organizers often start here because space and community trust run deep.',
      },
      {
        heading: 'Local artists & cultural identity',
        body: 'Pop-up markets, porch music, and school partnerships keep culture close to home — identity shows up in yards, halls, and river clean-ups.',
      },
      {
        heading: 'Nearby arts events',
        body: 'Scan listings for Southside, river, and market keywords — many gems sit minutes from Blackwell’s core.',
      },
    ],
    timeline: [
      {
        year: '20th c. — river industry',
        text: 'Industrial and residential mix along the James.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        snippet: 'Shift whistles and porch lights — the river set the schedule.',
        themeTags: ['river', 'southside', 'community'],
      },
      {
        year: '2000s — parks & paths',
        text: 'Parks and riverfront programming knit neighborhoods together.',
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa88?w=600&q=80',
        snippet: 'Trails linked schools to studios; kayaks next to basketball.',
        themeTags: ['outdoor', 'market', 'youth'],
      },
      {
        year: 'Today — porch arts',
        text: 'Small venues and community orgs host hyper-local nights.',
        image: 'https://images.unsplash.com/photo-1517457373958-b18bdd1bc937?w=600&q=80',
        snippet: 'PTA tables and pop-up galleries share the same weekend.',
        themeTags: ['craft', 'workshop', 'family'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa88?w=900&q=80',
      caption: 'Heavy industry riverfront vs today’s trail-linked neighborhoods — same water, different rhythm.',
    },
    whatChanged: {
      pastKnown: 'River-adjacent work rows and tight-knit block clubs.',
      presentKnown: 'Trail culture, school partnerships, and maker nights on porches.',
      why: 'Environmental cleanup, path investments, and organizers who treat art as infrastructure.',
    },
    communityVoices: [
      {
        text: '“We paint porches and stages the same weekend — it’s all one trail.”',
        attribution: 'Illustrative organizer line',
      },
    ],
    keyPlaces: [
      { category: 'River', name: 'James River trails', note: 'Bike or walk before a show — regional connectivity.' },
      { category: 'Community', name: 'Centers & schools', note: 'Family nights and workshops — check city & PTA calendars.' },
      { category: 'Corridors', name: 'Southside connectors', note: 'Follow art-walk flyers and neighbor socials.' },
    ],
    quote: {
      text: '“We paint porches and stages the same weekend — it’s all one trail.”',
      attribution: 'Illustrative arts organizer line',
    },
    storyMapPoint: { lat: 37.518, lng: -77.454 },
    eventNeighborhoodHints: [/blackwell/i, /southside/i],
  },
};

export function getStory(slug) {
  return NEIGHBORHOOD_STORY_BY_SLUG[slug] || null;
}

export function storySlugForEventNeighborhood(neighborhood) {
  if (!neighborhood) return null;
  const n = String(neighborhood).toLowerCase();
  for (const story of Object.values(NEIGHBORHOOD_STORY_BY_SLUG)) {
    if (story.eventNeighborhoodHints.some((re) => re.test(n))) return story.slug;
  }
  return null;
}

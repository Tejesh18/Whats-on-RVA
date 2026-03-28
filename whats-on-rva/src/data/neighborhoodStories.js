/**
 * Curated neighborhood narratives — editorial / educational (not live API data).
 * Hash routes: #story/jackson-ward
 */

export const STORY_SLUGS = [
  'jackson-ward',
  'church-hill',
  'blackwell',
  'carytown',
  'scotts-addition',
  'manchester',
];

/**
 * Top spotlight row (spec): Jackson Ward, Church Hill, Carytown, Scott's Addition, Manchester.
 * `storySlug` opens the matching modal when present.
 */
export const NEIGHBORHOOD_SPOTLIGHTS = [
  { id: 'jackson-ward', label: 'Jackson Ward', match: /jackson/i, storySlug: 'jackson-ward' },
  { id: 'church-hill', label: 'Church Hill', match: /church hill/i, storySlug: 'church-hill' },
  { id: 'carytown', label: 'Carytown', match: /carytown/i, storySlug: 'carytown' },
  { id: 'scotts-addition', label: "Scott's Addition", match: /scott/i, storySlug: 'scotts-addition' },
  { id: 'manchester', label: 'Manchester', match: /manchester/i, storySlug: 'manchester' },
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
  carytown: {
    slug: 'carytown',
    neighborhoodTag: 'Carytown',
    title: 'Carytown — The strip that walks',
    subtitle: 'Retail, food, and casual night life on one mile',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    shortDescription:
      'Cary Street’s dense storefront rhythm makes it one of Richmond’s easiest cultural walks — indie shops, restaurants, pop-ups, and small stages spill onto the sidewalk most weekends.',
    cultureKeywords: [
      /carytown/i,
      /retail/i,
      /pop-?up/i,
      /film/i,
      /market/i,
      /live music/i,
      /food/i,
      /dining/i,
    ],
    sections: [
      {
        heading: 'Why Carytown feels different',
        body: 'Short blocks and mixed storefronts mean you can browse, eat, and catch a show without a car — the strip rewards slow pacing and return visits.',
      },
      {
        heading: 'Night life without stadium scale',
        body: 'Think listening rooms, comedy, film nights, and DJ-forward bars — the energy is neighborhood-first, not mega-venue.',
      },
    ],
    timeline: [
      {
        year: 'Streetcar era',
        text: 'Commercial strips knit residential Richmond to regional shopping — Cary Street thickened with small owners.',
        image: 'https://images.unsplash.com/photo-1555529908-41e7d45838f5?w=600&q=80',
        snippet: 'Windows changed faster than street names — same walk, new paint.',
        themeTags: ['history', 'walking', 'market'],
      },
      {
        year: 'Indie retail wave',
        text: 'Boutiques, record bins, and eateries replaced some chains — the mile became a destination for locals first.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
        snippet: 'Saturday foot traffic became the default calendar.',
        themeTags: ['market', 'food', 'live'],
      },
      {
        year: 'Today’s mix',
        text: 'Festivals, sidewalk sales, and late kitchens keep the strip loud in the best way.',
        image: 'https://images.unsplash.com/photo-1517457373958-b18bdd1bc937?w=600&q=80',
        snippet: 'You can plan dinner and stumble into music — still Carytown.',
        themeTags: ['music', 'family', 'outdoor'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1555529908-41e7d45838f5?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
      caption: 'Illustrative: quieter mid-century retail frontage vs today’s busier, mixed-use Cary Street energy.',
    },
    whatChanged: {
      pastKnown: 'A practical shopping corridor tied to streetcar commutes.',
      presentKnown: 'A walkable culture strip — food, film, music, and retail in one breath.',
      why: 'Zoning patience, small-lot ownership, and audiences who want density without downtown towers.',
    },
    communityVoices: [
      {
        text: '“We plan dinner and let the block decide the rest of the night.”',
        attribution: 'Illustrative shopper voice',
      },
    ],
    keyPlaces: [
      { category: 'Walk', name: 'Cary Street spine', note: 'Start mid-strip and loop — alleys hide murals and patios.' },
      { category: 'Culture', name: 'The Byrd & neighbors', note: 'Film and small venues anchor the calendar — check marquees.' },
      { category: 'Food', name: 'Cross-street kitchens', note: 'Side streets add quieter tables when the main drag is packed.' },
    ],
    quote: {
      text: '“It’s one mile that still feels like a neighborhood.”',
      attribution: 'Illustrative Carytown voice',
    },
    storyMapPoint: { lat: 37.5555, lng: -77.486 },
    eventNeighborhoodHints: [/carytown/i],
  },
  'scotts-addition': {
    slug: 'scotts-addition',
    neighborhoodTag: "Scott's Addition",
    title: "Scott's Addition — Breweries & creative nights",
    subtitle: 'From industrial yards to tasting rooms and comedy',
    heroImage: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=1200&q=80',
    shortDescription:
      'Warehouses turned into tasting rooms, food halls, and small stages — Scott’s Addition is where Richmond experiments with density, patios, and late-week energy.',
    cultureKeywords: [
      /scott/i,
      /brew/i,
      /comedy/i,
      /food hall/i,
      /dj/i,
      /nightlife/i,
      /tasting/i,
    ],
    sections: [
      {
        heading: 'Industrial bones, social reuse',
        body: 'Large footprints became shared spaces — breweries, food vendors, and offices stack audiences who spill onto patios.',
      },
      {
        heading: 'A young night-time economy',
        body: 'Comedy, DJ sets, and pop-ups rotate fast — the neighborhood rewards checking listings weekly.',
      },
    ],
    timeline: [
      {
        year: 'Industrial grid',
        text: 'Rail-adjacent work yards — daytime noise, nighttime quiet.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        snippet: 'Trucks in, workers out — few imagined patio lights.',
        themeTags: ['history', 'walking'],
      },
      {
        year: 'Reuse wave',
        text: 'Breweries and makers claimed volume — patios became the new front door.',
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80',
        snippet: 'Flight boards replaced shift boards.',
        themeTags: ['food', 'market', 'live'],
      },
      {
        year: 'Creative corridor',
        text: 'Offices, food halls, and small venues share blocks — Thursday-to-Saturday is the pulse.',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80',
        snippet: 'One parking lot can host three different crowds in a night.',
        themeTags: ['music', 'comedy', 'nightlife'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=900&q=80',
      caption: 'Illustrative: industrial yard stillness vs lit patios and tasting rooms today.',
    },
    whatChanged: {
      pastKnown: 'Work yards and light industry south of the Fan.',
      presentKnown: 'Destination dining, craft drink culture, and creative offices.',
      why: 'Adaptive reuse financing, a hunger for outdoor rooms, and audiences who want variety in one walk.',
    },
    communityVoices: [
      {
        text: '“We moved here for the patios — stayed for the comedy and food hall nights.”',
        attribution: 'Illustrative resident line',
      },
    ],
    keyPlaces: [
      { category: 'Drink', name: 'Tasting room row', note: 'Sample responsibly — many spots host live DJs or trivia.' },
      { category: 'Laugh', name: 'Comedy & small stages', note: 'Check calendars; rooms fill on short notice.' },
      { category: 'Eat', name: 'Food halls & patios', note: 'Shared tables mean shorter waits at peak hours.' },
    ],
    quote: {
      text: '“It’s loud in the friendliest way — everyone’s comparing flight notes on the sidewalk.”',
      attribution: "Illustrative Scott's Addition voice",
    },
    storyMapPoint: { lat: 37.565, lng: -77.478 },
    eventNeighborhoodHints: [/scott/i, /addition/i],
  },
  manchester: {
    slug: 'manchester',
    neighborhoodTag: 'Manchester',
    title: 'Manchester — South of the river',
    subtitle: 'Views, renewal, and neighborhood-scale culture',
    heroImage: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=1200&q=80',
    shortDescription:
      'Across the James from downtown, Manchester mixes river views, residential renewal, and grassroots events — a different angle on the same skyline.',
    cultureKeywords: [
      /manchester/i,
      /river/i,
      /james/i,
      /south of the river/i,
      /market/i,
      /pop-?up/i,
      /porch/i,
    ],
    sections: [
      {
        heading: 'A ridge with a view',
        body: 'Elevations toward the river frame the city — sunset walks here are a Richmond ritual for many south-of-downtown residents.',
      },
      {
        heading: 'Growth with memory',
        body: 'New construction sits beside older fabric — block clubs and small orgs still anchor how culture happens on the ground.',
      },
    ],
    timeline: [
      {
        year: 'River city',
        text: 'Industry and housing shared the slope toward the James.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        snippet: 'Smoke and steeples in the same photograph.',
        themeTags: ['river', 'history', 'walking'],
      },
      {
        year: 'Residential shift',
        text: 'Renewal brought new neighbors — porches stayed the social network.',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
        snippet: 'Yard sales became porch playlists.',
        themeTags: ['community', 'outdoor'],
      },
      {
        year: 'Today',
        text: 'Pop-ups, river access, and small markets stitch the hill together.',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f290?w=600&q=80',
        snippet: 'Same skyline — shorter walk home.',
        themeTags: ['market', 'family', 'river'],
      },
    ],
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=900&q=80',
      caption: 'Illustrative: heavier industrial river edge vs today’s residential and mixed riverfront use.',
    },
    whatChanged: {
      pastKnown: 'River-adjacent work and tight residential rows.',
      presentKnown: 'Mixed housing, skyline views, and neighbor-led culture.',
      why: 'Housing demand, river access investments, and organizers who program the hill like a venue.',
    },
    communityVoices: [
      {
        text: '“We watch the same downtown lights — just from the quiet side of the river.”',
        attribution: 'Illustrative Manchester voice',
      },
    ],
    keyPlaces: [
      { category: 'Views', name: 'River overlooks', note: 'Golden hour walks — bring a jacket off the water.' },
      { category: 'Streets', name: 'Hull & Commerce corridors', note: 'Follow flyers for pop-ups and porch nights.' },
      { category: 'Connect', name: 'Bridges & trails', note: 'Link to downtown or southside paths before a show.' },
    ],
    quote: {
      text: '“Manchester taught me the city has two front doors.”',
      attribution: 'Illustrative resident line',
    },
    storyMapPoint: { lat: 37.525, lng: -77.445 },
    eventNeighborhoodHints: [/manchester/i],
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

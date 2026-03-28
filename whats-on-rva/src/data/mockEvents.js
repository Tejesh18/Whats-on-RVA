/**
 * Mock arts & culture events for the Hack for RVA demo (fallback when APIs fail).
 * Date math uses the configured metro timezone (see config/env.js).
 */

import { richmondTimeZone as RICHMOND_TZ } from '../config/env.js';

/**
 * Same fields as `NormalizedEvent` (see lib/normalizedEvent.js) — mock adapter output.
 * @typedef {Object} AppEvent
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} neighborhood
 * @property {string} venue
 * @property {string} startTime ISO
 * @property {string} endTime ISO
 * @property {boolean} isFree
 * @property {string|null} price
 * @property {string} description
 * @property {string} sourceName
 * @property {string} sourceUrl
 * @property {string} imageUrl
 * @property {boolean} featured
 * @property {boolean} hiddenGem
 * @property {string[]} tags
 * @property {string[]} accessibilityBadges
 */

export {};

/** YYYY-MM-DD for "today" in Richmond — works with en-CA + numeric parts. */
export function todayYmdRichmond(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: RICHMOND_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

/**
 * Maps a Richmond wall-clock time on a calendar day to a UTC ISO string (handles DST).
 */
function richmondWallClockToUtcIso(ymd, hour, minute) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: RICHMOND_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const partsToYmdMin = (t) => {
    const parts = Object.fromEntries(
      fmt
        .formatToParts(new Date(t))
        .filter((p) => p.type !== 'literal')
        .map((p) => [p.type, p.value])
    );
    const gotYmd = `${parts.year}-${parts.month}-${parts.day}`;
    const min = Number(parts.hour) * 60 + Number(parts.minute);
    return { gotYmd, min };
  };

  let t = Date.parse(`${ymd}T12:00:00Z`);

  for (let i = 0; i < 40; i++) {
    const { gotYmd, min } = partsToYmdMin(t);
    const wantMin = hour * 60 + minute;
    if (gotYmd === ymd && min === wantMin) {
      return new Date(t).toISOString();
    }
    let diffMin = wantMin - min;
    if (gotYmd < ymd) diffMin += 24 * 60;
    if (gotYmd > ymd) diffMin -= 24 * 60;
    t += diffMin * 60 * 1000;
  }

  return new Date(t).toISOString();
}

function endAfter(startIso, hours) {
  const d = new Date(startIso);
  d.setUTCHours(d.getUTCHours() + hours);
  return d.toISOString();
}

const staticEvents = [
  {
    id: 'mock-1',
    title: 'First Friday: New Southern Abstraction',
    category: 'Gallery opening',
    neighborhood: 'The Fan',
    venue: 'Page Bond Gallery',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Opening reception for a group show spotlighting contemporary painters with ties to the Mid-Atlantic.',
    sourceName: 'Visit Richmond VA (sample)',
    sourceUrl: 'https://www.visitrichmondva.com/',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-11249b4b3439?w=800&q=80',
    featured: true,
    hiddenGem: false,
    tags: ['gallery', 'opening', 'First Friday', 'visual art'],
    accessibilityBadges: [],
    _startOffsetDays: 5,
    _startHour: 17,
    _durationH: 3,
  },
  {
    id: 'mock-2',
    title: 'Late Set: RVA Jazz Collective',
    category: 'Live music',
    neighborhood: "Scott's Addition",
    venue: 'The Camel',
    startTime: '',
    endTime: '',
    isFree: false,
    price: '$12',
    description:
      'Intimate second set with local horns and rhythm section — standards, originals, and a few RVA shout-outs.',
    sourceName: 'Venue calendar (sample)',
    sourceUrl: 'https://thecamel.org/',
    imageUrl: 'https://images.unsplash.com/photo-1415201367414-f6f34022c59e?w=800&q=80',
    featured: true,
    hiddenGem: false,
    tags: ['jazz', 'live music', 'nightlife'],
    accessibilityBadges: [],
    _tonight: true,
    _startHour: 21,
    _durationH: 2,
  },
  {
    id: 'mock-3',
    title: 'Jackson Ward Mural Stroll (Community)',
    category: 'Walking tour',
    neighborhood: 'Jackson Ward',
    venue: 'Meet at Hippodrome Plaza',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Volunteer-led walk through recent murals and legacy landmarks — BYO water bottle, easy pace.',
    sourceName: 'Neighborhood org (sample)',
    sourceUrl: 'https://www.rva.gov/',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    featured: false,
    hiddenGem: true,
    tags: ['mural', 'walking tour', 'community', 'public art'],
    accessibilityBadges: ['Outdoor route — pace may vary'],
    _startOffsetDays: 2,
    _startHour: 10,
    _durationH: 2,
  },
  {
    id: 'mock-4',
    title: 'Church Hill Poetry & Open Mic',
    category: 'Literary',
    neighborhood: 'Church Hill',
    venue: 'Libby Hill Park — picnic shelter',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Five-minute slots for poets and storytellers; sign-ups at 6:30. Donations welcome for the host collective.',
    sourceName: 'Community calendar (sample)',
    sourceUrl: 'https://www.rva.gov/richmond-art',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    featured: false,
    hiddenGem: true,
    tags: ['poetry', 'open mic', 'literary'],
    accessibilityBadges: [],
    _startOffsetDays: 3,
    _startHour: 19,
    _durationH: 2,
  },
  {
    id: 'mock-5',
    title: 'Shockoe Bottom Cultural Market',
    category: 'Market',
    neighborhood: 'Shockoe Bottom',
    venue: '17th Street Market',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Regional makers, live acoustic sets, and food vendors celebrating RVA’s creative small businesses.',
    sourceName: 'Market calendar (sample)',
    sourceUrl: 'https://www.rva.gov/',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    featured: false,
    hiddenGem: false,
    tags: ['market', 'makers', 'food', 'music'],
    accessibilityBadges: ['Wheelchair Accessible'],
    _startOffsetDays: 6,
    _startHour: 11,
    _durationH: 5,
  },
  {
    id: 'mock-6',
    title: 'Firehouse Theatre: “River City Revue”',
    category: 'Theatre',
    neighborhood: 'The Fan',
    venue: 'Firehouse Theatre',
    startTime: '',
    endTime: '',
    isFree: false,
    price: '$28',
    description:
      'Original sketch-and-song revue about life along the James — matinee and evening performances this weekend.',
    sourceName: 'Theatre calendar (sample)',
    sourceUrl: 'https://www.firehousetheatre.org/',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    featured: true,
    hiddenGem: false,
    tags: ['theatre', 'comedy', 'local'],
    accessibilityBadges: [],
    _startOffsetDays: 7,
    _startHour: 19,
    _durationH: 2,
  },
  {
    id: 'mock-7',
    title: 'Northside Winter Craft Fair',
    category: 'Craft fair',
    neighborhood: 'Northside',
    venue: 'Bellevue Elementary gym',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Hyper-local ceramics, zines, and baked goods — school PTA fundraiser with kid-friendly art tables.',
    sourceName: 'School / community (sample)',
    sourceUrl: 'https://www.rva.gov/',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    featured: false,
    hiddenGem: true,
    tags: ['craft', 'PTA', 'family'],
    accessibilityBadges: [],
    _startOffsetDays: 4,
    _startHour: 10,
    _durationH: 4,
  },
  {
    id: 'mock-8',
    title: 'Belle Isle Sunset Acoustic',
    category: 'Outdoor music',
    neighborhood: 'Belle Isle',
    venue: 'Belle Isle — near the footbridge lawn',
    startTime: '',
    endTime: '',
    isFree: true,
    price: null,
    description:
      'Low-key acoustic circle as the sun sets over the James — bring a blanket; no amps, leave-no-trace.',
    sourceName: 'Parks programming (sample)',
    sourceUrl: 'https://www.jamesriverpark.org/',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    featured: false,
    hiddenGem: true,
    tags: ['outdoor', 'acoustic', 'James River'],
    accessibilityBadges: ['Unpaved / natural surface'],
    _tonight: true,
    _startHour: 18,
    _durationH: 2,
  },
];

function ymdAddDays(ymd, deltaDays) {
  const [y, m, d] = ymd.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d + deltaDays, 12, 0, 0);
  return todayYmdRichmond(new Date(utc));
}

function buildMockEvents() {
  const today = todayYmdRichmond();

  return staticEvents.map((e) => {
    const { _tonight, _startOffsetDays, _startHour, _durationH, ...rest } = e;
    const ymd = _tonight ? today : ymdAddDays(today, _startOffsetDays ?? 0);
    const startTime = richmondWallClockToUtcIso(ymd, _startHour ?? 18, 0);
    const endTime = endAfter(startTime, _durationH ?? 2);
    return {
      ...rest,
      startTime,
      endTime,
    };
  });
}

/** @type {AppEvent[]} */
export const mockEvents = buildMockEvents();

export const neighborhoods = [
  ...new Set(mockEvents.map((e) => e.neighborhood).sort((a, b) => a.localeCompare(b))),
];

export const categories = [
  ...new Set(mockEvents.map((e) => e.category).sort((a, b) => a.localeCompare(b))),
];

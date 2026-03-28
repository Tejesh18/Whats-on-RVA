import { NEIGHBORHOOD_STORY_BY_SLUG, STORY_SLUGS } from '../data/neighborhoodStories.js';
import { eventMatchesStoryCulture } from './storyEventMatch.js';

const storiesBySlug = NEIGHBORHOOD_STORY_BY_SLUG;

/**
 * Score events for personalized feed.
 */
export function scoreEventForYou(event, ctx) {
  const { favNH, savedCategories, viewedSlugs, pricePref } = ctx;
  let s = 0;
  if (event.neighborhood && favNH.has(event.neighborhood)) s += 4;
  if (event.category && savedCategories.has(event.category)) s += 3;
  if (pricePref === 'free' && event.isFree) s += 2;
  if (pricePref === 'paid' && !event.isFree) s += 1;
  for (const slug of viewedSlugs) {
    const story = storiesBySlug[slug];
    if (story && eventMatchesStoryCulture(event, story)) s += 2;
  }
  if (event.hiddenGem) s += 0.5;
  return s;
}

export function buildForYouEventList(discoveryFiltered, ctx, limit = 40) {
  const scored = discoveryFiltered
    .map((e) => ({ e, score: scoreEventForYou(e, ctx) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(a.e.startTime) - new Date(b.e.startTime));
  return scored.slice(0, limit).map((x) => x.e);
}

function resolveNeighborhoodLabel(label, allNeighborhoods) {
  const needle = String(label).toLowerCase();
  return (
    allNeighborhoods.find(
      (x) =>
        String(x).toLowerCase() === needle ||
        String(x).toLowerCase().includes(needle) ||
        needle.includes(String(x).toLowerCase())
    ) || null
  );
}

/** Suggest labels that exist in the current event-derived neighborhood list. */
export function suggestNeighborhoodsToExplore(favNH, allNeighborhoods) {
  const related = new Set();
  const add = (label) => {
    const hit = resolveNeighborhoodLabel(label, allNeighborhoods);
    if (hit) related.add(hit);
  };
  favNH.forEach((n) => {
    const hit = resolveNeighborhoodLabel(n, allNeighborhoods);
    if (hit) related.add(hit);
  });
  favNH.forEach((n) => {
    if (/jackson/i.test(n)) {
      add('Church Hill');
      add("Scott's Addition");
    }
    if (/church/i.test(n)) {
      add('Jackson Ward');
      add('Shockoe Bottom');
    }
  });
  const out = [...related];
  if (out.length === 0 && allNeighborhoods.length) {
    return allNeighborhoods.slice(0, 5);
  }
  return out.slice(0, 8);
}

export function suggestStories(viewedSlugs) {
  const unviewed = STORY_SLUGS.filter((s) => !viewedSlugs.includes(s));
  return unviewed.length ? unviewed : STORY_SLUGS;
}

export function forYouInsightLine(ctx, sampleEvent) {
  const { favNH, savedCategories, viewedSlugs } = ctx;
  const bits = [];
  if (favNH.size) bits.push([...favNH].slice(0, 2).join(', '));
  if (savedCategories.size) bits.push([...savedCategories].slice(0, 2).join(', '));
  if (viewedSlugs.length) bits.push(`stories: ${viewedSlugs.slice(0, 2).join(', ')}`);
  if (!bits.length) return 'Save neighborhoods, star event types you love, and open a few stories — we’ll personalize this tab.';
  let line = `Because you follow ${bits.join(' · ')}`;
  if (sampleEvent) {
    line += ` — try “${sampleEvent.title}”`;
  }
  line += '.';
  return line;
}

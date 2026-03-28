import { NEIGHBORHOOD_SPOTLIGHTS, STORY_SLUGS, getStory } from '../data/neighborhoodStories.js';

export default function NeighborhoodSpotlight({
  neighborhoods,
  filters,
  onFiltersChange,
  onOpenStory,
  favoriteNeighborhoods,
  onToggleFavoriteNeighborhood,
}) {
  /** Prefer a string that exists in the feed; otherwise use the card label so filtering still applies. */
  function pickSpotlight(spotlight) {
    const found = neighborhoods.find((n) => spotlight.match.test(n));
    onFiltersChange({ ...filters, neighborhood: found || spotlight.label });
  }

  return (
    <section className="mb-8" aria-labelledby="spotlight-heading">
      <h2 id="spotlight-heading" className="font-display text-xl font-bold text-zinc-900 sm:text-2xl">
        Explore Richmond — neighborhoods &amp; stories
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
        Filter the event feed by area, save favorites for the For you tab, and open full story guides with timelines,
        before/after views, and listings matched by place and theme.
      </p>

      <h3 className="mt-8 font-display text-sm font-bold uppercase tracking-widest text-zinc-500">Areas</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {NEIGHBORHOOD_SPOTLIGHTS.map((s) => {
          const active = s.match.test(filters.neighborhood || '');
          return (
            <div
              key={s.id}
              className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition ${
                active ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-200/90 hover:border-zinc-300'
              }`}
            >
              <h4 className="font-display text-base font-bold text-zinc-900">{s.label}</h4>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">Show events in this corridor.</p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => pickSpotlight(s)}
                  className="w-full rounded-xl bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800"
                >
                  Show events
                </button>
                {s.storySlug ? (
                  <button
                    type="button"
                    onClick={() => onOpenStory?.(s.storySlug)}
                    className="w-full rounded-xl border border-violet-200 bg-violet-50 py-2 text-xs font-bold text-violet-900 hover:bg-violet-100"
                  >
                    Explore story
                  </button>
                ) : (
                  <p className="text-center text-[10px] text-zinc-400">Story coming soon</p>
                )}
                <button
                  type="button"
                  aria-label={`Save ${s.label} for For you`}
                  onClick={() => onToggleFavoriteNeighborhood?.(s.label)}
                  className={`w-full rounded-xl py-2 text-xs font-bold ${
                    favoriteNeighborhoods?.has(s.label)
                      ? 'bg-amber-400 text-zinc-900'
                      : 'border border-zinc-200 text-zinc-600 hover:border-amber-300'
                  }`}
                >
                  {favoriteNeighborhoods?.has(s.label) ? '★ Saved area' : '★ Save area'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="mt-10 font-display text-sm font-bold uppercase tracking-widest text-zinc-500">
        Neighborhood story guides
      </h3>
      <p className="mt-1 text-sm text-zinc-600">Deeper reads — jazz history, hilltop change, southside arts — with timelines and linked events.</p>
      <ul className="mt-5 grid gap-6 md:grid-cols-3">
        {STORY_SLUGS.map((slug) => {
          const s = getStory(slug);
          if (!s) return null;
          return (
            <li
              key={slug}
              className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative h-40">
                <img src={s.heroImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  {s.neighborhoodTag}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-display text-lg font-bold text-zinc-900">{s.title}</h4>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{s.shortDescription}</p>
                <button
                  type="button"
                  onClick={() => onOpenStory?.(slug)}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-sm font-bold text-zinc-950 shadow-md hover:brightness-105"
                >
                  Open story
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

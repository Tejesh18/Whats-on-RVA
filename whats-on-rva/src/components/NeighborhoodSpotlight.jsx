import { NEIGHBORHOOD_SPOTLIGHTS } from '../data/neighborhoodStories.js';

export default function NeighborhoodSpotlight({
  neighborhoods,
  filters,
  onFiltersChange,
  onOpenStory,
  favoriteNeighborhoods,
  onToggleFavoriteNeighborhood,
}) {
  function pickNeighborhood(match) {
    const found = neighborhoods.find((n) => match.test(n));
    onFiltersChange({ ...filters, neighborhood: found || '' });
  }

  return (
    <section className="mb-8" aria-labelledby="spotlight-heading">
      <h2 id="spotlight-heading" className="font-display text-lg font-bold text-zinc-900 sm:text-xl">
        Neighborhood spotlight
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Tap a card to <strong>filter the feed</strong> to that area. Where a full story exists, open it
        for timelines, places, and <strong>events linked by location and theme</strong>.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {NEIGHBORHOOD_SPOTLIGHTS.map((s) => {
          const active = s.match.test(filters.neighborhood || '');
          return (
            <div
              key={s.id}
              className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition ${
                active ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-zinc-200/90 hover:border-zinc-300'
              }`}
            >
              <h3 className="font-display text-base font-bold text-zinc-900">{s.label}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
                Filter listings + optional story layer.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => pickNeighborhood(s.match)}
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
    </section>
  );
}

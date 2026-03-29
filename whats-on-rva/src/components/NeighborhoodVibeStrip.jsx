import { NEIGHBORHOOD_VIBES } from '../data/neighborhoodVibes.js';
import { STORY_SLUGS } from '../data/neighborhoodStories.js';

const STORY_SET = new Set(STORY_SLUGS);

export default function NeighborhoodVibeStrip({ onOpenStory }) {
  return (
    <section className="mt-8" aria-label="Richmond neighborhood vibe profiles">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-rva-slate/55">Around the city</p>
          <h2 className="font-display text-xl font-bold text-rva-slate">Neighborhood cheat sheets</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
        {NEIGHBORHOOD_VIBES.map((v) => {
          const hasStory = STORY_SET.has(v.id);
          return (
            <article
              key={v.id}
              className="w-[min(100%,280px)] shrink-0 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-md shadow-zinc-900/5"
            >
              <h3 className="font-display text-lg font-bold text-zinc-900">{v.name}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-rva-brick/90">Best known for</p>
              <p className="text-sm text-zinc-600">{v.bestKnownFor}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-rva-river/90">Typical nights out</p>
              <p className="text-sm text-zinc-600">{v.typicalEvents}</p>
              <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-700">Price:</span> {v.priceLevel}
              </div>
              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-zinc-500">
                <span className="font-bold text-zinc-700">Best time:</span> {v.bestTime}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {v.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {hasStory ? (
                <button
                  type="button"
                  onClick={() => onOpenStory?.(v.id)}
                  className="mt-4 w-full rounded-xl bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800"
                >
                  Read neighborhood story
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

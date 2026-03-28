import { STORY_SLUGS, getStory } from '../data/neighborhoodStories.js';

export default function StoriesSection({ onExploreStory }) {
  return (
    <section className="mb-12 border-y border-zinc-200/80 bg-white/60 py-10" aria-labelledby="stories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="stories-heading" className="font-display text-2xl font-bold text-zinc-900">
          Explore Richmond through its stories
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
          Short neighborhood narratives — jazz corridors, hilltop change, riverward arts — with timelines,
          places to stand, and live events matched below when you open a story.
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
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
                  <h3 className="font-display text-lg font-bold text-zinc-900">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{s.shortDescription}</p>
                  <button
                    type="button"
                    onClick={() => onExploreStory?.(slug)}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-sm font-bold text-zinc-950 shadow-md hover:brightness-105"
                  >
                    Explore story
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

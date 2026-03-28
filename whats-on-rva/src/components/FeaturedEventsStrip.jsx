import { formatEventWhen } from '../lib/eventFilters.js';
import { displaySourceLabel } from '../lib/eventFilters.js';

function MiniCard({ event, onSelect }) {
  const src = displaySourceLabel(event.sourceName);
  return (
    <article className="min-w-[260px] max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md">
      <div className="relative h-32">
        <img src={event.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
          Featured
        </span>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 font-display text-sm font-bold leading-snug text-zinc-900">{event.title}</p>
        <p className="mt-1 text-xs text-zinc-500">{formatEventWhen(event.startTime)}</p>
        <p className="truncate text-xs font-semibold text-sky-900">{event.venue}</p>
        <p className="truncate text-[11px] text-zinc-400">{event.neighborhood}</p>
        <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
          {event.category}
        </span>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{src}</span>
          <button
            type="button"
            onClick={() => onSelect?.(event.id)}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            Map
          </button>
        </div>
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-zinc-900 py-2 text-xs font-bold text-white hover:bg-zinc-800"
        >
          View source
        </a>
      </div>
    </article>
  );
}

export default function FeaturedEventsStrip({ events, onSelectEvent }) {
  const featured = events.filter((e) => e.featured);
  const pool = featured.length >= 4 ? featured : [...featured, ...events.filter((e) => !e.featured)];
  const slice = pool.slice(0, 6);

  if (!slice.length) return null;

  return (
    <section className="mb-10" aria-labelledby="featured-strip-heading">
      <h2 id="featured-strip-heading" className="font-display text-xl font-bold text-zinc-900">
        Featured in Richmond
      </h2>
      <p className="mt-1 text-sm text-zinc-600">Hand-picked highlights from the current feed — updated as listings change.</p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {slice.map((e) => (
          <MiniCard key={e.id} event={e} onSelect={onSelectEvent} />
        ))}
      </div>
    </section>
  );
}

import { formatEventWhen, displaySourceLabel } from '../lib/eventFilters.js';

export default function HiddenGemsStrip({ events, onSelectEvent }) {
  const gems = events.filter((e) => e.hiddenGem).slice(0, 6);
  if (!gems.length) return null;

  return (
    <section className="mb-10" aria-labelledby="gems-strip-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="gems-strip-heading" className="font-display text-xl font-bold text-zinc-900">
            Hidden gems
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Think poetry readings, mural strolls, small-room jazz, markets &amp; craft fairs —{' '}
            <span className="font-semibold text-sky-800">Supporting local and community-led spaces</span>.
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gems.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => onSelectEvent?.(e.id)}
              className="flex w-full gap-3 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white p-3 text-left shadow-sm transition hover:border-sky-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                <img src={e.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 block font-display text-sm font-bold text-zinc-900">{e.title}</span>
                <span className="mt-0.5 block text-[11px] text-zinc-500">{formatEventWhen(e.startTime)}</span>
                <span className="mt-0.5 block truncate text-xs text-sky-900">{e.venue}</span>
                <span className="mt-1 inline-block rounded-md bg-sky-600/15 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                  {displaySourceLabel(e.sourceName)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

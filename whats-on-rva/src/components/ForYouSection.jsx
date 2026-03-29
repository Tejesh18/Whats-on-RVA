import { formatEventWhen } from '../lib/eventFilters.js';

export default function ForYouSection({ events, favoriteNeighborhoods, onSelectEvent }) {
  if (!favoriteNeighborhoods.size) return null;

  const nh = [...favoriteNeighborhoods];
  const matched = events
    .filter((e) => nh.some((name) => e.neighborhood && e.neighborhood.includes(name)))
    .slice(0, 6);

  if (!matched.length) return null;

  return (
    <section className="mb-10" aria-labelledby="for-you-heading">
      <h2 id="for-you-heading" className="font-display text-xl font-bold text-rva-slate">
        For you · your RVA pockets
      </h2>
      <p className="mt-1 text-sm text-rva-slate/75">
        Pulled from neighborhoods you&apos;ve hearted — tap a card to zoom the Richmond map.
      </p>
      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {matched.map((e) => (
          <li key={e.id} className="min-w-[220px] shrink-0">
            <button
              type="button"
              onClick={() => onSelectEvent?.(e.id)}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-rva-gold"
            >
              <p className="line-clamp-2 font-display text-sm font-bold text-zinc-900">{e.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{formatEventWhen(e.startTime)}</p>
              <p className="truncate text-xs font-medium text-rva-river">{e.neighborhood}</p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

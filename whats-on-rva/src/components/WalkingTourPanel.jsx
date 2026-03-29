import { WALKING_TOURS } from '../data/walkingTours.js';

export default function WalkingTourPanel({ activeSlug, onClear }) {
  if (!activeSlug) return null;
  const tour = WALKING_TOURS[activeSlug];
  if (!tour) return null;

  return (
    <section
      className="mb-8 rounded-3xl border border-rva-james/25 bg-gradient-to-br from-rva-cream to-white p-5 shadow-md"
      aria-labelledby="tour-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="tour-heading" className="font-display text-lg font-bold text-rva-slate">
            Richmond walking tour
          </h2>
          <p className="text-sm text-rva-slate/75">{tour.title}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-rva-river/30 px-3 py-1 text-xs font-bold text-rva-river hover:bg-rva-cream"
        >
          Dismiss
        </button>
      </div>
      <ol className="mt-4 space-y-3">
        {tour.stops.map((stop, i) => (
          <li key={stop.title} className="flex gap-3 rounded-2xl border border-rva-river/12 bg-white/90 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rva-river text-xs font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-rva-james">{stop.kind}</p>
              <p className="font-semibold text-zinc-900">{stop.title}</p>
              <p className="text-sm text-zinc-600">{stop.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-rva-slate/70">
        Demo stops only — wire Mapbox, OSRM, or a partner app for real turn-by-turn through RVA.
      </p>
    </section>
  );
}

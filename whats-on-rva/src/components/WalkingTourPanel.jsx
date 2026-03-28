import { WALKING_TOURS } from '../data/walkingTours.js';

export default function WalkingTourPanel({ activeSlug, onClear }) {
  if (!activeSlug) return null;
  const tour = WALKING_TOURS[activeSlug];
  if (!tour) return null;

  return (
    <section
      className="mb-8 rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-white p-5 shadow-md"
      aria-labelledby="tour-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="tour-heading" className="font-display text-lg font-bold text-violet-950">
            Walking tour mode
          </h2>
          <p className="text-sm text-violet-900/70">{tour.title}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-violet-300 px-3 py-1 text-xs font-bold text-violet-900 hover:bg-violet-100"
        >
          Dismiss
        </button>
      </div>
      <ol className="mt-4 space-y-3">
        {tour.stops.map((stop, i) => (
          <li key={stop.title} className="flex gap-3 rounded-2xl border border-violet-100 bg-white/80 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-violet-500">{stop.kind}</p>
              <p className="font-semibold text-zinc-900">{stop.title}</p>
              <p className="text-sm text-zinc-600">{stop.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-violet-800/70">
        Mock route for demo — swap in real directions or a routing API when you scale.
      </p>
    </section>
  );
}

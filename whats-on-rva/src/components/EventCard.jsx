import { formatEventDayBadge, formatEventWhen } from '../lib/eventFilters.js';

/**
 * Event-style card: large visual, date chip, gradient CTA.
 */
export default function EventCard({ event, selected, onActivate }) {
  const when = formatEventWhen(event.startTime);
  const { month, day } = formatEventDayBadge(event.startTime);
  const tags = Array.isArray(event.tags) ? event.tags.slice(0, 2) : [];

  return (
    <article
      id={`event-card-${event.id}`}
      className={`group overflow-hidden rounded-2xl border bg-white shadow-md transition duration-300 hover:shadow-xl hover:shadow-zinc-900/10 ${
        selected
          ? 'border-amber-400/80 ring-2 ring-amber-400/35'
          : 'border-zinc-200/80 hover:border-zinc-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <button
          type="button"
          onClick={() => onActivate?.(event.id)}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-200 sm:aspect-auto sm:h-auto sm:w-[200px] lg:w-[220px]"
          aria-label={`Focus ${event.title} on map`}
        >
          <img
            src={event.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 sm:bg-gradient-to-r" />
          <div className="absolute left-3 top-3 flex flex-col rounded-xl bg-white/95 px-2.5 py-1.5 text-center shadow-lg backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase leading-none text-amber-600">{month}</span>
            <span className="font-display text-xl font-bold leading-none text-zinc-900">{day}</span>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 sm:bottom-3 sm:left-3 sm:right-3">
            {event.featured ? (
              <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-900">
                Featured
              </span>
            ) : null}
            {event.hiddenGem ? (
              <span className="rounded-md bg-sky-600/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Hidden gem
              </span>
            ) : null}
          </div>
        </button>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zinc-600">
              {event.category}
            </span>
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              {event.sourceName}
            </span>
            {event.isFree ? (
              <span className="text-xs font-bold text-emerald-600">Free</span>
            ) : (
              <span className="text-xs font-bold text-orange-700">{event.price || 'Paid'}</span>
            )}
          </div>

          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-zinc-900 sm:text-xl">
            <button
              type="button"
              onClick={() => onActivate?.(event.id)}
              className="text-left transition hover:text-sky-700 focus:outline-none focus-visible:underline"
            >
              {event.title}
            </button>
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">{when}</p>
          <p className="mt-1 truncate text-sm font-semibold text-sky-800">{event.venue}</p>
          <p className="truncate text-xs text-zinc-400">{event.neighborhood}</p>

          {tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 ring-1 ring-zinc-200/80"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600">{event.description}</p>

          <div className="mt-4">
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 py-3 text-sm font-bold text-white shadow-lg transition hover:from-zinc-800 hover:to-zinc-700 sm:w-auto sm:px-8"
            >
              Get tickets / details
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

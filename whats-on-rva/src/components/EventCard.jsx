import { formatEventWhen } from '../lib/eventFilters.js';

/** One event card; `event` is always NormalizedEvent (see lib/normalizedEvent.js). */
export default function EventCard({ event }) {
  const when = formatEventWhen(event.startTime);
  const tags = Array.isArray(event.tags) ? event.tags : [];
  const badges = Array.isArray(event.accessibilityBadges) ? event.accessibilityBadges : [];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-rva-slate/10 bg-white shadow-sm transition hover:border-rva-river/25 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-rva-slate/10">
        <img
          src={event.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-white/95 px-2 py-0.5 text-xs font-semibold text-rva-slate shadow-sm">
            {event.category}
          </span>
          {event.isFree ? (
            <span className="rounded-md bg-emerald-700/95 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              Free
            </span>
          ) : (
            <span className="rounded-md bg-rva-brick/95 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              {event.price || 'Paid'}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-rva-slate">{event.title}</h3>
        <p className="mt-2 text-sm text-rva-slate/75">{event.neighborhood}</p>
        <p className="text-sm font-medium text-rva-river">{event.venue}</p>
        <p className="mt-3 text-sm text-rva-slate/80">{when}</p>
        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-md bg-rva-cream px-2 py-0.5 text-[11px] font-medium text-rva-slate/70"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {badges.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-md border border-rva-river/20 bg-rva-river/5 px-2 py-0.5 text-[11px] font-medium text-rva-river"
              >
                {b}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-rva-slate/70">
          {event.description}
        </p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-rva-slate/50">
          Source: {event.sourceName}
        </p>
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-rva-slate px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-rva-river"
        >
          View source
        </a>
      </div>
    </article>
  );
}

import { formatEventWhen } from '../lib/eventFilters.js';

/**
 * Compact listing card (Eventbrite-style density): photo, title, when, venue, one CTA.
 */
export default function EventCard({ event, selected, onActivate }) {
  const when = formatEventWhen(event.startTime);
  const tags = Array.isArray(event.tags) ? event.tags.slice(0, 2) : [];

  return (
    <article
      id={`event-card-${event.id}`}
      className={`flex gap-4 overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition sm:gap-4 sm:p-4 ${
        selected
          ? 'border-rva-river ring-2 ring-rva-river/25'
          : 'border-rva-slate/10 hover:border-rva-slate/20'
      }`}
    >
      <button
        type="button"
        onClick={() => onActivate?.(event.id)}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-rva-slate/10 sm:h-28 sm:w-28"
        aria-label={`Focus ${event.title} on map`}
      >
        <img
          src={event.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {event.featured ? (
          <span className="absolute bottom-1 left-1 rounded bg-rva-gold/95 px-1.5 py-0.5 text-[10px] font-bold text-rva-slate">
            Featured
          </span>
        ) : null}
        {event.hiddenGem ? (
          <span className="absolute bottom-1 right-1 rounded bg-rva-river/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
            Gem
          </span>
        ) : null}
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-rva-cream px-2 py-0.5 text-[11px] font-semibold text-rva-slate/80">
            {event.category}
          </span>
          {event.isFree ? (
            <span className="text-[11px] font-bold text-emerald-700">Free</span>
          ) : (
            <span className="text-[11px] font-bold text-rva-brick">{event.price || 'Paid'}</span>
          )}
        </div>
        <h3 className="mt-1 font-display text-base font-bold leading-snug text-rva-slate sm:text-lg">
          <button
            type="button"
            onClick={() => onActivate?.(event.id)}
            className="text-left hover:text-rva-river focus:outline-none focus-visible:underline"
          >
            {event.title}
          </button>
        </h3>
        <p className="mt-1 text-xs text-rva-slate/60 sm:text-sm">{when}</p>
        <p className="truncate text-sm font-medium text-rva-river">{event.venue}</p>
        <p className="mt-0.5 truncate text-xs text-rva-slate/55">{event.neighborhood}</p>
        {tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded bg-rva-slate/5 px-1.5 py-0.5 text-[10px] text-rva-slate/60"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-rva-slate/65 sm:text-sm">
          {event.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-rva-slate px-4 py-2 text-xs font-semibold text-white transition hover:bg-rva-river sm:text-sm"
          >
            Get tickets / details
          </a>
          <span className="text-[10px] text-rva-slate/40">{event.sourceName}</span>
        </div>
      </div>
    </article>
  );
}

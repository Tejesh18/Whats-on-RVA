import { memo, useCallback } from 'react';
import { formatEventDayBadge, formatEventWhen, displaySourceLabel } from '../lib/eventFilters.js';
import { inferSupportBadges } from '../lib/eventSupportBadges.js';
import { shareText } from '../lib/shareRichmond.js';
import EventTransitStrip from './EventTransitStrip.jsx';

/**
 * Full feed card — flatter, snappy interactions; memoized for long lists.
 */
function EventCard({
  event,
  selected,
  onActivate,
  saved,
  onToggleSave,
  relatedStorySlug,
  onOpenStory,
  travelOrigin,
}) {
  const when = formatEventWhen(event.startTime);
  const { month, day } = formatEventDayBadge(event.startTime);
  const tags = Array.isArray(event.tags) ? event.tags.slice(0, 2) : [];
  const badges = Array.isArray(event.accessibilityBadges) ? event.accessibilityBadges : [];
  const supportBadges = inferSupportBadges(event);
  const src = displaySourceLabel(event.sourceName);

  const handleShare = useCallback(async () => {
    const text = `${event.title} — ${when} at ${event.venue}`;
    await shareText({ title: event.title, text, url: event.sourceUrl });
  }, [event.title, event.sourceUrl, when, event.venue]);

  return (
    <article
      id={`event-card-${event.id}`}
      className={`rva-feed-card group overflow-hidden rounded-xl border bg-white shadow-sm transition-[box-shadow,border-color] duration-150 hover:border-zinc-300 hover:shadow-md ${
        selected
          ? 'border-amber-400 ring-2 ring-amber-400/30'
          : 'border-zinc-200'
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
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
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
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold text-white">{src}</span>
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

          {typeof event.latitude === 'number' && typeof event.longitude === 'number' ? (
            <EventTransitStrip event={event} travelOrigin={travelOrigin} />
          ) : null}

          {badges.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {badges.slice(0, 4).map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200/80"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}

          {supportBadges.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {supportBadges.map((b) => (
                <span
                  key={b.id}
                  className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900 ring-1 ring-amber-200/90"
                  title="Inferred from listing text — confirm with the venue"
                >
                  {b.label}
                </span>
              ))}
            </div>
          ) : null}

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

          {relatedStorySlug ? (
            <button
              type="button"
              onClick={() => onOpenStory?.(relatedStorySlug)}
              className="mt-3 w-full rounded-xl border border-violet-200 bg-violet-50/80 py-2 text-xs font-bold text-violet-900 transition hover:bg-violet-100 sm:w-auto sm:px-4"
            >
              Related neighborhood story
            </button>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggleSave?.(event.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                saved
                  ? 'bg-amber-400 text-zinc-900'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-amber-300'
              }`}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
            >
              Share
            </button>
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-zinc-900 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800 sm:flex-none sm:px-6"
            >
              Get tickets
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(EventCard, (a, b) => {
  const oa = a.travelOrigin;
  const ob = b.travelOrigin;
  const originSame =
    oa === ob ||
    (oa &&
      ob &&
      typeof oa.lat === 'number' &&
      typeof ob.lat === 'number' &&
      typeof oa.lng === 'number' &&
      typeof ob.lng === 'number' &&
      oa.lat === ob.lat &&
      oa.lng === ob.lng);
  return (
    a.event === b.event &&
    a.selected === b.selected &&
    a.saved === b.saved &&
    a.relatedStorySlug === b.relatedStorySlug &&
    originSame &&
    a.onActivate === b.onActivate &&
    a.onToggleSave === b.onToggleSave &&
    a.onOpenStory === b.onOpenStory
  );
});

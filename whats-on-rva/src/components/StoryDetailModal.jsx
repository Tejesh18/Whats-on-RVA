import { useEffect, useId, useMemo, useState } from 'react';
import { formatEventWhen, displaySourceLabel } from '../lib/eventFilters.js';
import { getStory } from '../data/neighborhoodStories.js';
import { WALKING_TOURS } from '../data/walkingTours.js';
import { NEIGHBORHOOD_VIBES } from '../data/neighborhoodVibes.js';
import { toggleFavoriteStory, getFavoriteStorySlugs } from '../lib/favoritesStorage.js';
import { getEventsForStoryWeek, findLinkedEventForTimelineRow } from '../lib/storyEventMatch.js';
import { shareStory } from '../lib/shareRichmond.js';
import BeforeAfterSlider from './BeforeAfterSlider.jsx';

function EventRow({ e, onSelectEvent, onClose }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="min-w-0">
        <p className="font-semibold text-zinc-200">{e.title}</p>
        <p className="text-xs text-zinc-500">
          {formatEventWhen(e.startTime)} · {e.venue}
        </p>
        <span className="text-[10px] font-bold uppercase text-zinc-600">
          {displaySourceLabel(e.sourceName)}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onSelectEvent?.(e.id);
            onClose?.();
          }}
          className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20"
        >
          In list / map
        </button>
        <a
          href={e.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-zinc-950 hover:bg-amber-400"
        >
          Get tickets
        </a>
      </div>
    </li>
  );
}

export default function StoryDetailModal({ slug, events, onClose, onSelectEvent, onOpenTourSlug }) {
  const titleId = useId();
  const story = slug ? getStory(slug) : null;
  const [favStories, setFavStories] = useState(() => getFavoriteStorySlugs());

  const { nearbyArea, cultureLinked } = useMemo(
    () => (story ? getEventsForStoryWeek(events, story) : { nearbyArea: [], cultureLinked: [] }),
    [events, story]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!story) return null;

  const tour = WALKING_TOURS[slug];

  const toggleFav = () => {
    toggleFavoriteStory(slug);
    setFavStories(getFavoriteStorySlugs());
  };

  const placesByCategory = useMemo(() => {
    const groups = {};
    for (const p of story.keyPlaces) {
      const c = p.category || 'Places';
      if (!groups[c]) groups[c] = [];
      groups[c].push(p);
    }
    return groups;
  }, [story.keyPlaces]);

  const vibe = useMemo(() => NEIGHBORHOOD_VIBES.find((v) => v.id === slug), [slug]);
  const communityVoices = Array.isArray(story.communityVoices) ? story.communityVoices : [];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div className="relative flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl sm:rounded-3xl">
        <div className="relative h-44 shrink-0 sm:h-52">
          <img src={story.heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
          >
            Close
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{story.neighborhoodTag}</p>
            <h2 id={titleId} className="font-display text-2xl font-bold sm:text-3xl">
              {story.title}
            </h2>
            <p className="text-sm text-zinc-300">{story.subtitle}</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleFav}
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                favStories.has(slug)
                  ? 'bg-amber-400 text-zinc-950'
                  : 'border border-white/20 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {favStories.has(slug) ? 'Saved story' : 'Save story'}
            </button>
            <button
              type="button"
              onClick={() => shareStory(slug, story.title)}
              className="rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-1.5 text-xs font-bold text-sky-100 hover:bg-sky-500/25"
            >
              Share story
            </button>
            {tour ? (
              <button
                type="button"
                onClick={() => onOpenTourSlug?.(slug)}
                className="rounded-full border border-sky-400/50 bg-sky-500/10 px-4 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-500/20"
              >
                Walking tour mode
              </button>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{story.shortDescription}</p>

          {vibe ? (
            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/90">Neighborhood vibe</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">{vibe.bestKnownFor}</p>
              <p className="mt-2 text-xs text-zinc-400">
                <span className="font-bold text-zinc-300">Events:</span> {vibe.typicalEvents}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                <span className="font-bold text-zinc-300">Price:</span> {vibe.priceLevel} ·{' '}
                <span className="font-bold text-zinc-300">Best time:</span> {vibe.bestTime}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {vibe.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-100/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 space-y-6">
            {story.sections.map((sec) => (
              <section key={sec.heading}>
                <h3 className="font-display text-lg font-bold text-white">{sec.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{sec.body}</p>
              </section>
            ))}
          </div>

          <section className="mt-10">
            <h3 className="font-display text-lg font-bold text-amber-200/90">Neighborhood timeline</h3>
            <p className="mt-1 text-xs text-zinc-500">Each era links to a current listing when keywords align.</p>
            <ul className="mt-4 space-y-6 border-l-2 border-amber-500/40 pl-4">
              {story.timeline.map((row) => {
                const linked = findLinkedEventForTimelineRow(events, row);
                return (
                  <li key={row.year} className="relative">
                    <span className="text-xs font-bold text-amber-400">{row.year}</span>
                    {row.image ? (
                      <img
                        src={row.image}
                        alt=""
                        className="mt-2 max-h-40 w-full rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : null}
                    {row.snippet ? (
                      <p className="mt-2 text-sm font-medium italic text-zinc-300">&ldquo;{row.snippet}&rdquo;</p>
                    ) : null}
                    <p className="mt-2 text-sm text-zinc-400">{row.text}</p>
                    {linked ? (
                      <div className="mt-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-sky-200/90">
                          Happening now (theme match)
                        </p>
                        <p className="text-sm font-semibold text-zinc-100">{linked.title}</p>
                        <p className="text-xs text-zinc-500">
                          {formatEventWhen(linked.startTime)} · {linked.neighborhood}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectEvent?.(linked.id);
                              onClose?.();
                            }}
                            className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20"
                          >
                            Open in feed / map
                          </button>
                          <a
                            href={linked.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-zinc-950 hover:bg-amber-400"
                          >
                            Get tickets
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-zinc-600">No themed match in live data right now.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {story.beforeAfter ? (
            <section className="mt-10">
              <h3 className="font-display text-lg font-bold text-white">Before / after</h3>
              <p className="mt-1 text-xs text-zinc-500">Drag the slider — editorial image pairing, not a survey benchmark.</p>
              <div className="mt-4">
                <BeforeAfterSlider
                  beforeUrl={story.beforeAfter.beforeUrl}
                  afterUrl={story.beforeAfter.afterUrl}
                  caption={story.beforeAfter.caption}
                />
              </div>
            </section>
          ) : null}

          {story.whatChanged ? (
            <section className="mt-10 rounded-2xl border border-violet-500/25 bg-violet-950/40 p-5">
              <h3 className="font-display text-lg font-bold text-violet-100">What changed here?</h3>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-violet-300/90">Then</dt>
                  <dd className="text-zinc-300">{story.whatChanged.pastKnown}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-violet-300/90">Now</dt>
                  <dd className="text-zinc-300">{story.whatChanged.presentKnown}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-violet-300/90">Why</dt>
                  <dd className="text-zinc-400">{story.whatChanged.why}</dd>
                </div>
              </dl>
            </section>
          ) : null}

          <section className="mt-10">
            <h3 className="font-display text-lg font-bold text-white">Important locations</h3>
            <p className="mt-1 text-xs text-zinc-500">Clubs, streets, and cultural anchors — orientation for your walk.</p>
            <div className="mt-4 space-y-6">
              {Object.entries(placesByCategory).map(([category, places]) => (
                <div key={category}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400/90">{category}</h4>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {places.map((p) => (
                      <li key={p.name} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="font-bold text-zinc-200">{p.name}</p>
                        <p className="text-xs text-zinc-500">{p.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {communityVoices.length ? (
            <section className="mt-10">
              <h3 className="font-display text-lg font-bold text-white">Community voices</h3>
              <p className="mt-1 text-xs text-zinc-500">Illustrative lines — swap for real oral history when you have permissions.</p>
              <ul className="mt-4 space-y-4">
                {communityVoices.map((v, i) => (
                  <li key={i} className="border-l-4 border-teal-500/60 pl-4">
                    <p className="text-sm italic text-zinc-300">{v.text}</p>
                    <p className="mt-1 text-xs text-zinc-500">— {v.attribution}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <blockquote className="mt-10 border-l-4 border-amber-500 pl-4 italic text-zinc-300">
            {story.quote.text}
            <footer className="mt-2 text-xs not-italic text-zinc-500">— {story.quote.attribution}</footer>
          </blockquote>

          <section className="mt-10 border-t border-white/10 pt-8 pb-4">
            <h3 className="font-display text-lg font-bold text-white">Story + event connection</h3>
            <p className="mt-1 text-xs text-zinc-500">
              <strong className="text-zinc-400">Area:</strong> listings whose neighborhood matches this corridor.{' '}
              <strong className="text-zinc-400">Culture:</strong> jazz, murals, markets, history walks, and similar
              keywords elsewhere in RVA — useful when an event is themed but tagged to another label.
            </p>

            <h4 className="mt-6 text-sm font-bold text-amber-200/90">Events nearby this week (area match)</h4>
            {nearbyArea.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">None in the next 7 days — widen date filters on the main feed.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {nearbyArea.map((e) => (
                  <EventRow key={e.id} e={e} onSelectEvent={onSelectEvent} onClose={onClose} />
                ))}
              </ul>
            )}

            <h4 className="mt-8 text-sm font-bold text-sky-200/90">Events connected by history &amp; culture</h4>
            {cultureLinked.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">
                No extra themed matches right now — try live data or mock events with jazz, mural, or market keywords.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {cultureLinked.map((e) => (
                  <EventRow key={e.id} e={e} onSelectEvent={onSelectEvent} onClose={onClose} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

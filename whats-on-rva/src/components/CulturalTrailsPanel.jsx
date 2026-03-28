import { useMemo, useState } from 'react';
import { CULTURAL_TRAILS } from '../data/culturalTrails.js';
import { formatEventWhen } from '../lib/eventFilters.js';
import { shareTrail } from '../lib/shareRichmond.js';
import { getStory } from '../data/neighborhoodStories.js';

export default function CulturalTrailsPanel({ events, onSelectEvent, onOpenStory }) {
  const [trailId, setTrailId] = useState(CULTURAL_TRAILS[0]?.id || '');

  const trail = CULTURAL_TRAILS.find((t) => t.id === trailId) || CULTURAL_TRAILS[0];
  const matched = useMemo(() => {
    if (!trail) return [];
    return events
      .filter((e) => trail.match(e))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 12);
  }, [events, trail]);

  const story = trail?.storySlug ? getStory(trail.storySlug) : null;

  const handleShare = () => {
    const lines = matched.map(
      (e) => `• ${e.title} — ${formatEventWhen(e.startTime)} @ ${e.venue}`
    );
    shareTrail(trail.name, lines.length ? lines : ['(No matching upcoming events in current filters — widen date or area.)']);
  };

  if (!trail) return null;

  return (
    <div className="mt-4 rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-white p-4 shadow-inner">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700/90">Cultural trails</p>
          <h3 className="font-display text-lg font-bold text-zinc-900">Themed walks + listings</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={trailId}
            onChange={(e) => setTrailId(e.target.value)}
            className="min-w-[180px] rounded-xl border border-violet-200 bg-white py-2 pl-3 pr-8 text-sm font-bold text-zinc-800"
          >
            {CULTURAL_TRAILS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-xs font-bold text-violet-900 hover:bg-violet-50"
          >
            Share trail
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-600">{trail.blurb}</p>
      {story ? (
        <button
          type="button"
          onClick={() => onOpenStory?.(trail.storySlug)}
          className="mt-3 text-xs font-bold text-violet-800 underline-offset-2 hover:underline"
        >
          Open story: {story.title}
        </button>
      ) : null}
      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Walking route</p>
      <p className="text-xs text-zinc-500">
        Use the map’s story pins and your chosen trail stops — route lines are not drawn here (add Mapbox Directions or OSRM when you wire a backend).
      </p>
      <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
        {matched.length === 0 ? (
          <li className="text-sm text-zinc-500">No trail matches in the current feed — relax filters or load live data.</li>
        ) : (
          matched.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelectEvent?.(e.id)}
                className="w-full rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-left text-sm font-semibold text-zinc-800 transition hover:border-violet-300"
              >
                <span className="block">{e.title}</span>
                <span className="text-xs font-medium text-zinc-500">
                  {formatEventWhen(e.startTime)} · {e.neighborhood}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

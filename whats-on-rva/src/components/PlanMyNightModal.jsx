import { useEffect, useId, useMemo, useState, useCallback } from 'react';
import { formatEventWhen, isTonightRichmond, isThisWeekendRichmond } from '../lib/eventFilters.js';
import { shareItinerary } from '../lib/shareRichmond.js';

const INTERESTS = [
  { id: 'music', label: 'Live music / jazz' },
  { id: 'art', label: 'Art / murals' },
  { id: 'food', label: 'Food & drink' },
  { id: 'theatre', label: 'Theatre / performance' },
];

function blob(e) {
  return `${e.title} ${e.description} ${e.category} ${(e.tags || []).join(' ')}`.toLowerCase();
}

function matchesInterest(e, id) {
  const b = blob(e);
  if (id === 'music') return /jazz|music|live|band|dj|concert|soul|blues/i.test(b);
  if (id === 'art') return /art|gallery|mural|opening|exhibit/i.test(b);
  if (id === 'food') return /food|tasting|dinner|brunch|market|brew|wine/i.test(b);
  if (id === 'theatre') return /theatre|theater|play|comedy|performance|dance/i.test(b);
  return true;
}

function buildLines(events, { when, budget, neighborhood, interestSet, pickOffset = 0 }) {
  const now = new Date();
  let pool = events.filter((e) => new Date(e.startTime) >= now);
  if (when === 'tonight') pool = pool.filter((e) => isTonightRichmond(e));
  if (when === 'weekend') pool = pool.filter((e) => isThisWeekendRichmond(e));
  if (neighborhood) pool = pool.filter((e) => e.neighborhood === neighborhood);
  if (budget === 'free') pool = pool.filter((e) => e.isFree);
  if (interestSet.size) {
    pool = pool.filter((e) => [...interestSet].some((id) => matchesInterest(e, id)));
  }
  pool.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const start = pool.length ? pickOffset % pool.length : 0;
  const picks = [...pool.slice(start), ...pool.slice(0, start)].slice(0, 4);
  if (!picks.length) {
    return {
      lines: ['No upcoming matches — loosen filters or check the main feed for more listings.'],
      picks: [],
    };
  }
  const lines = picks.map((e, i) => {
    const t = formatEventWhen(e.startTime);
    const prefix = i === 0 ? 'Start' : i === picks.length - 1 ? 'Finish' : 'Then';
    return `${prefix}: ${e.title} — ${t} at ${e.venue} (${e.neighborhood || 'RVA'})`;
  });
  return { lines, picks };
}

export default function PlanMyNightModal({ open, onClose, events, neighborhoods, onSelectEvent }) {
  const titleId = useId();
  const [when, setWhen] = useState('tonight');
  const [budget, setBudget] = useState('any');
  const [neighborhood, setNeighborhood] = useState('');
  const [interestSet, setInterestSet] = useState(() => new Set(['music']));
  const [pickOffset, setPickOffset] = useState(0);

  const interestToggle = (id) => {
    setInterestSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const itinerary = useMemo(
    () => buildLines(events, { when, budget, neighborhood, interestSet, pickOffset }),
    [events, when, budget, neighborhood, interestSet, pickOffset]
  );

  const regen = useCallback(() => {
    setPickOffset((o) => o + 4);
  }, []);

  useEffect(() => {
    if (open) setPickOffset(0);
  }, [open, when, budget, neighborhood, interestSet]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div className="relative max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="font-display text-xl font-bold text-zinc-900">
              Plan my night
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Rule-based itinerary from your current listings (not a remote AI).</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-600">
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">When</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { id: 'tonight', label: 'Tonight' },
                { id: 'weekend', label: 'This weekend' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setWhen(o.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    when === o.id ? 'bg-amber-400 text-zinc-900' : 'border border-zinc-200 bg-zinc-50 text-zinc-700'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Budget</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { id: 'any', label: 'Any' },
                { id: 'free', label: 'Free-first' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setBudget(o.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    budget === o.id ? 'bg-sky-600 text-white' : 'border border-zinc-200 bg-zinc-50 text-zinc-700'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500" htmlFor="pmn-nbhd">
              Neighborhood
            </label>
            <select
              id="pmn-nbhd"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-3 pr-8 text-sm font-semibold text-zinc-800"
            >
              <option value="">Anywhere in RVA</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Interests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTERESTS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => interestToggle(o.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    interestSet.has(o.id) ? 'bg-violet-600 text-white' : 'border border-zinc-200 bg-zinc-50 text-zinc-600'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={regen}
            className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800"
          >
            Try different picks
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-900/80">Your mini itinerary</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-800">
            {itinerary.lines.map((line, i) => (
              <li key={i} className="leading-snug">
                {line}
              </li>
            ))}
          </ul>
          {itinerary.picks?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {itinerary.picks.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    onSelectEvent?.(e.id);
                    onClose?.();
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 hover:border-amber-300"
                >
                  Focus: {e.title.slice(0, 28)}
                  {e.title.length > 28 ? '…' : ''}
                </button>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => shareItinerary(itinerary.lines, 'My Richmond night')}
            className="mt-4 w-full rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-50"
          >
            Share this plan
          </button>
        </div>
      </div>
    </div>
  );
}

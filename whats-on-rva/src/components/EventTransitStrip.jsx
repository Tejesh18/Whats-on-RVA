import { useMemo } from 'react';
import { getEventTransitSummary } from '../lib/transitEstimates.js';
import { appleMapsDirectionsUrl } from '../lib/travelHandoff.js';

function RichLine({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-emerald-950">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function EventTransitStrip({ event, travelOrigin }) {
  const summary = useMemo(() => getEventTransitSummary(event, travelOrigin), [event, travelOrigin]);

  if (!summary) return null;

  return (
    <div className="mt-2 rounded-lg border border-emerald-200/90 bg-gradient-to-br from-emerald-50/95 to-teal-50/40 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/90">Getting there</p>
      <ul className="mt-1.5 space-y-1 text-xs leading-snug text-emerald-900">
        {summary.lines.map((line) => (
          <li key={line.key} className="flex gap-1.5">
            <span className="shrink-0 text-emerald-600" aria-hidden>
              {line.key === 'pulse' ? '🚶' : '⏱'}
            </span>
            <span>
              <RichLine text={line.text} />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/90">Live routes &amp; traffic</p>
        <p className="mt-0.5 text-[10px] leading-snug text-emerald-800/75">
          Open in Maps for <strong className="font-semibold text-emerald-900">real-time</strong> drive times (traffic), live
          transit, and turn-by-turn — not available inside this page without a paid routing API.
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {summary.directionsModes.map((m) => (
            <a
              key={m.key}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              title={m.hint}
              className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-emerald-900 shadow-sm ring-1 ring-emerald-200/90 transition hover:bg-emerald-100/90 hover:ring-emerald-300"
            >
              {m.label}
            </a>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <a
            href={appleMapsDirectionsUrl(event.latitude, event.longitude, travelOrigin, 'd')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-emerald-800 underline-offset-2 hover:underline"
          >
            Apple Maps · drive
          </a>
          <span className="text-emerald-700/40">·</span>
          <a
            href={appleMapsDirectionsUrl(event.latitude, event.longitude, travelOrigin, 'r')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-emerald-800 underline-offset-2 hover:underline"
          >
            Apple Maps · transit
          </a>
        </div>
      </div>
      <p className="mt-1.5 text-[10px] leading-snug text-emerald-800/75">{summary.disclaimer}</p>
      {!travelOrigin ? (
        <p className="mt-1 text-[10px] font-medium text-emerald-800/80">
          Use <strong>Trip hints from my location</strong> in discovery, or the map&apos;s <strong>Near me</strong> button, for
          “from your location” times.
        </p>
      ) : null}
    </div>
  );
}

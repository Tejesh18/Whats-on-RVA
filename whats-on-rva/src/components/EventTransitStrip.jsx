import { useMemo } from 'react';
import { getEventTransitSummary } from '../lib/transitEstimates.js';

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
      <a
        href={summary.mapsTransitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 underline-offset-2 hover:underline"
      >
        Open Google Maps · transit directions →
      </a>
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

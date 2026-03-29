import { useCallback, useState } from 'react';
import { todayYmdRichmond } from '../data/mockEvents.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toYmd(y, month1, d) {
  return `${y}-${pad2(month1)}-${pad2(d)}`;
}

function parseYmd(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function daysInMonth(year, month1) {
  return new Date(year, month1, 0).getDate();
}

/** Weekday 0–6 (Sun–Sat) for the first of month — local calendar math for grid layout. */
function weekdayOfFirst(year, month1) {
  return new Date(year, month1 - 1, 1).getDay();
}

function monthTitle(year, month1) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month1 - 1, 1)
  );
}

/**
 * Pick an inclusive date range (Richmond-oriented labels). Syncs with optional native date inputs.
 * @param {{ fromYmd: string; toYmd: string }} props
 * @param {(next: { fromYmd: string; toYmd: string }) => void} props.onRangeChange
 */
export default function DateRangeCalendar({ fromYmd, toYmd, onRangeChange }) {
  const today = todayYmdRichmond();
  const tp = parseYmd(today) || { y: 2026, m: 1, d: 1 };

  const [viewY, setViewY] = useState(() => (parseYmd(fromYmd)?.y ?? parseYmd(toYmd)?.y ?? tp.y));
  const [viewM, setViewM] = useState(() => (parseYmd(fromYmd)?.m ?? parseYmd(toYmd)?.m ?? tp.m));

  const setRange = useCallback(
    (next) => {
      onRangeChange({ fromYmd: next.fromYmd || '', toYmd: next.toYmd || '' });
    },
    [onRangeChange]
  );

  const handleDayClick = useCallback(
    (ymd) => {
      const f = String(fromYmd || '').trim();
      const t = String(toYmd || '').trim();

      if (!f && !t) {
        setRange({ fromYmd: ymd, toYmd: ymd });
        return;
      }
      if (f && (!t || f === t)) {
        if (ymd < f) setRange({ fromYmd: ymd, toYmd: f });
        else if (ymd > f) setRange({ fromYmd: f, toYmd: ymd });
        else setRange({ fromYmd: ymd, toYmd: ymd });
        return;
      }
      if (f && t) {
        setRange({ fromYmd: ymd, toYmd: ymd });
      }
    },
    [fromYmd, toYmd, setRange]
  );

  const dim = daysInMonth(viewY, viewM);
  const lead = weekdayOfFirst(viewY, viewM);
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push({ type: 'pad' });
  for (let d = 1; d <= dim; d++) {
    cells.push({ type: 'day', ymd: toYmd(viewY, viewM, d), d });
  }

  const f = String(fromYmd || '').trim();
  const t = String(toYmd || '').trim();

  const inRange = (ymd) => {
    if (!f && !t) return false;
    if (f && !t) return ymd >= f;
    if (!f && t) return ymd <= t;
    const lo = f <= t ? f : t;
    const hi = f <= t ? t : f;
    return ymd >= lo && ymd <= hi;
  };

  const isEndpoint = (ymd) => (f && ymd === f) || (t && ymd === t);

  const goPrev = () => {
    if (viewM <= 1) {
      setViewM(12);
      setViewY((y) => y - 1);
    } else setViewM((m) => m - 1);
  };

  const goNext = () => {
    if (viewM >= 12) {
      setViewM(1);
      setViewY((y) => y + 1);
    } else setViewM((m) => m + 1);
  };

  const summaryFixed =
    !f && !t
      ? 'Showing all upcoming dates (other filters still apply).'
      : f && !t
        ? `From ${f} onward (no end date)`
        : !f && t
          ? `Through ${t}`
          : f === t
            ? `Single day: ${f}`
            : `Range: ${f <= t ? f : t} → ${f <= t ? t : f}`;

  return (
    <div className="rounded-2xl border border-rva-river/15 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-rva-slate/55">When</p>
          <p className="mt-1 text-sm font-semibold text-rva-slate">Pick dates on the calendar</p>
          <p className="mt-0.5 text-xs text-rva-slate/65">
            First tap sets a day; second tap completes the range. Tap again to start over. Times follow{' '}
            <span className="font-semibold text-rva-river">Richmond (ET)</span> for grouping.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex flex-col gap-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            From
            <input
              type="date"
              value={fromYmd || ''}
              onChange={(e) => {
                const v = e.target.value;
                const t = String(toYmd || '').trim();
                if (t && v && t < v) setRange({ fromYmd: v, toYmd: v });
                else setRange({ fromYmd: v, toYmd: toYmd });
              }}
              className="rounded-xl border border-zinc-200 bg-white px-2 py-1.5 text-sm font-semibold text-zinc-900 outline-none focus:border-rva-river focus:ring-2 focus:ring-rva-river/20"
            />
          </label>
          <label className="flex flex-col gap-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            To
            <input
              type="date"
              value={toYmd || ''}
              min={fromYmd || undefined}
              onChange={(e) => {
                const v = e.target.value;
                const f = String(fromYmd || '').trim();
                if (f && v && v < f) setRange({ fromYmd: v, toYmd: f });
                else setRange({ fromYmd: fromYmd, toYmd: v });
              }}
              className="rounded-xl border border-zinc-200 bg-white px-2 py-1.5 text-sm font-semibold text-zinc-900 outline-none focus:border-rva-river focus:ring-2 focus:ring-rva-river/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setRange({ fromYmd: '', toYmd: '' })}
            className="mt-4 rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700 transition hover:border-rva-brick hover:bg-rva-cream sm:mt-0"
          >
            Clear dates
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-rva-slate/80">{summaryFixed}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display text-base font-bold text-rva-slate">{monthTitle(viewY, viewM)}</p>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (cell.type === 'pad') {
            return <div key={`p-${idx}`} className="aspect-square" />;
          }
          const { ymd, d } = cell;
          const past = ymd < today;
          const on = inRange(ymd);
          const end = isEndpoint(ymd);
          return (
            <button
              key={ymd}
              type="button"
              onClick={() => !past && handleDayClick(ymd)}
              disabled={past}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold transition ${
                past
                  ? 'cursor-not-allowed text-zinc-300'
                  : end
                    ? 'bg-rva-river text-white shadow-md ring-1 ring-rva-river-light/50'
                    : on
                      ? 'bg-rva-cream text-rva-slate ring-1 ring-rva-gold/35'
                      : 'text-zinc-800 hover:bg-zinc-100'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

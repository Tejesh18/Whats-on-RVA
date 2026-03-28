import { useId, useState } from 'react';

export default function BeforeAfterSlider({ beforeUrl, afterUrl, caption }) {
  const id = useId();
  const [pct, setPct] = useState(52);

  if (!beforeUrl || !afterUrl) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="relative aspect-[16/9] w-full select-none">
        <img src={afterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <img
          src={beforeUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        />
        <input
          id={id}
          type="range"
          min={8}
          max={92}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          aria-label="Drag to compare before and after"
        />
        <div
          className="pointer-events-none absolute top-0 bottom-0 z-[5] w-0.5 bg-amber-400/95 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          style={{ left: `${pct}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 z-[5] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/50 shadow-lg backdrop-blur-sm"
          style={{ left: `${pct}%` }}
        />
        <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-200">
          Before
        </div>
        <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-200">
          Today
        </div>
      </div>
      {caption ? (
        <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-zinc-400">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

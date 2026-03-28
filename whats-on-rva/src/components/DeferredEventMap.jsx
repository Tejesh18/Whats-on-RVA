import { useEffect, useRef, useState } from 'react';
import EventMap from './EventMap.jsx';

/**
 * Defers mounting Leaflet until the map column is near the viewport — avoids blocking first paint.
 */
export default function DeferredEventMap(props) {
  const wrapRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={wrapRef} className="w-full">
      {show ? (
        <EventMap {...props} />
      ) : (
        <div
          className="flex h-[min(320px,45vh)] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-100 text-zinc-500 sm:h-[min(360px,42vh)] lg:h-[min(74vh,680px)] lg:min-h-[420px]"
          aria-hidden
        >
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Map</span>
          <p className="max-w-[200px] text-center text-[11px]">Loading map as you scroll…</p>
        </div>
      )}
    </div>
  );
}

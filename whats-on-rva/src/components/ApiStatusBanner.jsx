import { rvaVoice } from '../config/rvaVoice.js';

/**
 * Shown when live APIs fail or return empty — encourages retry; explains fallback.
 */
export default function ApiStatusBanner({ loadError, usingFallback, onRetry, loading }) {
  if (!loadError && !usingFallback) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-rva-gold/35 bg-gradient-to-r from-[#faf6e8] to-rva-cream px-4 py-3 shadow-sm sm:px-5"
      role="status"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-rva-brick-deep">{rvaVoice.apiBannerTitle}</p>
          {loadError ? (
            <p className="mt-1 text-sm text-rva-slate/90">{loadError}</p>
          ) : null}
          {usingFallback ? (
            <p className="mt-1 text-xs text-rva-slate/80">
              Showing curated <strong>sample RVA listings</strong> so you can still try filters, the map, and
              neighborhood stories. Retry to pull CultureWorks and any partner feeds again.
            </p>
          ) : null}
        </div>
        {onRetry ? (
          <button
            type="button"
            disabled={loading}
            onClick={onRetry}
            className="shrink-0 rounded-full bg-rva-river px-5 py-2 text-sm font-bold text-white transition hover:bg-rva-river-light disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Retry RVA feeds'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

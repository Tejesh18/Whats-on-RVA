/**
 * Shown when live APIs fail or return empty — encourages retry; explains fallback.
 */
export default function ApiStatusBanner({ loadError, usingFallback, onRetry, loading }) {
  if (!loadError && !usingFallback) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/90 px-4 py-3 shadow-sm sm:px-5"
      role="status"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-amber-950">Live calendar status</p>
          {loadError ? (
            <p className="mt-1 text-sm text-amber-900/85">{loadError}</p>
          ) : null}
          {usingFallback ? (
            <p className="mt-1 text-xs text-amber-900/75">
              Showing curated <strong>example Richmond events</strong> so you can still explore filters,
              map, and stories. Retry to pull live feeds again.
            </p>
          ) : null}
        </div>
        {onRetry ? (
          <button
            type="button"
            disabled={loading}
            onClick={onRetry}
            className="shrink-0 rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Retry live feeds'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

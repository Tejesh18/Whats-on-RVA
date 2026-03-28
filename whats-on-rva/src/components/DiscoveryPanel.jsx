/**
 * Search-adjacent discovery: area, type, price, date, accessibility chips, quick actions.
 */
const A11Y_OPTIONS = [
  { id: 'family', label: 'Family friendly' },
  { id: 'wheelchair', label: 'Wheelchair accessible' },
  { id: 'multilingual', label: 'Multilingual' },
  { id: 'transit', label: 'Transit friendly' },
];

export default function DiscoveryPanel({
  neighborhoods,
  categories,
  filters,
  onFiltersChange,
  datePreset,
  onDatePresetChange,
  accessibilityKeys,
  onAccessibilityToggle,
  tonightActive,
  onTonightToggle,
  weekendActive,
  onWeekendToggle,
  nearTonightActive,
  onNearTonightToggle,
  onNearTonightRequestGeo,
  smallVenuesActive,
  onSmallVenuesToggle,
  prioritizeCommunityActive,
  onPrioritizeCommunityToggle,
  savedCategories,
  onToggleSavedCategory,
  pricePreference,
  onPricePreferenceChange,
  onOpenPlanMyNight,
  onSurpriseMe,
  geoStatus,
}) {
  const selectClass =
    'w-full min-w-[120px] cursor-pointer appearance-none rounded-full border border-zinc-200/90 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-zinc-800 shadow-sm outline-none transition hover:border-zinc-300 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/25';

  const quickBase =
    'rounded-full px-3 py-2 text-xs font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:px-4 sm:text-sm';
  const quickOn = 'bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 ring-2 ring-amber-300 ring-offset-2 ring-offset-white';
  const quickOff = 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300';

  const catSet = savedCategories instanceof Set ? savedCategories : new Set();

  return (
    <div className="space-y-6">
      {onToggleSavedCategory ? (
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">For you · saved event types</p>
          <p className="mb-2 text-xs text-zinc-500">Tap categories you want recommended more often.</p>
          <div className="flex max-h-[5.5rem] flex-wrap gap-2 overflow-y-auto [scrollbar-width:thin]">
            {categories.slice(0, 20).map((c) => {
              const on = catSet.has(c);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggleSavedCategory(c)}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                    on ? 'bg-violet-600 text-white shadow-md' : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-violet-300'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {onPricePreferenceChange ? (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">For you · free vs paid taste</p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'any', label: 'Any' },
              { id: 'free', label: 'Lean free' },
              { id: 'paid', label: 'Lean paid' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={pricePreference === o.id}
                onClick={() => onPricePreferenceChange(o.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  pricePreference === o.id
                    ? 'bg-emerald-600 text-white'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Neighborhood
            </label>
            <div className="relative">
              <select
                value={filters.neighborhood}
                onChange={(e) => onFiltersChange({ ...filters, neighborhood: e.target.value })}
                className={selectClass}
              >
                <option value="">All areas</option>
                {neighborhoods.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Event type
            </label>
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                className={selectClass}
              >
                <option value="">All types</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Free / paid
            </label>
            <div className="relative">
              <select
                value={filters.price}
                onChange={(e) => onFiltersChange({ ...filters, price: e.target.value })}
                className={selectClass}
              >
                <option value="">Any</option>
                <option value="free">Free only</option>
                <option value="paid">Paid only</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Date
            </label>
            <div className="relative">
              <select
                value={datePreset}
                onChange={(e) => onDatePresetChange(e.target.value)}
                className={selectClass}
              >
                <option value="any">Any date</option>
                <option value="today">Today</option>
                <option value="weekend">This weekend</option>
                <option value="next7">Next 7 days</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Accessibility</p>
        <div className="flex flex-wrap gap-2">
          {A11Y_OPTIONS.map((opt) => {
            const on = accessibilityKeys.has(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                onClick={() => onAccessibilityToggle(opt.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  on ? 'bg-emerald-600 text-white shadow-md' : 'border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-emerald-300'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quick discovery</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={tonightActive}
            onClick={onTonightToggle}
            className={`${quickBase} ${tonightActive ? quickOn : quickOff}`}
          >
            Tonight in RVA
          </button>
          <button
            type="button"
            aria-pressed={weekendActive}
            onClick={onWeekendToggle}
            className={`${quickBase} ${weekendActive ? quickOn : quickOff}`}
          >
            This weekend
          </button>
          <button
            type="button"
            aria-pressed={nearTonightActive}
            onClick={() => {
              onNearTonightToggle();
              onNearTonightRequestGeo?.();
            }}
            className={`${quickBase} ${nearTonightActive ? quickOn : quickOff}`}
          >
            Near me tonight
          </button>
          <button type="button" onClick={onSurpriseMe} className={`${quickBase} ${quickOff}`}>
            Surprise me
          </button>
          <button
            type="button"
            aria-pressed={smallVenuesActive}
            onClick={onSmallVenuesToggle}
            className={`${quickBase} ${smallVenuesActive ? quickOn : quickOff}`}
          >
            Support small venues
          </button>
          {onPrioritizeCommunityToggle ? (
            <button
              type="button"
              aria-pressed={prioritizeCommunityActive}
              onClick={onPrioritizeCommunityToggle}
              className={`${quickBase} ${prioritizeCommunityActive ? quickOn : quickOff}`}
            >
              Prioritize community orgs
            </button>
          ) : null}
          {onOpenPlanMyNight ? (
            <button type="button" onClick={onOpenPlanMyNight} className={`${quickBase} ${quickOff}`}>
              Plan my night
            </button>
          ) : null}
        </div>
        {geoStatus ? <p className="mt-2 text-xs text-amber-800">{geoStatus}</p> : null}
      </div>
    </div>
  );
}

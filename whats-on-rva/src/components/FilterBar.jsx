/**
 * Filters + Tonight — horizontal scroll on small screens, modern pill selects.
 */
export default function FilterBar({
  neighborhoods,
  categories,
  filters,
  onChange,
  tonightActive,
  onTonightClick,
}) {
  const selectClass =
    'w-full min-w-[140px] cursor-pointer appearance-none rounded-full border border-zinc-200/90 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-zinc-800 shadow-sm outline-none ring-amber-400/0 transition hover:border-zinc-300 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/25';

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <div className="flex min-w-0 gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden lg:flex-1">
        <div className="min-w-[min(100%,11rem)] shrink-0 sm:min-w-0 sm:flex-1">
          <label
            htmlFor="filter-neighborhood"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Area
          </label>
          <div className="relative">
            <select
              id="filter-neighborhood"
              value={filters.neighborhood}
              onChange={(e) => onChange({ ...filters, neighborhood: e.target.value })}
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
        <div className="min-w-[min(100%,11rem)] shrink-0 sm:min-w-0 sm:flex-1">
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Type
          </label>
          <div className="relative">
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
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
        <div className="min-w-[min(100%,10rem)] shrink-0 sm:min-w-0 sm:flex-1">
          <label
            htmlFor="filter-price"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Price
          </label>
          <div className="relative">
            <select
              id="filter-price"
              value={filters.price}
              onChange={(e) => onChange({ ...filters, price: e.target.value })}
              className={selectClass}
            >
              <option value="">Any</option>
              <option value="free">Free only</option>
              <option value="paid">Paid only</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <span className="mb-1.5 hidden text-[10px] font-bold uppercase tracking-widest text-zinc-500 lg:block">
          Quick
        </span>
        <button
          type="button"
          onClick={onTonightClick}
          aria-pressed={tonightActive}
          className={`w-full rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:w-auto ${
            tonightActive
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-900 ring-2 ring-amber-300 ring-offset-2 ring-offset-white'
              : 'bg-zinc-900 text-white hover:bg-zinc-800'
          }`}
        >
          Tonight
        </button>
      </div>
    </div>
  );
}

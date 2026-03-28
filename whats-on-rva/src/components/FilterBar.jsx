/**
 * Neighborhood, category, and free/paid filters + "Tonight in RVA" quick action.
 */
export default function FilterBar({
  neighborhoods,
  categories,
  filters,
  onChange,
  tonightActive,
  onTonightClick,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filter-neighborhood"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-rva-slate/70"
          >
            Neighborhood
          </label>
          <select
            id="filter-neighborhood"
            value={filters.neighborhood}
            onChange={(e) => onChange({ ...filters, neighborhood: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-3 py-2.5 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">All neighborhoods</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-rva-slate/70"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-3 py-2.5 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filter-price"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-rva-slate/70"
          >
            Free vs paid
          </label>
          <select
            id="filter-price"
            value={filters.price}
            onChange={(e) => onChange({ ...filters, price: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-3 py-2.5 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">All events</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>
        </div>
      </div>
      <div className="shrink-0">
        <span className="mb-1.5 hidden text-xs font-semibold uppercase tracking-wide text-rva-slate/70 lg:block">
          Quick action
        </span>
        <button
          type="button"
          onClick={onTonightClick}
          aria-pressed={tonightActive}
          className={`w-full rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rva-gold focus:ring-offset-2 focus:ring-offset-rva-cream lg:w-auto ${
            tonightActive
              ? 'bg-rva-gold text-rva-slate ring-2 ring-rva-gold ring-offset-2 ring-offset-rva-cream'
              : 'bg-rva-brick text-white hover:bg-rva-brick/90'
          }`}
        >
          Tonight in RVA
        </button>
      </div>
    </div>
  );
}

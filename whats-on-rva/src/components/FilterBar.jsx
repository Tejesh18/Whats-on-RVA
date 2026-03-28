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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
      <div className="grid flex-1 gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filter-neighborhood"
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-rva-slate/55"
          >
            Area
          </label>
          <select
            id="filter-neighborhood"
            value={filters.neighborhood}
            onChange={(e) => onChange({ ...filters, neighborhood: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-2.5 py-2 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">All areas</option>
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
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-rva-slate/55"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-2.5 py-2 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">All types</option>
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
            className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-rva-slate/55"
          >
            Price
          </label>
          <select
            id="filter-price"
            value={filters.price}
            onChange={(e) => onChange({ ...filters, price: e.target.value })}
            className="w-full rounded-lg border border-rva-slate/15 bg-white px-2.5 py-2 text-sm text-rva-slate shadow-sm outline-none ring-rva-gold/30 focus:ring-2"
          >
            <option value="">Any</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>
        </div>
      </div>
      <div className="shrink-0">
        <span className="mb-1 hidden text-[11px] font-semibold uppercase tracking-wide text-rva-slate/55 lg:block">
          Quick
        </span>
        <button
          type="button"
          onClick={onTonightClick}
          aria-pressed={tonightActive}
          className={`w-full rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rva-gold focus:ring-offset-2 focus:ring-offset-white lg:w-auto ${
            tonightActive
              ? 'bg-rva-gold text-rva-slate ring-2 ring-rva-gold ring-offset-2 ring-offset-white'
              : 'bg-rva-brick text-white hover:bg-rva-brick/90'
          }`}
        >
          Tonight
        </button>
      </div>
    </div>
  );
}

/** Eventbrite-style scope tabs — one list, less page scroll. */
const tabs = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'gems', label: 'Hidden gems' },
];

export default function BrowseTabs({ value, onChange, counts }) {
  return (
    <div
      className="flex gap-1 rounded-xl bg-rva-slate/5 p-1"
      role="tablist"
      aria-label="Browse events"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold transition sm:flex-none sm:px-5 ${
            value === t.id
              ? 'bg-white text-rva-river shadow-sm'
              : 'text-rva-slate/60 hover:text-rva-slate'
          }`}
        >
          {t.label}
          {counts?.[t.id] != null ? (
            <span className="ml-1 text-xs font-normal text-rva-slate/45">({counts[t.id]})</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

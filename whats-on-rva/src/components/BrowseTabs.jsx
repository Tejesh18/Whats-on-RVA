const tabs = [
  { id: 'all', label: 'All' },
  { id: 'foryou', label: 'For you' },
  { id: 'featured', label: 'Featured' },
  { id: 'gems', label: 'Hidden gems' },
];

export default function BrowseTabs({ value, onChange, counts }) {
  return (
    <div
      className="inline-flex gap-0.5 rounded-full border border-rva-slate/12 bg-rva-parchment/90 p-1 shadow-inner"
      role="tablist"
      aria-label="Browse Richmond event lists"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`relative rounded-full px-4 py-2 text-sm font-bold transition sm:px-6 ${
            value === t.id
              ? 'bg-white text-rva-slate shadow-md ring-1 ring-rva-river/20'
              : 'text-rva-slate/55 hover:text-rva-slate'
          }`}
        >
          {t.label}
          {counts?.[t.id] != null ? (
            <span
              className={`ml-1 text-xs font-semibold tabular-nums ${
                value === t.id ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {counts[t.id]}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

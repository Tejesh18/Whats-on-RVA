const SECTIONS = [
  { id: 'events', label: 'Events' },
  { id: 'stories', label: 'RVA stories' },
  { id: 'plan', label: 'Plan your night' },
];

export default function HomeSectionTabs({ value, onChange }) {
  return (
    <div
      className="sticky top-0 z-40 -mx-4 mb-6 border-b border-rva-brick/15 bg-rva-cream/95 px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:mb-8 lg:rounded-2xl lg:border lg:border-rva-river/15 lg:bg-white lg:px-2 lg:py-2 lg:shadow-sm"
      role="tablist"
      aria-label="Main sections"
    >
      <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => {
          const on = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(s.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:px-6 ${
                on
                  ? 'bg-rva-river text-white shadow-md ring-1 ring-rva-river-light/40'
                  : 'text-rva-slate/80 hover:bg-rva-parchment hover:text-rva-slate'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

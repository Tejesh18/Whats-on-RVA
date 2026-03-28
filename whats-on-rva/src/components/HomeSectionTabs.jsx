const SECTIONS = [
  { id: 'events', label: 'Events' },
  { id: 'stories', label: 'Neighborhood stories' },
  { id: 'plan', label: 'Plan & personalize' },
];

export default function HomeSectionTabs({ value, onChange }) {
  return (
    <div
      className="sticky top-0 z-40 -mx-4 mb-6 border-b border-zinc-200/90 bg-[#f4f1eb] px-4 py-3 sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:mb-8 lg:rounded-2xl lg:border lg:border-zinc-200 lg:bg-white lg:px-2 lg:py-2 lg:shadow-sm"
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
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
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

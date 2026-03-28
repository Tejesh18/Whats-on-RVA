/**
 * Live search across title, venue, keywords, etc.
 */
export default function SearchBar({ value, onChange, id = 'event-search' }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search events
      </label>
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rva-slate/50"
        aria-hidden
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, venue, or keyword…"
        className="w-full rounded-xl border border-rva-slate/15 bg-white py-3.5 pl-12 pr-4 text-rva-slate shadow-sm outline-none ring-rva-gold/40 transition placeholder:text-rva-slate/40 focus:border-rva-river focus:ring-2"
      />
    </div>
  );
}

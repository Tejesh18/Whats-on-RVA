/**
 * Hero-style search field.
 */
export default function SearchBar({ value, onChange, id = 'event-search' }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search events
      </label>
      <span
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
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
        placeholder="Search artists, venues, genres…"
        className="w-full rounded-full border border-zinc-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-zinc-900 shadow-lg shadow-zinc-900/5 outline-none ring-amber-400/0 transition placeholder:text-zinc-400 focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/15"
      />
    </div>
  );
}

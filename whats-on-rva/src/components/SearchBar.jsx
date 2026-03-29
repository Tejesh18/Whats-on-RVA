import { rvaVoice } from '../config/rvaVoice.js';

/**
 * Hero-style search field (large, clear focus ring).
 */
export default function SearchBar({ value, onChange, id = 'event-search', pending = false }) {
  return (
    <div className={`relative transition-opacity duration-150 ${pending ? 'opacity-80' : ''}`}>
      <label htmlFor={id} className="sr-only">
        {rvaVoice.searchEventsLabel}
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
        placeholder={rvaVoice.searchPlaceholder}
        className={`w-full rounded-full border border-zinc-200/90 bg-white py-3.5 pl-14 text-base font-medium text-zinc-900 shadow-md shadow-zinc-900/[0.03] outline-none transition placeholder:text-zinc-400 focus:border-rva-river/40 focus:ring-2 focus:ring-rva-river/15 ${pending ? 'pr-11' : 'pr-5'}`}
      />
      {pending ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-zinc-400">
          …
        </span>
      ) : null}
    </div>
  );
}

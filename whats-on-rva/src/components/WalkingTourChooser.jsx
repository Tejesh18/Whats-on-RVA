import { STORY_SLUGS } from '../data/neighborhoodStories.js';

const LABELS = {
  'jackson-ward': 'Jackson Ward',
  'church-hill': 'Church Hill',
  blackwell: 'Blackwell',
};

/**
 * Choose a neighborhood to show the mock walking tour panel.
 */
export default function WalkingTourChooser({ value, onChange }) {
  return (
    <div className="mb-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm">
      <label htmlFor="walking-tour-select" className="text-sm font-bold text-zinc-800">
        Walking tour mode
      </label>
      <p className="mt-1 text-xs text-zinc-500">
        Pick a neighborhood for a mocked three-stop route (story → historic beat → event hint). Blackwell is
        available here even though it isn’t on the five-card spotlight row.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          id="walking-tour-select"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="min-w-[200px] flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900"
        >
          <option value="">Choose neighborhood…</option>
          {STORY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {LABELS[slug] || slug}
            </option>
          ))}
        </select>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

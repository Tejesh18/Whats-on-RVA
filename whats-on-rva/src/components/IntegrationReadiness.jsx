/**
 * Partner-facing signal: this is a thin discovery layer, not a throwaway page.
 */
const items = [
  {
    title: 'Uses existing public event sources',
    body: 'Starts from APIs and feeds publishers already maintain — no parallel calendar to staff.',
  },
  {
    title: 'Modular service layer for future source adapters',
    body: 'Each source maps into one normalized schema; add Eventbrite, RSS, or a City proxy without rewriting cards.',
  },
  {
    title: 'Graceful fallback when live APIs fail',
    body: 'Network, CORS, or empty responses fall back to bundled sample data so demos and pilots stay usable.',
  },
  {
    title: 'No new content-entry system required',
    body: 'Editors keep using CultureWorks, Eventbrite, or their CMS; this app is read-only discovery + deep links.',
  },
];

export default function IntegrationReadiness() {
  return (
    <section
      id="ready-to-integrate"
      className="scroll-mt-20"
      aria-labelledby="integration-heading"
    >
      <h2
        id="integration-heading"
        className="font-display text-2xl font-bold text-rva-slate sm:text-3xl"
      >
        Ready to integrate
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-rva-slate/70">
        Built like a pilot: swap URLs via environment variables, add adapters, and merge sources without
        redesigning the UI.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-rva-river/15 bg-gradient-to-br from-white to-rva-river/[0.04] p-6 shadow-sm"
          >
            <h3 className="font-display text-lg font-bold text-rva-river">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-rva-slate/75">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

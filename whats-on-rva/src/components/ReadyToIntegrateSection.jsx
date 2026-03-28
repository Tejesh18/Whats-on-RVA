/**
 * Product narrative for partners / funders — how this stack extends without manual city CMS.
 */
const cards = [
  {
    title: 'Uses existing public event sources',
    body: 'CultureWorks Localist-style JSON and optional partner ticket search power the grid — no proprietary scraping of ticket pages. RSS hooks are stubbed for partner feeds.',
  },
  {
    title: 'Museums & oral history ready',
    body: 'Story modals and map layers are editorial today; the same slots can load verified copy, audio clips, and collection links from The Valentine, Black History Museum, or VCU oral history archives.',
  },
  {
    title: 'No manual city-wide content entry for events',
    body: 'As long as upstream calendars publish structured data, listings stay fresh. Editors focus on neighborhood narratives and trust copy — not re-keying every show.',
  },
  {
    title: 'Future datasets & story partners',
    body: 'Neighborhood polygons, heritage pins, and “culture keyword” matching are designed to accept richer GIS and taxonomy when you partner with historians or planners.',
  },
];

export default function ReadyToIntegrateSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="integrate-heading"
    >
      <h2 id="integrate-heading" className="font-display text-2xl font-bold text-zinc-900">
        Ready to integrate
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-600">
        This front end is built to plug into institutions and public data — not to replace them.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li
            key={c.title}
            className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-5 shadow-sm"
          >
            <h3 className="font-display text-base font-bold text-emerald-950">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-emerald-950/80">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

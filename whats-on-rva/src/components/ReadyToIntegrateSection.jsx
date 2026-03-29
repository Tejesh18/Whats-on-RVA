/**
 * Product narrative for partners / funders — how this stack extends without manual city CMS.
 */
const cards = [
  {
    title: 'Plugs into Richmond’s public calendars',
    body: 'CultureWorks-style JSON (and optional ticket search) powers the grid — no scraping checkout pages. RSS hooks wait for venue or consortium feeds.',
  },
  {
    title: 'Museum Row & archives ready',
    body: 'Story modals are editorial placeholders today; the same UI can carry verified essays, audio, and collection deep links from The Valentine, the Black History Museum & Cultural Center of Virginia, or VCU oral history projects.',
  },
  {
    title: 'Editors focus on place, not data entry',
    body: 'When upstream calendars stay structured, listings track the real city. Your team spends time on neighborhood voice and trust — not retyping every Brown’s Island date.',
  },
  {
    title: 'Room for planners & historians',
    body: 'Polygons, heritage pins, and culture keywords are ready for richer GIS and taxonomy when you partner with city planners, preservationists, or storytellers.',
  },
];

export default function ReadyToIntegrateSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="integrate-heading"
    >
      <h2 id="integrate-heading" className="font-display text-2xl font-bold text-rva-slate">
        Built to grow with RVA institutions
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-rva-slate/75">
        This layer complements Richmond’s cultural institutions and open data — it doesn&apos;t compete with their box offices
        or collections.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li
            key={c.title}
            className="rounded-2xl border border-rva-james/20 bg-gradient-to-br from-rva-cream to-white p-5 shadow-sm"
          >
            <h3 className="font-display text-base font-bold text-rva-slate">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-rva-slate/80">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const cards = [
  {
    title: 'Easier to discover local creative work',
    body: 'One place to scan what’s happening — grounded in links back to real listings, not a walled garden.',
  },
  {
    title: 'Supports local artists and organizations',
    body: 'Traffic flows to the venues and publishers who already maintain calendars and ticket pages.',
  },
  {
    title: 'Reduces dependence on luck or insider knowledge',
    body: 'Public feeds and APIs mean the product can stay current without a manual copy desk.',
  },
];

/**
 * Short “why this matters” row for judges and civic framing.
 */
export default function WhyMatters() {
  return (
    <section className="mt-14" aria-labelledby="why-heading">
      <h2
        id="why-heading"
        className="font-display text-2xl font-bold text-rva-slate sm:text-3xl"
      >
        Why this matters
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-rva-slate/70">
        Aggregation from sources that already exist — credible, link-out, weekend-buildable.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <li
            key={c.title}
            className="rounded-2xl border border-rva-slate/10 bg-white p-6 shadow-sm"
          >
            <h3 className="font-display text-lg font-bold text-rva-river">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-rva-slate/75">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

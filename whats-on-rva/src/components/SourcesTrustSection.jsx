export default function SourcesTrustSection() {
  const items = [
    {
      title: 'CultureWorks Localist API',
      body: 'Richmond CultureWorks calendar JSON is the default live source — same family of tools many regions call “Localist.”',
      status: 'Live',
    },
    {
      title: 'Partner ticket search',
      body: 'Optional listings near Richmond: dev proxy with a private API token, or your own HTTPS proxy in production.',
      status: 'Optional',
    },
    {
      title: 'Partner RSS feeds',
      body: 'Reserved in `fetchRssNormalized` — add stable feed URLs for venues or consortia.',
      status: 'Planned',
    },
    {
      title: 'The Valentine',
      body: 'Future hook for collection images, walking-tour data, and verified neighborhood essays.',
      status: 'Future',
    },
    {
      title: 'Black History Museum of Virginia',
      body: 'Future partner slot for exhibits, oral history clips, and school-program tie-ins.',
      status: 'Future',
    },
    {
      title: 'VCU oral histories',
      body: 'Future integration for excerpted quotes and deep links — replacing illustrative copy in story modals.',
      status: 'Future',
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="sources-trust-heading"
    >
      <h2 id="sources-trust-heading" className="font-display text-2xl font-bold text-zinc-900">
        Built from existing public sources
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-600">
        We aggregate what&apos;s already published — you always confirm details on the organizer&apos;s site.
        Story copy on this demo is editorial illustration until museum partners wire in.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.title} className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-bold leading-snug text-zinc-900">{it.title}</h3>
              <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-600">
                {it.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

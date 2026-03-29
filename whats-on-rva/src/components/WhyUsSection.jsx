import { siteConfig } from '../config/siteConfig.js';

const edges = [
  {
    title: 'City-scoped, not “everywhere USA”',
    body: `Listings and the map honor Richmond’s municipal footprint — so you’re not drowning in Henrico strip-mall noise when you meant a night around Broad Street, Church Hill, or the James.`,
  },
  {
    title: 'Neighborhoods first',
    body: 'Stories, spotlights, and filters speak the language locals use: the Fan, Jackson Ward, Manchester, Scott’s Addition — place as part of the plan, not an afterthought.',
  },
  {
    title: 'Built for “what are we doing?”',
    body: 'Tonight and weekend modes, hidden gems, cultural trails, and a planning assistant tuned to what’s already on your screen — closer to a knowledgeable friend than a checkout funnel.',
  },
  {
    title: 'Champion small rooms & community orgs',
    body: 'Signals and filters lift grassroots culture, small venues, and community-led programming — the layer of Richmond that doesn’t always buy the biggest ads.',
  },
  {
    title: 'One calm surface for public feeds',
    body: 'CultureWorks-style calendars (and optional partner ticket search when you wire it) land in one map-and-list experience — discovery without rebuilding a city CMS.',
  },
];

export default function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="relative scroll-mt-20 border-b border-rva-brick/25 bg-gradient-to-b from-rva-slate via-rva-slate to-[#1a1d28]"
      aria-labelledby="why-us-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rva-gold/45 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rva-gold">Why us</p>
          <h2 id="why-us-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why {siteConfig.siteName}?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            <strong className="font-semibold text-zinc-200">Big apps are built for transactions</strong> when you already know
            the artist. We&apos;re for{' '}
            <strong className="font-semibold text-zinc-200">wandering Richmond with context</strong> — the River City&apos;s
            neighborhoods, its creative rooms, and the way people actually string a night together.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:gap-5">
          {edges.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-rva-gold/30 hover:bg-white/[0.06]"
            >
              <h3 className="font-display text-base font-bold text-[#f5e6b8] sm:text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-rva-river/35 bg-rva-river/15 px-5 py-5 text-center sm:px-8">
          <p className="text-sm font-semibold text-zinc-200">Still the organizer&apos;s show</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            You&apos;ll open venue and presenter pages for tickets, refunds, and last-minute changes — we&apos;re the{' '}
            <strong className="text-zinc-300">discovery layer</strong>, not the box office. The hope is simple:{' '}
            <strong className="text-zinc-300">make RVA easier to love night by night.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

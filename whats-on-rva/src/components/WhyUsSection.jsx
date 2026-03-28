import { siteConfig } from '../config/siteConfig.js';

const edges = [
  {
    title: 'Richmond-native, not global noise',
    body: `Search and maps stay scoped to the city. You’re not competing with every metro for attention — ${siteConfig.siteName} is built as a front door for RVA nights out.`,
  },
  {
    title: 'Place matters: stories, not just tickets',
    body: 'Neighborhood timelines, zoom-to-story maps, before/after views, and community voices — so you understand *where* you’re going, not only who’s headlining.',
  },
  {
    title: 'Discovery-first planning',
    body: 'For you picks, cultural trails, hidden gems, “tonight / weekend” modes, and a planning assistant that talks like a local — built for “what should we do?” not just checkout.',
  },
  {
    title: 'Support the ecosystem you care about',
    body: 'Signals for small venues, community-led orgs, and grassroots culture — plus filters that prioritize the kind of Richmond you want to show up for.',
  },
  {
    title: 'Your sources, one calm surface',
    body: 'Pulls from public Richmond calendars (e.g. CultureWorks) and can layer optional ticket-listing feeds when you configure them — one map-and-feed surface.',
  },
];

export default function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="relative scroll-mt-20 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950"
      aria-labelledby="why-us-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400/90">Why us</p>
          <h2 id="why-us-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why {siteConfig.siteName}?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            <strong className="font-semibold text-zinc-200">Big ticketing apps excel at checkout</strong> when you already know
            the show. We’re optimized for something different:{' '}
            <strong className="font-semibold text-zinc-200">exploring Richmond with context</strong> — neighborhoods, culture,
            and plans that match how people actually go out here.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:gap-5">
          {edges.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-amber-500/25 hover:bg-white/[0.06]"
            >
              <h3 className="font-display text-base font-bold text-amber-100 sm:text-lg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-black/30 px-5 py-5 text-center sm:px-8">
          <p className="text-sm font-semibold text-zinc-200">We’re honest about the handoff</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            You’ll still open organizers’ pages for tickets, refunds, and last-minute changes — we’re the{' '}
            <strong className="text-zinc-300">discovery and cultural layer</strong> on top, not a replacement box office.
            Alongside whatever app you use to buy tickets, the goal is simple:{' '}
            <strong className="text-zinc-300">make Richmond easier to love night by night.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

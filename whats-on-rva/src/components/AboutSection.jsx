import { siteConfig } from '../config/siteConfig.js';

/** Optional background — not required to use the site. */
export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8" aria-label="About What’s On RVA">
      <details className="group rounded-2xl border border-rva-slate/10 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-5 py-4 font-display text-base font-bold text-rva-slate marker:content-none [&::-webkit-details-marker]:hidden sm:text-lg">
          <span className="flex items-center justify-between gap-2">
            Where listings come from
            <span className="text-rva-river transition-transform group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="space-y-4 border-t border-rva-slate/10 px-5 py-5 text-sm leading-relaxed text-rva-slate/75">
          <p>
            {siteConfig.siteName} is styled like a modern discovery product: search, filters, tabs,
            and an interactive map. Listings are limited to <strong>Richmond city limits</strong>{' '}
            (we drop obvious out-of-city venues such as Petersburg when we can tell from location
            data). We are not the organizer — each event links out for tickets and updates.
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong className="text-rva-slate">CultureWorks</strong> — Richmond CultureWorks
              calendar JSON when the feed is available.
            </li>
            <li>
              <strong className="text-rva-slate">Eventbrite</strong> — optional search near Richmond
              when you configure an API token (dev proxy) or your own production proxy URL.
            </li>
            <li>
              <strong className="text-rva-slate">Accounts</strong> — optional sign-in stores data in
              your browser only until you wire a real backend.
            </li>
          </ul>
          <p className="text-xs text-rva-slate/55">
            Always confirm date, time, price, and location on the organizer&apos;s page before you head
            out.
          </p>
        </div>
      </details>
    </section>
  );
}

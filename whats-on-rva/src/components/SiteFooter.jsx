import { siteConfig } from '../config/siteConfig.js';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const linkClass =
    'text-rva-river underline decoration-rva-slate/20 underline-offset-2 hover:decoration-rva-river';

  return (
    <footer className="border-t border-rva-slate/10 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-rva-slate/70"
          aria-label="Footer"
        >
          <a href="#contact" className={linkClass}>
            Contact
          </a>
          <a href="#privacy" className={linkClass}>
            Privacy
          </a>
          <a href="#terms" className={linkClass}>
            Terms
          </a>
        </nav>

        <p className="mt-8 text-sm leading-relaxed text-rva-slate/70">
          <strong className="font-semibold text-rva-slate">{siteConfig.siteName}</strong> is operated
          by <strong className="font-semibold text-rva-slate">{siteConfig.legalEntity}</strong>. We are
          an independent guide to arts and culture listings — we don&apos;t sell tickets or control
          event details. Every &quot;Get tickets / details&quot; link goes to the organizer or venue.
          Confirm date, time, price, and accessibility there before you attend.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-rva-slate/50">
          Listings come from public sources and may be incomplete or out of date. Map pins are
          approximate when shown.
        </p>
        <p className="mt-6 text-xs text-rva-slate/45">
          © {year} {siteConfig.legalEntity} · Map data ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline decoration-rva-slate/30 underline-offset-2 hover:text-rva-slate"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{' '}
          contributors
        </p>
      </div>
    </footer>
  );
}

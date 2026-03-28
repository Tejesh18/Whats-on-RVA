import { siteConfig } from '../config/siteConfig.js';

const link = 'text-xs font-semibold text-rva-slate/55 hover:text-rva-river sm:text-sm';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-rva-slate/10 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-rva-slate/45">
              Richmond, Virginia
            </p>
            <a href="#" className="block">
              <h1 className="font-display text-2xl font-bold tracking-tight text-rva-slate sm:text-3xl">
                {siteConfig.siteName}
              </h1>
            </a>
            <p className="mt-0.5 text-sm text-rva-slate/65">
              Find arts &amp; culture events — search, filters, and map
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rva-slate/10 pt-3 sm:border-0 sm:pt-0"
            aria-label="Site"
          >
            <a href="#contact" className={link}>
              Contact
            </a>
            <a href="#privacy" className={link}>
              Privacy
            </a>
            <a href="#terms" className={link}>
              Terms
            </a>
            <span className="hidden text-rva-slate/25 sm:inline" aria-hidden>
              |
            </span>
            <span className="text-xs text-rva-slate/45">No account needed</span>
          </nav>
        </div>
      </div>
    </header>
  );
}

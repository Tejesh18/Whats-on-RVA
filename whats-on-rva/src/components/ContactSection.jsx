import { siteConfig } from '../config/siteConfig.js';

export default function ContactSection() {
  const mail = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    `Question about ${siteConfig.siteName}`
  )}`;

  return (
    <section
      id="contact"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-4 pt-8 sm:px-6 lg:px-8"
      aria-labelledby="contact-heading"
    >
      <div className="rounded-2xl border border-rva-slate/10 bg-white px-6 py-8 shadow-sm sm:px-8">
        <h2
          id="contact-heading"
          className="font-display text-xl font-bold text-rva-slate sm:text-2xl"
        >
          Contact
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-rva-slate/70">
          Sample contact only — swap in a real address when you launch.
        </p>
        <a
          href={mail}
          className="mt-4 inline-flex rounded-lg bg-rva-river px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rva-slate"
        >
          {siteConfig.contactEmail}
        </a>
        <p className="mt-3 text-xs text-rva-slate/50">
          Operated by {siteConfig.legalEntity}
        </p>
      </div>
    </section>
  );
}

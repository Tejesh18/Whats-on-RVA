import { siteConfig } from '../config/siteConfig.js';

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-rva-slate">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-rva-slate/80">{children}</div>
    </section>
  );
}

export default function LegalLayout({ title, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-rva-cream">
      <header className="border-b border-rva-slate/10 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="#"
            className="font-display text-lg font-bold text-rva-river hover:underline"
          >
            ← {siteConfig.siteName}
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-rva-slate">{title}</h1>
        <div className="mt-6 space-y-10">{children}</div>
      </main>
      <footer className="mt-auto border-t border-rva-slate/10 bg-white py-6 text-center text-xs text-rva-slate/55">
        <a href="#" className="font-semibold text-rva-river hover:underline">
          Home
        </a>
        <span className="mx-2 text-rva-slate/30" aria-hidden>
          ·
        </span>
        <a href="#privacy" className="hover:text-rva-slate">
          Privacy
        </a>
        <span className="mx-2 text-rva-slate/30" aria-hidden>
          ·
        </span>
        <a href="#terms" className="hover:text-rva-slate">
          Terms
        </a>
        <span className="mx-2 text-rva-slate/30" aria-hidden>
          ·
        </span>
        <a href="#contact" className="hover:text-rva-slate">
          Contact
        </a>
      </footer>
    </div>
  );
}

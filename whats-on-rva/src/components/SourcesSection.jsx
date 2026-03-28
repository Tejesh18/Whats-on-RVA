import { publicEventSources } from '../config/publicSources.js';

/**
 * Public aggregation strategy — URLs and notes come from config/publicSources.js.
 */
export default function SourcesSection() {
  return (
    <section
      id="built-from-public-sources"
      className="scroll-mt-20"
      aria-labelledby="sources-heading"
    >
      <h2
        id="sources-heading"
        className="font-display text-2xl font-bold text-rva-slate sm:text-3xl"
      >
        Built from existing public sources
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-rva-slate/70">
        The MVP aggregates what venues and networks already publish — no parallel CMS required.
      </p>
      <ul className="mt-8 grid gap-5 lg:grid-cols-3">
        {publicEventSources.map((s) => (
          <li
            key={s.name}
            className="flex flex-col rounded-2xl border border-rva-slate/10 bg-white p-6 shadow-sm"
          >
            <h3 className="font-display text-lg font-bold text-rva-slate">{s.name}</h3>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 break-all text-sm font-medium text-rva-river underline-offset-2 hover:underline"
            >
              {s.url}
            </a>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-rva-slate/70">{s.notes}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const bullets = [
  'Uses existing public event sources.',
  'Can start with one primary source and expand.',
  'Could support arts organizations, media partners, or City-facing discovery efforts.',
  'Low operational burden compared with building a new events platform.',
];

export default function PilotFooter() {
  return (
    <footer
      className="mt-20 border-t border-rva-slate/10 bg-white"
      aria-labelledby="pilot-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2
          id="pilot-heading"
          className="font-display text-xl font-bold text-rva-slate sm:text-2xl"
        >
          Why this could realistically be piloted
        </h2>
        <ul className="mt-6 list-inside list-disc space-y-2 text-sm leading-relaxed text-rva-slate/80 sm:list-outside sm:pl-4">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="mt-8 border-t border-rva-slate/10 pt-8 text-center text-xs text-rva-slate/50">
          What&apos;s On RVA — Hack for RVA 2026 · Pilot-ready discovery layer; verify times and tickets at
          the source before attending.
        </p>
      </div>
    </footer>
  );
}

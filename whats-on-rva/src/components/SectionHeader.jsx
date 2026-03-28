/**
 * Section title + optional subtitle for Featured / Hidden Gems / All events.
 */
export default function SectionHeader({ id, title, subtitle, badge }) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h2
            id={id}
            className="font-display text-2xl font-bold text-rva-slate sm:text-3xl"
          >
            {title}
          </h2>
          {badge ? (
            <span className="rounded-full bg-rva-river/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-rva-river">
              {badge}
            </span>
          ) : null}
        </div>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-rva-slate/70">{subtitle}</p> : null}
      </div>
    </div>
  );
}

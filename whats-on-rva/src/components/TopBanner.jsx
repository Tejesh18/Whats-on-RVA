/**
 * Hackathon context — readable in the first few seconds for judges.
 */
export default function TopBanner() {
  return (
    <div className="border-b border-rva-slate/10 bg-rva-slate text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2.5 text-center text-xs font-medium sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:text-left">
        <span>Hack for RVA 2026</span>
        <span className="hidden text-white/40 sm:inline" aria-hidden>
          |
        </span>
        <span>Pillar: A City That Tells Its Stories</span>
        <span className="hidden text-white/40 sm:inline" aria-hidden>
          |
        </span>
        <span>Problem: Arts &amp; Cultural Event Discovery</span>
      </div>
    </div>
  );
}

/**
 * Shown when the live calendar feed isn’t available — users still see usable example listings.
 */
export default function DemoDataBadge() {
  return (
    <div className="flex shrink-0 justify-center sm:justify-end">
      <span
        className="inline-flex items-center rounded-md border border-amber-700/20 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-950"
        role="status"
      >
        Example events — live calendar unavailable
      </span>
    </div>
  );
}

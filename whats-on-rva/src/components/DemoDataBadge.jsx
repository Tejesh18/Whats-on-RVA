import { rvaVoice } from '../config/rvaVoice.js';

/**
 * Shown when the live calendar feed isn’t available — users still see usable example listings.
 */
export default function DemoDataBadge() {
  return (
    <div className="flex shrink-0 justify-center sm:justify-end">
      <span
        className="inline-flex items-center rounded-md border border-rva-brick/25 bg-[#faf6e8] px-2 py-0.5 text-[11px] font-semibold text-rva-brick-deep"
        role="status"
      >
        {rvaVoice.demoBadge}
      </span>
    </div>
  );
}

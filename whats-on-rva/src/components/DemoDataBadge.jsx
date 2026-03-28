/**
 * Small status chip when getEvents() used the mock adapter (CORS, offline, or empty live response).
 */
export default function DemoDataBadge() {
  return (
    <div className="flex shrink-0 justify-center sm:justify-end">
      <span
        className="inline-flex items-center rounded-md border border-amber-700/25 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-950"
        role="status"
      >
        Demo currently using sample data
      </span>
    </div>
  );
}

import EventCard from './EventCard.jsx';

/** `events` are NormalizedEvent[] from getEvents(); no raw API types here. */
export default function EventGrid({ events, emptyMessage }) {
  if (!events.length) {
    return (
      <p className="rounded-xl border border-dashed border-rva-slate/20 bg-white/60 px-6 py-12 text-center text-rva-slate/60">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}

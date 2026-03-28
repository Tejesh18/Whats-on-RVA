import EventCard from './EventCard.jsx';

export default function EventGrid({
  events,
  emptyMessage,
  selectedId,
  onSelectEvent,
}) {
  if (!events.length) {
    return (
      <p className="rounded-xl border border-dashed border-rva-slate/20 bg-white/80 px-6 py-10 text-center text-sm text-rva-slate/55">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id}>
          <EventCard
            event={event}
            selected={selectedId === event.id}
            onActivate={onSelectEvent}
          />
        </li>
      ))}
    </ul>
  );
}

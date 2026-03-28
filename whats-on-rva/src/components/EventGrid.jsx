import EventCard from './EventCard.jsx';
import { storySlugForEventNeighborhood } from '../data/neighborhoodStories.js';

function EventGridSkeleton() {
  return (
    <ul className="flex flex-col gap-4" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <li
          key={i}
          className="h-48 animate-pulse rounded-2xl bg-gradient-to-r from-zinc-200/80 via-zinc-100/90 to-zinc-200/80 sm:h-52"
        />
      ))}
    </ul>
  );
}

export default function EventGrid({
  events,
  emptyMessage,
  selectedId,
  onSelectEvent,
  loading,
  favoriteIds,
  onToggleFavorite,
  onOpenStory,
}) {
  if (loading) {
    return <EventGridSkeleton />;
  }

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
            saved={favoriteIds?.has(event.id)}
            onToggleSave={onToggleFavorite}
            relatedStorySlug={storySlugForEventNeighborhood(event.neighborhood)}
            onOpenStory={onOpenStory}
          />
        </li>
      ))}
    </ul>
  );
}

import { lazy, Suspense } from 'react';
import NeighborhoodSpotlight from './NeighborhoodSpotlight.jsx';
import NeighborhoodVibeStrip from './NeighborhoodVibeStrip.jsx';

const StoryExploreMap = lazy(() => import('./StoryExploreMap.jsx'));

function MapFallback() {
  return (
    <div className="flex h-[min(380px,55vh)] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-500">
      Loading Richmond story map…
    </div>
  );
}

export default function StoriesTabContent({
  neighborhoods,
  filters,
  onFiltersChange,
  onOpenStory,
  favoriteNeighborhoods,
  onToggleFavoriteNeighborhood,
  onSwitchToEventsTab,
}) {
  return (
    <div className="space-y-10">
      <NeighborhoodSpotlight
        neighborhoods={neighborhoods}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onOpenStory={onOpenStory}
        favoriteNeighborhoods={favoriteNeighborhoods}
        onToggleFavoriteNeighborhood={onToggleFavoriteNeighborhood}
        onAfterShowEvents={() => onSwitchToEventsTab?.()}
      />
      <section>
        <h2 className="font-display text-lg font-bold text-rva-slate">Richmond story map</h2>
        <p className="mt-1 text-sm text-rva-slate/75">
          Pan and zoom the city — pins unlock neighborhood essays, timelines, and the history layered under today&apos;s
          venues.
        </p>
        <div className="mt-4">
          <Suspense fallback={<MapFallback />}>
            <StoryExploreMap onOpenStory={onOpenStory} />
          </Suspense>
        </div>
      </section>
      <NeighborhoodVibeStrip onOpenStory={onOpenStory} />
    </div>
  );
}

import ForYouSection from './ForYouSection.jsx';
import WalkingTourChooser from './WalkingTourChooser.jsx';
import WalkingTourPanel from './WalkingTourPanel.jsx';
import CulturalTrailsPanel from './CulturalTrailsPanel.jsx';

export default function PlanTabContent({
  discoverySorted,
  favoriteNeighborhoods,
  onSelectEvent,
  walkingTourSlug,
  onWalkingTourChange,
  onOpenStory,
  onOpenPlanMyNight,
  onOpenAssistant,
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
        <h2 className="font-display text-xl font-bold text-zinc-900">Planning assistant</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Ask in natural language — like ChatGPT, it answers with full sentences and numbered picks from your loaded
          calendar. Everything runs in your browser unless you configure a server URL.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-700"
          >
            Open chat assistant
          </button>
          <button
            type="button"
            onClick={onOpenPlanMyNight}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-800 hover:border-amber-300"
          >
            Plan my night (form)
          </button>
        </div>
      </section>

      <ForYouSection
        events={discoverySorted}
        favoriteNeighborhoods={favoriteNeighborhoods}
        onSelectEvent={onSelectEvent}
      />

      <div>
        <WalkingTourChooser value={walkingTourSlug} onChange={onWalkingTourChange} />
        <WalkingTourPanel activeSlug={walkingTourSlug} onClear={() => onWalkingTourChange(null)} />
      </div>

      <CulturalTrailsPanel events={discoverySorted} onSelectEvent={onSelectEvent} onOpenStory={onOpenStory} />
    </div>
  );
}

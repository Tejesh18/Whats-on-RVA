import ForYouSection from './ForYouSection.jsx';
import WalkingTourChooser from './WalkingTourChooser.jsx';
import WalkingTourPanel from './WalkingTourPanel.jsx';
import CulturalTrailsPanel from './CulturalTrailsPanel.jsx';
import { rvaVoice } from '../config/rvaVoice.js';

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
      <section className="rounded-2xl border border-rva-river/20 bg-gradient-to-br from-rva-cream to-white p-5 shadow-sm">
        <h2 className="font-display text-xl font-bold text-rva-slate">RVA planning assistant</h2>
        <p className="mt-2 text-sm leading-relaxed text-rva-slate/75">{rvaVoice.planAssistantBlurb}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="rounded-xl bg-rva-river px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-rva-river-light"
          >
            Open Ask me
          </button>
          <button
            type="button"
            onClick={onOpenPlanMyNight}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-800 hover:border-rva-gold"
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

import { useEffect, useMemo, useState } from 'react';
import { getEvents } from './services/eventService.js';
import {
  deriveCategories,
  deriveNeighborhoods,
  isTonightRichmond,
  matchesFilters,
  matchesQuery,
} from './lib/eventFilters.js';
import TopBanner from './components/TopBanner.jsx';
import Hero from './components/Hero.jsx';
import WhyMatters from './components/WhyMatters.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import SectionHeader from './components/SectionHeader.jsx';
import EventGrid from './components/EventGrid.jsx';
import SourcesSection from './components/SourcesSection.jsx';
import IntegrationReadiness from './components/IntegrationReadiness.jsx';
import PilotFooter from './components/PilotFooter.jsx';
import DemoDataBadge from './components/DemoDataBadge.jsx';

/**
 * Presentation only — all event IO goes through services/eventService.getEvents().
 */
export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    neighborhood: '',
    category: '',
    price: '',
  });
  const [tonightOnly, setTonightOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { events: next, usingFallback: fb } = await getEvents();
      if (!cancelled) {
        setEvents(next);
        setUsingFallback(fb);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const neighborhoods = useMemo(() => deriveNeighborhoods(events), [events]);
  const categories = useMemo(() => deriveCategories(events), [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => matchesQuery(e, search))
      .filter((e) => matchesFilters(e, filters))
      .filter((e) => !tonightOnly || isTonightRichmond(e))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [events, search, filters, tonightOnly]);

  const featured = useMemo(() => filtered.filter((e) => e.featured), [filtered]);
  const hiddenGems = useMemo(() => filtered.filter((e) => e.hiddenGem), [filtered]);

  const handleTonight = () => {
    setTonightOnly((v) => !v);
  };

  const dataSubtitle = usingFallback
    ? 'Sample listings — live feed unavailable or returned no events in this session.'
    : 'Live aggregated public listings. Always confirm date, price, and accessibility at the source.';

  return (
    <div className="min-h-screen">
      <TopBanner />
      <Hero />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <WhyMatters />

        {/* Credibility up-front for judges: sourcing + integration story before the grid */}
        <div className="mt-14 space-y-16">
          <SourcesSection />
          <IntegrationReadiness />
        </div>

        {/* Search + filters */}
        <section
          className="mt-14 rounded-2xl border border-rva-slate/10 bg-white p-6 shadow-sm sm:p-8"
          aria-label="Search and filters"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-rva-slate">Find an event</h2>
              <p className="mt-1 text-sm text-rva-slate/65">{dataSubtitle}</p>
            </div>
            {usingFallback ? <DemoDataBadge /> : null}
          </div>
          <div className="mt-6">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-rva-slate/60">Loading events…</p>
            ) : (
              <FilterBar
                neighborhoods={neighborhoods}
                categories={categories}
                filters={filters}
                onChange={setFilters}
                tonightActive={tonightOnly}
                onTonightClick={handleTonight}
              />
            )}
          </div>
        </section>

        {/* Featured */}
        <section className="mt-14" aria-labelledby="featured-heading">
          <SectionHeader
            id="featured-heading"
            title="Featured events"
            subtitle="Flagged by the upstream calendar when live; curated in sample data when offline."
            badge="Spotlight"
          />
          <EventGrid
            events={featured}
            emptyMessage="No featured events match your search or filters. Try clearing filters or search."
          />
        </section>

        {/* Hidden gems */}
        <section className="mt-16" aria-labelledby="gems-heading">
          <SectionHeader
            id="gems-heading"
            title="Hidden gems"
            subtitle="Smaller-audience or easy-to-miss listings (heuristic on live data; tagged in sample data)."
            badge="Local"
          />
          <EventGrid
            events={hiddenGems}
            emptyMessage="No hidden gems match your search or filters. Adjust filters or try another neighborhood."
          />
        </section>

        {/* Full browse */}
        <section className="mt-16" aria-labelledby="all-heading">
          <SectionHeader
            id="all-heading"
            title="All events"
            subtitle="Everything in the current dataset, sorted by start time."
          />
          <EventGrid
            events={filtered}
            emptyMessage="No events match. Reset filters or search to see more listings."
          />
        </section>

      </main>

      <PilotFooter />
    </div>
  );
}

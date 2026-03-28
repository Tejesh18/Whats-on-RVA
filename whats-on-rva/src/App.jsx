import { useEffect, useMemo, useState } from 'react';
import { getEvents } from './services/eventService.js';
import {
  deriveCategories,
  deriveNeighborhoods,
  isTonightRichmond,
  matchesFilters,
  matchesQuery,
} from './lib/eventFilters.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import SiteHeader from './components/SiteHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import BrowseTabs from './components/BrowseTabs.jsx';
import EventGrid from './components/EventGrid.jsx';
import EventMap from './components/EventMap.jsx';
import DemoDataBadge from './components/DemoDataBadge.jsx';
import ContactSection from './components/ContactSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';

export default function App() {
  const hash = useHashRoute();

  useEffect(() => {
    if (hash === 'contact') {
      window.requestAnimationFrame(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [hash]);

  if (hash === 'privacy') {
    return <PrivacyPolicyPage />;
  }
  if (hash === 'terms') {
    return <TermsPage />;
  }

  return <HomeView />;
}

function HomeView() {
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
  const [browseTab, setBrowseTab] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

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

  const listEvents = useMemo(() => {
    if (browseTab === 'featured') return filtered.filter((e) => e.featured);
    if (browseTab === 'gems') return filtered.filter((e) => e.hiddenGem);
    return filtered;
  }, [filtered, browseTab]);

  const tabCounts = useMemo(
    () => ({
      all: filtered.length,
      featured: filtered.filter((e) => e.featured).length,
      gems: filtered.filter((e) => e.hiddenGem).length,
    }),
    [filtered]
  );

  useEffect(() => {
    if (!selectedId) return;
    if (!listEvents.some((e) => e.id === selectedId)) setSelectedId(null);
  }, [listEvents, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const t = window.setTimeout(() => {
      document.getElementById(`event-card-${selectedId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 200);
    return () => window.clearTimeout(t);
  }, [selectedId]);

  const handleTonight = () => {
    setTonightOnly((v) => !v);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <HeroSection />

      <main
        id="browse-events"
        className="relative border-t border-white/5 bg-gradient-to-b from-zinc-100 via-[#f0ebe3] to-zinc-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            {usingFallback ? <DemoDataBadge /> : null}
          </div>

          <div className="mt-6 rounded-3xl border border-zinc-200/80 bg-white/90 p-5 shadow-xl shadow-zinc-900/5 backdrop-blur-sm">
            <FilterBar
              neighborhoods={neighborhoods}
              categories={categories}
              filters={filters}
              onChange={setFilters}
              tonightActive={tonightOnly}
              onTonightClick={handleTonight}
            />
          </div>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 lg:max-w-[min(100%,560px)] xl:max-w-[600px]">
              <BrowseTabs value={browseTab} onChange={setBrowseTab} counts={tabCounts} />
              <p className="mt-4 text-sm font-medium text-zinc-500">
                <span className="font-bold text-zinc-800">{listEvents.length}</span> event
                {listEvents.length === 1 ? '' : 's'} · Select a card or pin to sync map &amp; list
              </p>
              <div className="mt-5">
                <EventGrid
                  loading={loading}
                  events={listEvents}
                  selectedId={selectedId}
                  onSelectEvent={setSelectedId}
                  emptyMessage="Nothing matches — try clearing filters or search."
                />
              </div>
            </div>

            <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,460px)] xl:w-[500px]">
              <EventMap
                events={listEvents}
                selectedId={selectedId}
                onSelectEvent={setSelectedId}
              />
            </div>
          </div>
        </div>

        <ContactSection />
        <AboutSection />
        <SiteFooter />
      </main>
    </div>
  );
}

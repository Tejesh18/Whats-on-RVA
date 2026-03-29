import { lazy, Suspense, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { getEvents } from './services/eventService.js';
import {
  deriveCategories,
  deriveNeighborhoods,
  isTonightRichmond,
  matchesFilters,
  matchesQuery,
  matchesDatePreset,
  matchesAccessibilityKeys,
  isThisWeekendRichmond,
  isSmallVenueSupporting,
} from './lib/eventFilters.js';
import { haversineKm } from './lib/geo.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { getStory, NEIGHBORHOOD_SPOTLIGHTS } from './data/neighborhoodStories.js';
import {
  getFavoriteEventIds,
  toggleFavoriteEvent,
  getFavoriteNeighborhoods,
  toggleFavoriteNeighborhood,
} from './lib/favoritesStorage.js';
import { ARTS_DISTRICT_POLYGONS } from './data/mapLayers.js';
import { inferSupportBadges } from './lib/eventSupportBadges.js';
import { matchesAnyMapContentFilter } from './lib/mapContentFilters.js';
import {
  buildForYouEventList,
  suggestNeighborhoodsToExplore,
  suggestStories,
  forYouInsightLine,
} from './lib/forYouEngine.js';
import {
  getSavedCategories,
  toggleSavedCategory,
  getPricePreference,
  setPricePreference,
  recordStoryView,
  getViewedStorySlugsOrdered,
} from './lib/personalizationStorage.js';

import SiteHeader from './components/SiteHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import WhyUsSection from './components/WhyUsSection.jsx';
import SearchBar from './components/SearchBar.jsx';
import BrowseTabs from './components/BrowseTabs.jsx';
import EventGrid from './components/EventGrid.jsx';
import DeferredEventMap from './components/DeferredEventMap.jsx';
import DemoDataBadge from './components/DemoDataBadge.jsx';
import ContactSection from './components/ContactSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import ApiStatusBanner from './components/ApiStatusBanner.jsx';
import FeaturedEventsStrip from './components/FeaturedEventsStrip.jsx';
import HiddenGemsStrip from './components/HiddenGemsStrip.jsx';
import PlanningChatAssistant from './components/PlanningChatAssistant.jsx';
import DiscoveryPanel from './components/DiscoveryPanel.jsx';
import SourcesTrustSection from './components/SourcesTrustSection.jsx';
import ReadyToIntegrateSection from './components/ReadyToIntegrateSection.jsx';
import StoryDetailModal from './components/StoryDetailModal.jsx';
import PlanMyNightModal from './components/PlanMyNightModal.jsx';
import HomeSectionTabs from './components/HomeSectionTabs.jsx';
import { rvaVoice } from './config/rvaVoice.js';

const StoriesTabContent = lazy(() => import('./components/StoriesTabContent.jsx'));
const PlanTabContent = lazy(() => import('./components/PlanTabContent.jsx'));

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

  return <HomeView hash={hash} />;
}

function HomeView({ hash }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const searchPending = search !== deferredSearch;
  const [filters, setFilters] = useState({
    neighborhood: '',
    category: '',
    price: '',
  });
  const [datePreset, setDatePreset] = useState('any');
  const [accessibilityKeys, setAccessibilityKeys] = useState(() => new Set());

  const [tonightActive, setTonightActive] = useState(false);
  const [weekendActive, setWeekendActive] = useState(false);
  const [nearTonightActive, setNearTonightActive] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');
  const [smallVenuesActive, setSmallVenuesActive] = useState(false);
  const [prioritizeCommunity, setPrioritizeCommunity] = useState(false);
  const [mapContentFilters, setMapContentFilters] = useState(() => new Set());
  const [showMapTransit, setShowMapTransit] = useState(false);
  const [planNightOpen, setPlanNightOpen] = useState(false);
  const [personalizeTick, setPersonalizeTick] = useState(0);
  const [pricePreference, setPricePreferenceState] = useState(() => getPricePreference());
  const [homeSection, setHomeSection] = useState('events');
  const [assistantOpen, setAssistantOpen] = useState(false);

  const [browseTab, setBrowseTab] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const [favEvents, setFavEvents] = useState(() => getFavoriteEventIds());
  const [favNeighborhoods, setFavNeighborhoods] = useState(() => getFavoriteNeighborhoods());

  const [walkingTourSlug, setWalkingTourSlug] = useState(null);

  const storyModalSlug = hash.startsWith('story/') ? hash.slice(6) : null;

  useEffect(() => {
    if (!storyModalSlug) return;
    recordStoryView(storyModalSlug);
    setPersonalizeTick((t) => t + 1);
  }, [storyModalSlug]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { events: next, usingFallback: fb, loadError: err } = await getEvents();
    setEvents(next);
    setUsingFallback(fb);
    setLoadError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const neighborhoods = useMemo(() => {
    const base = deriveNeighborhoods(events);
    const spotlightLabels = NEIGHBORHOOD_SPOTLIGHTS.map((s) => s.label);
    return [...new Set([...base, ...spotlightLabels])].sort((a, b) => a.localeCompare(b));
  }, [events]);
  const categories = useMemo(() => deriveCategories(events), [events]);

  const toggleAccessibility = useCallback((id) => {
    setAccessibilityKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const requestNearGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation not available in this browser.');
      return;
    }
    setGeoStatus('Locating…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('');
      },
      () => {
        setGeoStatus('Location denied — showing all “tonight” listings without distance filter.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  const discoveryFiltered = useMemo(() => {
    let list = events
      .filter((e) => matchesQuery(e, deferredSearch))
      .filter((e) => matchesFilters(e, filters))
      .filter((e) => matchesDatePreset(e, datePreset))
      .filter((e) => matchesAccessibilityKeys(e, accessibilityKeys));

    if (tonightActive) list = list.filter((e) => isTonightRichmond(e));
    if (weekendActive) list = list.filter((e) => isThisWeekendRichmond(e));
    if (smallVenuesActive) list = list.filter((e) => isSmallVenueSupporting(e));

    if (nearTonightActive) {
      list = list.filter((e) => isTonightRichmond(e));
      if (userCoords) {
        list = list.filter((e) => {
          if (typeof e.latitude !== 'number' || typeof e.longitude !== 'number') return false;
          return haversineKm(userCoords.lat, userCoords.lng, e.latitude, e.longitude) <= 6;
        });
      }
    }

    return list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [
    events,
    deferredSearch,
    filters,
    datePreset,
    accessibilityKeys,
    tonightActive,
    weekendActive,
    nearTonightActive,
    smallVenuesActive,
    userCoords,
  ]);

  const discoverySorted = useMemo(() => {
    const list = [...discoveryFiltered];
    if (prioritizeCommunity) {
      list.sort((a, b) => {
        const score = (e) =>
          inferSupportBadges(e).some((x) => ['org', 'wo', 'bo', 'small'].includes(x.id)) ? 1 : 0;
        return score(b) - score(a) || new Date(a.startTime) - new Date(b.startTime);
      });
    }
    return list;
  }, [discoveryFiltered, prioritizeCommunity]);

  const forYouCtx = useMemo(
    () => ({
      favNH: favNeighborhoods,
      savedCategories: getSavedCategories(),
      viewedSlugs: getViewedStorySlugsOrdered(),
      pricePref: getPricePreference(),
    }),
    [favNeighborhoods, personalizeTick]
  );

  const forYouPersonalized = useMemo(
    () => buildForYouEventList(discoverySorted, forYouCtx),
    [discoverySorted, forYouCtx]
  );

  const listEvents = useMemo(() => {
    if (browseTab === 'featured') return discoverySorted.filter((e) => e.featured);
    if (browseTab === 'gems') return discoverySorted.filter((e) => e.hiddenGem);
    if (browseTab === 'foryou') {
      if (forYouPersonalized.length) return forYouPersonalized;
      return discoverySorted.slice(0, 20);
    }
    return discoverySorted;
  }, [discoverySorted, browseTab, forYouPersonalized]);

  const forYouUsingFallback = browseTab === 'foryou' && forYouPersonalized.length === 0 && discoverySorted.length > 0;

  const tabCounts = useMemo(() => {
    let featured = 0;
    let gems = 0;
    const all = discoverySorted.length;
    for (const e of discoverySorted) {
      if (e.featured) featured += 1;
      if (e.hiddenGem) gems += 1;
    }
    const fyCount = forYouPersonalized.length || Math.min(20, all);
    return { all, foryou: fyCount, featured, gems };
  }, [discoverySorted, forYouPersonalized]);

  const mapEvents = useMemo(
    () => listEvents.filter((e) => matchesAnyMapContentFilter(e, mapContentFilters)),
    [listEvents, mapContentFilters]
  );

  const onMapContentFilterToggle = useCallback((key) => {
    setMapContentFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const suggestedNeighborhoods = useMemo(
    () => suggestNeighborhoodsToExplore(favNeighborhoods, neighborhoods),
    [favNeighborhoods, neighborhoods]
  );
  const suggestedStorySlugs = useMemo(() => suggestStories(forYouCtx.viewedSlugs), [forYouCtx.viewedSlugs]);

  const savedCategoriesSet = useMemo(() => getSavedCategories(), [personalizeTick]);

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

  const handleSurpriseMe = () => {
    const pool = discoveryFiltered.length ? discoveryFiltered : events;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedId(pick.id);
    setBrowseTab('all');
  };

  const openStory = useCallback((slug) => {
    window.location.hash = `story/${slug}`;
  }, []);

  const closeStory = useCallback(() => {
    window.location.hash = '';
  }, []);

  const toggleFavEvent = useCallback((id) => {
    const s = toggleFavoriteEvent(id);
    setFavEvents(s);
  }, []);

  const toggleFavNH = useCallback((label) => {
    toggleFavoriteNeighborhood(label);
    setFavNeighborhoods(getFavoriteNeighborhoods());
    setPersonalizeTick((t) => t + 1);
  }, []);

  const handleToggleSavedCategory = (name) => {
    toggleSavedCategory(name);
    setPersonalizeTick((t) => t + 1);
  };

  const handlePricePreferenceChange = (p) => {
    setPricePreference(p);
    setPricePreferenceState(getPricePreference());
    setPersonalizeTick((t) => t + 1);
  };

  const focusEvent = useCallback((id) => {
    setSelectedId(id);
    setHomeSection('events');
  }, []);

  const sectionFallback = (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-500">
      Loading…
    </div>
  );

  return (
    <div className="min-h-screen bg-rva-slate">
      <SiteHeader />
      <HeroSection />

      <main
        id="browse-events"
        className="relative border-t border-rva-brick/15 bg-rva-main-fade"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ApiStatusBanner
            loadError={loadError}
            usingFallback={usingFallback}
            loading={loading}
            onRetry={loadData}
          />

          <p className="mt-2 text-center text-sm text-rva-slate/75 lg:text-left">
            <strong className="font-semibold text-rva-river">Events</strong> for listings &amp; Richmond map ·{' '}
            <strong className="font-semibold text-rva-river">RVA stories</strong> for place-based guides &amp; the story map ·{' '}
            <strong className="font-semibold text-rva-river">Plan your night</strong> for the assistant, trails, and For you.
          </p>

          <HomeSectionTabs value={homeSection} onChange={setHomeSection} />

          {homeSection === 'events' ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <SearchBar value={search} onChange={setSearch} pending={searchPending} />
                </div>
                {usingFallback ? <DemoDataBadge /> : null}
              </div>

              <FeaturedEventsStrip events={discoverySorted} onSelectEvent={setSelectedId} />
              <HiddenGemsStrip events={discoverySorted} onSelectEvent={setSelectedId} />

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <DiscoveryPanel
                  neighborhoods={neighborhoods}
                  categories={categories}
                  filters={filters}
                  onFiltersChange={setFilters}
                  datePreset={datePreset}
                  onDatePresetChange={setDatePreset}
                  accessibilityKeys={accessibilityKeys}
                  onAccessibilityToggle={toggleAccessibility}
                  tonightActive={tonightActive}
                  onTonightToggle={() => setTonightActive((v) => !v)}
                  weekendActive={weekendActive}
                  onWeekendToggle={() => setWeekendActive((v) => !v)}
                  nearTonightActive={nearTonightActive}
                  onNearTonightToggle={() => setNearTonightActive((v) => !v)}
                  onNearTonightRequestGeo={requestNearGeo}
                  onRequestTravelEtaGeo={requestNearGeo}
                  smallVenuesActive={smallVenuesActive}
                  onSmallVenuesToggle={() => setSmallVenuesActive((v) => !v)}
                  prioritizeCommunityActive={prioritizeCommunity}
                  onPrioritizeCommunityToggle={() => setPrioritizeCommunity((v) => !v)}
                  savedCategories={savedCategoriesSet}
                  onToggleSavedCategory={handleToggleSavedCategory}
                  pricePreference={pricePreference}
                  onPricePreferenceChange={handlePricePreferenceChange}
                  onOpenPlanMyNight={() => {
                    setPlanNightOpen(true);
                    setHomeSection('plan');
                  }}
                  onSurpriseMe={handleSurpriseMe}
                  geoStatus={geoStatus}
                />
              </div>

              <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
                <div className="min-w-0 flex-1 lg:max-w-[min(100%,560px)] xl:max-w-[600px]">
                  <BrowseTabs value={browseTab} onChange={setBrowseTab} counts={tabCounts} />
                  {browseTab === 'foryou' ? (
                    <div className="mt-4 space-y-3 rounded-2xl border border-rva-gold/35 bg-gradient-to-br from-[#faf6e8]/95 to-white p-4 shadow-sm">
                      <p className="text-sm font-medium text-zinc-800">{forYouInsightLine(forYouCtx, listEvents[0])}</p>
                      <p className="text-xs italic text-zinc-600">
                        Example: Because you liked Jackson Ward jazz events, you may also like a poetry night in Church Hill — we
                        boost listings whose keywords echo stories you&apos;ve opened.
                      </p>
                      {forYouUsingFallback ? (
                        <p className="text-xs font-semibold text-rva-brick-deep">
                          Showing a starter slice of the feed until personalization signals kick in.
                        </p>
                      ) : null}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explore neighborhoods</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestedNeighborhoods.map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setFilters((f) => ({ ...f, neighborhood: n }))}
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700 hover:border-rva-gold"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Suggested stories</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestedStorySlugs.map((s) => {
                            const st = getStory(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => openStory(s)}
                                className="rounded-full bg-rva-river px-3 py-1 text-xs font-bold text-white hover:bg-rva-river-light"
                              >
                                {st?.title || s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <p className="mt-4 text-sm font-medium text-zinc-500">
                    <span className="font-bold text-zinc-800">{listEvents.length}</span> event
                    {listEvents.length === 1 ? '' : 's'} around RVA
                    {browseTab === 'foryou' ? ' · For you' : ''} · favorites saved in this browser
                  </p>
                  <div className="mt-5">
                    <EventGrid
                      loading={loading}
                      events={listEvents}
                      selectedId={selectedId}
                      onSelectEvent={setSelectedId}
                      emptyMessage={
                        browseTab === 'foryou' ? rvaVoice.emptyForYou : rvaVoice.emptyEventsFiltered
                      }
                      favoriteIds={favEvents}
                      onToggleFavorite={toggleFavEvent}
                      onOpenStory={openStory}
                      travelOrigin={userCoords}
                    />
                  </div>
                </div>

                <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,460px)] xl:w-[500px]">
                  <DeferredEventMap
                    events={mapEvents}
                    selectedId={selectedId}
                    onSelectEvent={setSelectedId}
                    storyPoints={[]}
                    historicPolygons={[]}
                    artsPolygons={ARTS_DISTRICT_POLYGONS}
                    mapContentFilters={mapContentFilters}
                    onMapContentFilterToggle={onMapContentFilterToggle}
                    showTransit={showMapTransit}
                    onShowTransitToggle={() => setShowMapTransit((v) => !v)}
                    travelOrigin={userCoords}
                    onUserLocated={(coords) => {
                      setUserCoords(coords);
                      setGeoStatus('');
                    }}
                  />
                </div>
              </div>
            </>
          ) : null}

          {homeSection === 'stories' ? (
            <Suspense fallback={sectionFallback}>
              <StoriesTabContent
                neighborhoods={neighborhoods}
                filters={filters}
                onFiltersChange={setFilters}
                onOpenStory={openStory}
                favoriteNeighborhoods={favNeighborhoods}
                onToggleFavoriteNeighborhood={toggleFavNH}
                onSwitchToEventsTab={() => setHomeSection('events')}
              />
            </Suspense>
          ) : null}

          {homeSection === 'plan' ? (
            <Suspense fallback={sectionFallback}>
              <PlanTabContent
                discoverySorted={discoverySorted}
                favoriteNeighborhoods={favNeighborhoods}
                onSelectEvent={focusEvent}
                walkingTourSlug={walkingTourSlug}
                onWalkingTourChange={setWalkingTourSlug}
                onOpenStory={openStory}
                onOpenPlanMyNight={() => setPlanNightOpen(true)}
                onOpenAssistant={() => setAssistantOpen(true)}
              />
            </Suspense>
          ) : null}
        </div>

        <SourcesTrustSection />
        <ReadyToIntegrateSection />
        <ContactSection />
        <AboutSection />
        <WhyUsSection />
        <SiteFooter />
      </main>

      <PlanningChatAssistant
        events={events}
        onSelectEvent={focusEvent}
        onOpenPlanMyNight={() => {
          setPlanNightOpen(true);
          setHomeSection('plan');
        }}
        isOpen={assistantOpen}
        onOpen={() => setAssistantOpen(true)}
        onClose={() => setAssistantOpen(false)}
      />

      <PlanMyNightModal
        open={planNightOpen}
        onClose={() => setPlanNightOpen(false)}
        events={events}
        neighborhoods={neighborhoods}
        onSelectEvent={setSelectedId}
      />

      {storyModalSlug ? (
        <StoryDetailModal
          slug={storyModalSlug}
          events={events}
          onClose={closeStory}
          onSelectEvent={setSelectedId}
          onOpenTourSlug={(slug) => {
            setWalkingTourSlug(slug);
            closeStory();
            document.getElementById('browse-events')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      ) : null}
    </div>
  );
}

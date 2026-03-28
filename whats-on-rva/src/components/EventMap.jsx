import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { RICHMOND_VA_BOUNDS, isWithinRichmondVaBounds } from '../lib/richmondBounds.js';
import { RICHMOND_TRANSIT_PINS } from '../data/transitPins.js';

const RVA_CENTER = [37.5407, -77.436];

const CITY_RECT = [
  [RICHMOND_VA_BOUNDS.south, RICHMOND_VA_BOUNDS.west],
  [RICHMOND_VA_BOUNDS.north, RICHMOND_VA_BOUNDS.east],
];

const pinEvent = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--event"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 24],
  popupAnchor: [0, -22],
});

const pinEventSelected = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--event rva-map-pin-inner--selected"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 28],
  popupAnchor: [0, -26],
});

const pinStory = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--story"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  popupAnchor: [0, -24],
});

const pinTransit = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--transit"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 20],
  popupAnchor: [0, -18],
});

function eventsWithCoords(events) {
  return events.filter(
    (e) => typeof e.latitude === 'number' && typeof e.longitude === 'number'
  );
}

function MapBounds({ events }) {
  const map = useMap();
  useEffect(() => {
    const pts = eventsWithCoords(events);
    if (pts.length === 0) {
      map.setView(RVA_CENTER, 12);
      return;
    }
    if (pts.length === 1) {
      map.setView([pts[0].latitude, pts[0].longitude], 14);
      return;
    }
    const b = L.latLngBounds(pts.map((e) => [e.latitude, e.longitude]));
    map.fitBounds(b, { padding: [40, 40], maxZoom: 15 });
  }, [events, map]);
  return null;
}

function MapFlyTo({ selectedId, events }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const e = events.find((x) => x.id === selectedId);
    if (e && typeof e.latitude === 'number' && typeof e.longitude === 'number') {
      map.flyTo([e.latitude, e.longitude], 16, { duration: 0.55 });
    }
  }, [selectedId, events, map]);
  return null;
}

function LocateControlLeaflet({ onMessage }) {
  const map = useMap();
  useEffect(() => {
    const Control = L.Control.extend({
      onAdd() {
        const root = L.DomUtil.create('div', 'rva-locate-control leaflet-bar');
        const btn = L.DomUtil.create('button', '', root);
        btn.type = 'button';
        btn.title = 'Center map on your location (Richmond only)';
        btn.textContent = 'Near me';
        btn.style.cssText =
          'padding:6px 10px;font-size:11px;font-weight:700;cursor:pointer;background:#18181b;color:#fff;border:1px solid #3f3f46;border-radius:6px;';

        L.DomEvent.disableClickPropagation(root);
        L.DomEvent.on(btn, 'click', () => {
          if (!navigator.geolocation) {
            onMessage?.('Location not supported');
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              if (isWithinRichmondVaBounds(latitude, longitude)) {
                map.flyTo([latitude, longitude], 14, { duration: 0.6 });
                onMessage?.('');
              } else {
                onMessage?.('Outside Richmond scope');
              }
            },
            () => onMessage?.('Location denied'),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 }
          );
        });

        return root;
      },
    });
    const c = new Control({ position: 'bottomright' });
    c.addTo(map);
    return () => c.remove();
  }, [map, onMessage]);
  return null;
}

/**
 * Blue = events, orange = story anchors, purple polygons = historic districts (illustrative).
 */
const MAP_FILTER_CHIPS = [
  { id: 'music', label: 'Music' },
  { id: 'visual', label: 'Visual art' },
  { id: 'theatre', label: 'Theatre' },
  { id: 'family', label: 'Family' },
  { id: 'free', label: 'Free' },
];

export default function EventMap({
  events,
  selectedId,
  onSelectEvent,
  storyPoints = [],
  historicPolygons = [],
  artsPolygons = [],
  onStoryPinClick,
  mapContentFilters,
  onMapContentFilterToggle,
  showTransit,
  onShowTransitToggle,
}) {
  const pts = eventsWithCoords(events);
  const [locateMsg, setLocateMsg] = useState('');
  const msgTimer = useRef(null);
  const filterSet = mapContentFilters instanceof Set ? mapContentFilters : new Set();

  const onLocateMessage = (m) => {
    if (msgTimer.current) window.clearTimeout(msgTimer.current);
    setLocateMsg(m);
    if (m) {
      msgTimer.current = window.setTimeout(() => setLocateMsg(''), 4000);
    }
  };

  return (
    <div className="flex h-[min(320px,45vh)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-900 shadow-xl shadow-zinc-900/10 ring-1 ring-black/5 sm:h-[min(360px,42vh)] lg:h-[min(74vh,680px)] lg:min-h-[420px]">
      <div className="flex flex-col gap-2 border-b border-zinc-700/50 bg-gradient-to-r from-zinc-950 to-zinc-900 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Cultural district map</span>
            <p className="text-[10px] text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Events
              </span>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500" /> Stories
              </span>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-violet-500" /> Historic
              </span>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-400" /> Arts zones
              </span>
              {' · '}
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Transit
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
              {pts.length} events
            </span>
            {locateMsg ? (
              <span className="max-w-[160px] text-right text-[10px] font-medium text-amber-200/90">
                {locateMsg}
              </span>
            ) : null}
          </div>
        </div>
        {onMapContentFilterToggle ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Filter pins</span>
            {MAP_FILTER_CHIPS.map((c) => {
              const on = filterSet.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onMapContentFilterToggle(c.id)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    on ? 'bg-sky-500 text-white' : 'bg-white/10 text-zinc-300 hover:bg-white/15'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        ) : null}
        {onShowTransitToggle ? (
          <button
            type="button"
            aria-pressed={showTransit}
            onClick={onShowTransitToggle}
            className={`self-start rounded-full px-3 py-1 text-[10px] font-bold ${
              showTransit ? 'bg-emerald-600 text-white' : 'bg-white/10 text-zinc-300'
            }`}
          >
            Transit stops {showTransit ? 'on' : 'off'}
          </button>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1">
        <MapContainer
          center={RVA_CENTER}
          zoom={12}
          className="absolute inset-0 z-0"
          scrollWheelZoom
          aria-label="Event locations map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Rectangle
            bounds={CITY_RECT}
            pathOptions={{
              color: '#f59e0b',
              weight: 1.5,
              opacity: 0.55,
              fillOpacity: 0.04,
              dashArray: '6 10',
            }}
          />
          {historicPolygons.map((poly) => (
            <Polygon
              key={poly.id}
              positions={poly.positions}
              pathOptions={{
                color: poly.color || '#7c3aed',
                weight: 2,
                opacity: 0.65,
                fillOpacity: 0.08,
              }}
            />
          ))}
          {(artsPolygons || []).map((poly) => (
            <Polygon
              key={`art-${poly.id}`}
              positions={poly.positions}
              pathOptions={{
                color: poly.color || '#0d9488',
                weight: 1.5,
                opacity: 0.55,
                fillOpacity: 0.06,
                dashArray: '4 8',
              }}
            />
          ))}
          <MapBounds events={events} />
          <MapFlyTo selectedId={selectedId} events={events} />
          <LocateControlLeaflet onMessage={onLocateMessage} />
          {showTransit
            ? RICHMOND_TRANSIT_PINS.map((t) => (
                <Marker key={t.id} position={[t.lat, t.lng]} icon={pinTransit}>
                  <Popup>
                    <div className="max-w-[200px]">
                      <p className="text-sm font-bold text-zinc-900">{t.label}</p>
                      <p className="text-[10px] text-zinc-500">Illustrative Pulse / transfer stop</p>
                    </div>
                  </Popup>
                </Marker>
              ))
            : null}
          {storyPoints.map((s) => (
            <Marker
              key={s.slug}
              position={[s.lat, s.lng]}
              icon={pinStory}
              eventHandlers={{
                click: () => onStoryPinClick?.(s.slug),
              }}
            >
              <Popup>
                <div className="max-w-[220px]">
                  <p className="text-sm font-bold text-zinc-900">{s.title}</p>
                  <p className="text-[11px] text-zinc-500">Orange pin — neighborhood story (modal)</p>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-md bg-orange-600 py-1.5 text-xs font-bold text-white"
                    onClick={() => onStoryPinClick?.(s.slug)}
                  >
                    Open full story
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          {pts.map((e) => (
            <Marker
              key={e.id}
              position={[e.latitude, e.longitude]}
              icon={e.id === selectedId ? pinEventSelected : pinEvent}
              eventHandlers={{
                click: () => onSelectEvent?.(e.id),
              }}
            >
              <Popup>
                <div className="max-w-[240px]">
                  <p className="text-sm font-bold leading-snug text-zinc-900">{e.title}</p>
                  <p className="mt-1 text-xs text-zinc-600">{e.venue}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    {e.sourceName}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">Blue pin — selects event in the list &amp; map.</p>
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800"
                  >
                    View source →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

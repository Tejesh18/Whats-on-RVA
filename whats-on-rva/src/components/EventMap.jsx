import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Rectangle,
  Polygon,
  ZoomControl,
  ScaleControl,
} from 'react-leaflet';
import L from 'leaflet';
import { RICHMOND_VA_BOUNDS, isWithinRichmondVaBounds } from '../lib/richmondBounds.js';
import { RICHMOND_TRANSIT_PINS } from '../data/transitPins.js';
import { getEventTransitSummary } from '../lib/transitEstimates.js';
import { appleMapsDirectionsUrl } from '../lib/travelHandoff.js';

function stripBoldMarkers(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

const RVA_CENTER = [37.5407, -77.436];

const CITY_RECT = [
  [RICHMOND_VA_BOUNDS.south, RICHMOND_VA_BOUNDS.west],
  [RICHMOND_VA_BOUNDS.north, RICHMOND_VA_BOUNDS.east],
];

const pinEvent = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--event"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  popupAnchor: [0, -24],
});

const pinEventSelected = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--event rva-map-pin-inner--selected"></div>',
  iconSize: [36, 36],
  iconAnchor: [18, 33],
  popupAnchor: [0, -30],
});

const pinUserLocation = L.divIcon({
  className: 'rva-leaflet-divicon',
  html:
    '<div class="rva-user-loc-dot-wrap" aria-hidden="true"><span class="rva-user-loc-pulse-ring rva-user-loc-pulse"></span><span class="rva-user-loc-core"></span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -12],
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
    const t = window.setTimeout(() => {
      const pts = eventsWithCoords(events);
      if (pts.length === 0) {
        map.flyTo(RVA_CENTER, 12, { duration: 0.4 });
        return;
      }
      if (pts.length === 1) {
        map.flyTo([pts[0].latitude, pts[0].longitude], 14, { duration: 0.45 });
        return;
      }
      const b = L.latLngBounds(pts.map((e) => [e.latitude, e.longitude]));
      map.flyToBounds(b, { padding: [44, 44], maxZoom: 15, duration: 0.5 });
    }, 80);
    return () => window.clearTimeout(t);
  }, [events, map]);
  return null;
}

function MapFlyTo({ selectedId, events }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const e = events.find((x) => x.id === selectedId);
    if (e && typeof e.latitude === 'number' && typeof e.longitude === 'number') {
      map.flyTo([e.latitude, e.longitude], 16, { duration: 0.5, easeLinearity: 0.28 });
    }
  }, [selectedId, events, map]);
  return null;
}

function RegisterLeafletMap({ mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);
  return null;
}

function tryOpenMarkerPopup(markerRef) {
  if (!markerRef) return;
  try {
    if (typeof markerRef.openPopup === 'function') {
      markerRef.openPopup();
      return;
    }
    const el = markerRef.leafletElement;
    if (el && typeof el.openPopup === 'function') el.openPopup();
  } catch {
    /* leaflet ref shape varies by react-leaflet version */
  }
}

function OpenPopupWhenSelected({ selectedId, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const ref = markerRefs.current.get(selectedId);
    if (!ref) return;
    const t = window.setTimeout(() => tryOpenMarkerPopup(ref), 140);
    return () => window.clearTimeout(t);
  }, [selectedId, map, markerRefs]);
  return null;
}

function LocateControlLeaflet({ onMessage, onLocated }) {
  const map = useMap();
  useEffect(() => {
    const Control = L.Control.extend({
      onAdd() {
        const root = L.DomUtil.create('div', 'rva-map-locate-control leaflet-bar');
        const btn = L.DomUtil.create('button', 'rva-map-locate-btn', root);
        btn.type = 'button';
        btn.title = 'Center map on your location; also powers trip hints on event cards';
        btn.textContent = 'Near me';

        L.DomEvent.disableClickPropagation(root);
        L.DomEvent.on(btn, 'click', () => {
          if (!navigator.geolocation) {
            onMessage?.('Location not supported');
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              onLocated?.({ lat: latitude, lng: longitude });
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
  }, [map, onMessage, onLocated]);
  return null;
}

/**
 * Events map: blue pins + optional overlays. Story exploration lives on the Stories tab map.
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
  travelOrigin,
  onUserLocated,
}) {
  const pts = eventsWithCoords(events);
  const [locateMsg, setLocateMsg] = useState('');
  const msgTimer = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRefs = useRef(new Map());
  const filterSet = mapContentFilters instanceof Set ? mapContentFilters : new Set();

  const fitAllEvents = () => {
    const map = leafletMapRef.current;
    if (!map) return;
    const coords = eventsWithCoords(events);
    if (coords.length === 0) {
      map.flyTo(RVA_CENTER, 12, { duration: 0.45 });
      return;
    }
    if (coords.length === 1) {
      map.flyTo([coords[0].latitude, coords[0].longitude], 14, { duration: 0.5 });
      return;
    }
    const b = L.latLngBounds(coords.map((e) => [e.latitude, e.longitude]));
    map.flyToBounds(b, { padding: [52, 52], maxZoom: 15, duration: 0.55 });
  };

  const onLocateMessage = (m) => {
    if (msgTimer.current) window.clearTimeout(msgTimer.current);
    setLocateMsg(m);
    if (m) {
      msgTimer.current = window.setTimeout(() => setLocateMsg(''), 4000);
    }
  };

  return (
    <div className="rva-event-map flex h-[min(320px,45vh)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-2xl shadow-black/40 ring-1 ring-white/5 sm:h-[min(360px,42vh)] lg:h-[min(74vh,680px)] lg:min-h-[420px]">
      <div className="flex flex-col gap-2 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Events map</span>
            <p className="text-[10px] text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Listings
              </span>
              {storyPoints.length ? (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> Stories
                  </span>
                </>
              ) : null}
              {historicPolygons.length ? (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-violet-500" /> Districts
                  </span>
                </>
              ) : null}
              {artsPolygons?.length ? (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-teal-400" /> Arts
                  </span>
                </>
              ) : null}
              {showTransit ? (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Transit
                  </span>
                </>
              ) : null}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <button
              type="button"
              onClick={fitAllEvents}
              className="order-2 rounded-full border border-zinc-600/80 bg-zinc-800/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-200 shadow-sm transition hover:border-amber-500/40 hover:bg-zinc-700/90 hover:text-white sm:order-1"
            >
              Fit all
            </button>
            <span className="order-1 rounded-full bg-gradient-to-r from-sky-600/30 to-blue-600/25 px-2.5 py-1 text-[11px] font-semibold text-sky-100 ring-1 ring-sky-500/25 sm:order-2">
              {pts.length} on map
            </span>
            {locateMsg ? (
              <span className="order-3 max-w-[200px] text-right text-[10px] font-medium text-amber-200/90">
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
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                    on
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-900/30 ring-1 ring-sky-400/40'
                      : 'bg-zinc-800/90 text-zinc-300 ring-1 ring-zinc-600/50 hover:bg-zinc-700 hover:ring-zinc-500'
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
            className={`self-start rounded-full px-3 py-1 text-[10px] font-bold transition ${
              showTransit
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/35'
                : 'bg-zinc-800/90 text-zinc-300 ring-1 ring-zinc-600/50 hover:bg-zinc-700'
            }`}
          >
            Transit stops {showTransit ? 'visible' : 'hidden'}
          </button>
        ) : null}
        <p className="text-[9px] leading-snug text-zinc-500">
          Tip: click a pin or pick an event in the list — the map flies there and opens the card. Scroll to zoom; drag to pan.
        </p>
      </div>
      <div className="relative min-h-0 flex-1">
        <MapContainer
          center={RVA_CENTER}
          zoom={12}
          className="absolute inset-0 z-0 rounded-b-2xl"
          scrollWheelZoom
          zoomControl={false}
          aria-label="Event locations map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomleft" />
          <ScaleControl position="bottomleft" imperial />
          <Rectangle
            bounds={CITY_RECT}
            pathOptions={{
              color: '#fbbf24',
              weight: 2,
              opacity: 0.75,
              fillOpacity: 0.06,
              dashArray: '8 12',
            }}
          />
          {historicPolygons.map((poly) => (
            <Polygon
              key={poly.id}
              positions={poly.positions}
              pathOptions={{
                color: poly.color || '#a78bfa',
                weight: 2,
                opacity: 0.85,
                fillOpacity: 0.1,
              }}
            />
          ))}
          {(artsPolygons || []).map((poly) => (
            <Polygon
              key={`art-${poly.id}`}
              positions={poly.positions}
              pathOptions={{
                color: poly.color || '#2dd4bf',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.08,
                dashArray: '4 8',
              }}
            />
          ))}
          <RegisterLeafletMap mapRef={leafletMapRef} />
          <MapBounds events={events} />
          <MapFlyTo selectedId={selectedId} events={events} />
          <OpenPopupWhenSelected selectedId={selectedId} markerRefs={markerRefs} />
          <LocateControlLeaflet onMessage={onLocateMessage} onLocated={onUserLocated} />
          {travelOrigin &&
          typeof travelOrigin.lat === 'number' &&
          typeof travelOrigin.lng === 'number' ? (
            <Marker position={[travelOrigin.lat, travelOrigin.lng]} icon={pinUserLocation} interactive={false} />
          ) : null}
          {showTransit
            ? RICHMOND_TRANSIT_PINS.map((t) => (
                <Marker key={t.id} position={[t.lat, t.lng]} icon={pinTransit} riseOnHover>
                  <Popup>
                    <div className="rva-map-popup-inner max-w-[200px]">
                      <p className="text-sm font-bold text-zinc-50">{t.label}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-400">Illustrative Pulse / transfer stop</p>
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
              riseOnHover
            >
              <Popup>
                <div className="rva-map-popup-inner max-w-[220px]">
                  <p className="text-sm font-bold text-zinc-50">{s.title}</p>
                  <p className="text-[11px] text-zinc-400">Neighborhood story</p>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-xs font-bold text-zinc-950 shadow-md transition hover:brightness-105"
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
              ref={(inst) => {
                if (inst) markerRefs.current.set(e.id, inst);
                else markerRefs.current.delete(e.id);
              }}
              position={[e.latitude, e.longitude]}
              icon={e.id === selectedId ? pinEventSelected : pinEvent}
              riseOnHover
              eventHandlers={{
                click: () => onSelectEvent?.(e.id),
              }}
            >
              <Popup>
                <div className="rva-map-popup-inner max-w-[260px]">
                  <p className="text-sm font-bold leading-snug text-zinc-50">{e.title}</p>
                  <p className="mt-1 text-xs text-zinc-300">{e.venue}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                    {e.sourceName}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Selected in the list when you click this pin — scroll the feed to see the full card.
                  </p>
                  {(() => {
                    const s = getEventTransitSummary(e, travelOrigin);
                    if (!s) return null;
                    return (
                      <div className="mt-3 rounded-xl border border-zinc-600/60 bg-zinc-800/50 px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-300/95">Getting there</p>
                        {s.lines.map((line) => (
                          <p key={line.key} className="mt-1 text-[10px] leading-snug text-zinc-200">
                            {stripBoldMarkers(line.text)}
                          </p>
                        ))}
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">Live in Maps</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {s.directionsModes.map((m) => (
                            <a
                              key={m.key}
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={m.hint}
                              className="rounded-md bg-zinc-700/80 px-2 py-0.5 text-[9px] font-bold text-zinc-100 ring-1 ring-zinc-600 hover:bg-zinc-600"
                            >
                              {m.label}
                            </a>
                          ))}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] font-bold text-sky-300/95">
                          <a
                            href={appleMapsDirectionsUrl(e.latitude, e.longitude, travelOrigin, 'd')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            Apple · drive
                          </a>
                          <a
                            href={appleMapsDirectionsUrl(e.latitude, e.longitude, travelOrigin, 'r')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            Apple · transit
                          </a>
                        </div>
                        <p className="mt-1 text-[9px] leading-snug text-zinc-500">{s.disclaimer}</p>
                      </div>
                    );
                  })()}
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-200 px-3 py-2 text-xs font-bold text-zinc-900 shadow-sm transition hover:brightness-105"
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

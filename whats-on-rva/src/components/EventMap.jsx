import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
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
import { deriveMapPinCategory, MAP_PIN_LEGEND } from '../lib/mapPinCategory.js';

function stripBoldMarkers(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

const RVA_CENTER = [37.5407, -77.436];

const CITY_RECT = [
  [RICHMOND_VA_BOUNDS.south, RICHMOND_VA_BOUNDS.west],
  [RICHMOND_VA_BOUNDS.north, RICHMOND_VA_BOUNDS.east],
];

/** One Leaflet icon per category × selected — reused across markers. */
const eventPinIconCache = new Map();
function eventDivIcon(event, selected) {
  const cat = deriveMapPinCategory(event);
  const key = `${cat}-${selected ? 1 : 0}`;
  let icon = eventPinIconCache.get(key);
  if (!icon) {
    const cls = `rva-map-pin-inner rva-map-pin-inner--map-${cat}${selected ? ' rva-map-pin-inner--selected' : ''}`;
    icon = L.divIcon({
      className: 'rva-leaflet-divicon',
      html: `<div class="${cls}"></div>`,
      iconSize: selected ? [36, 36] : [28, 28],
      iconAnchor: selected ? [18, 33] : [14, 26],
      popupAnchor: selected ? [0, -30] : [0, -24],
    });
    eventPinIconCache.set(key, icon);
  }
  return icon;
}

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
    <div className="rva-event-map flex h-[min(320px,45vh)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl shadow-zinc-900/10 ring-1 ring-black/5 sm:h-[min(360px,42vh)] lg:h-[min(74vh,680px)] lg:min-h-[420px]">
      <div className="flex flex-col gap-2 border-b border-zinc-200/90 bg-gradient-to-r from-zinc-50 to-white px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700/90">Events map</span>
            <p className="text-[10px] text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Listings
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
              className="order-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 sm:order-1"
            >
              Fit all
            </button>
            <span className="order-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 ring-1 ring-zinc-200/90 sm:order-2">
              {pts.length} on map
            </span>
            {locateMsg ? (
              <span className="order-3 max-w-[200px] text-right text-[10px] font-medium text-amber-800">
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
                      ? 'bg-amber-500 text-zinc-900 shadow-sm ring-1 ring-amber-600/30'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-100 pt-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Pin colors</span>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {MAP_PIN_LEGEND.map((row) => (
              <li key={row.key} className="flex items-center gap-1 text-[9px] text-zinc-600">
                <span className={`rva-map-legend-dot rva-map-legend-dot--${row.key}`} aria-hidden />
                {row.label}
              </li>
            ))}
          </ul>
        </div>
        {onShowTransitToggle ? (
          <button
            type="button"
            aria-pressed={showTransit}
            onClick={onShowTransitToggle}
            className={`self-start rounded-full px-3 py-1 text-[10px] font-bold transition ${
              showTransit
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/40'
                : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Transit stops {showTransit ? 'visible' : 'hidden'}
          </button>
        ) : null}
        <p className="text-[9px] leading-snug text-zinc-500">
          Hover a pin for a quick title; click the pin (or choose in the list) for full details. Green <strong>Arts</strong> shapes
          are district overlays — pin colors follow music, art, theatre, family, and free listings.
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
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomleft" />
          <ScaleControl position="bottomleft" imperial />
          <Rectangle
            bounds={CITY_RECT}
            pathOptions={{
              color: '#f59e0b',
              weight: 1.5,
              opacity: 0.65,
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
                      <p className="text-sm font-bold text-zinc-900">{t.label}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">Illustrative Pulse / transfer stop</p>
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
                  <p className="text-sm font-bold text-zinc-900">{s.title}</p>
                  <p className="text-[11px] text-zinc-500">Neighborhood story</p>
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
              icon={eventDivIcon(e, e.id === selectedId)}
              riseOnHover
              eventHandlers={{
                click: () => onSelectEvent?.(e.id),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                opacity={1}
                interactive={false}
                className="rva-map-hover-tip"
              >
                <div className="m-0 p-0 text-left">
                  <p className="line-clamp-2 font-bold leading-tight text-zinc-900">{e.title}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">{e.category || 'Event'}</p>
                </div>
              </Tooltip>
              <Popup>
                <div className="rva-map-popup-inner max-w-[260px]">
                  <p className="text-sm font-bold leading-snug text-zinc-900">{e.title}</p>
                  <p className="mt-1 text-xs text-zinc-600">{e.venue}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    {e.sourceName}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Selected in the list when you click this pin — scroll the feed to see the full card.
                  </p>
                  {(() => {
                    const s = getEventTransitSummary(e, travelOrigin);
                    if (!s) return null;
                    return (
                      <div className="mt-3 rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-800">Getting there</p>
                        {s.lines.map((line) => (
                          <p key={line.key} className="mt-1 text-[10px] leading-snug text-emerald-950">
                            {stripBoldMarkers(line.text)}
                          </p>
                        ))}
                        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-zinc-600">Live in Maps</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {s.directionsModes.map((m) => (
                            <a
                              key={m.key}
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={m.hint}
                              className="rounded-md bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-50"
                            >
                              {m.label}
                            </a>
                          ))}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] font-bold text-sky-700">
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
                        <p className="mt-1 text-[9px] leading-snug text-zinc-600">{s.disclaimer}</p>
                      </div>
                    );
                  })()}
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-zinc-800"
                  >
                    Get tickets →
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

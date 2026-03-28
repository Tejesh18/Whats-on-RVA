import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { RICHMOND_VA_BOUNDS, isWithinRichmondVaBounds } from '../lib/richmondBounds.js';

const RVA_CENTER = [37.5407, -77.436];

const CITY_RECT = [
  [RICHMOND_VA_BOUNDS.south, RICHMOND_VA_BOUNDS.west],
  [RICHMOND_VA_BOUNDS.north, RICHMOND_VA_BOUNDS.east],
];

const pinDefault = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 24],
  popupAnchor: [0, -22],
});

const pinSelected = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--selected"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 28],
  popupAnchor: [0, -26],
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
 * Carto Voyager basemap, Richmond city bounds guide, fly-to selection, geolocation control.
 */
export default function EventMap({ events, selectedId, onSelectEvent }) {
  const pts = eventsWithCoords(events);
  const [locateMsg, setLocateMsg] = useState('');
  const msgTimer = useRef(null);

  const onLocateMessage = (m) => {
    if (msgTimer.current) window.clearTimeout(msgTimer.current);
    setLocateMsg(m);
    if (m) {
      msgTimer.current = window.setTimeout(() => setLocateMsg(''), 4000);
    }
  };

  return (
    <div className="flex h-[min(320px,45vh)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-900 shadow-xl shadow-zinc-900/10 ring-1 ring-black/5 sm:h-[min(360px,42vh)] lg:h-[min(74vh,680px)] lg:min-h-[420px]">
      <div className="flex items-center justify-between border-b border-zinc-700/50 bg-gradient-to-r from-zinc-950 to-zinc-900 px-3 py-2.5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Explore</span>
          <p className="text-[11px] text-zinc-400">Pins · popups · city bounds · near me</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
            {pts.length} on map
          </span>
          {locateMsg ? (
            <span className="max-w-[160px] text-right text-[10px] font-medium text-amber-200/90">
              {locateMsg}
            </span>
          ) : null}
        </div>
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
          <MapBounds events={events} />
          <MapFlyTo selectedId={selectedId} events={events} />
          <LocateControlLeaflet onMessage={onLocateMessage} />
          {pts.map((e) => (
            <Marker
              key={e.id}
              position={[e.latitude, e.longitude]}
              icon={e.id === selectedId ? pinSelected : pinDefault}
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
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800"
                  >
                    Tickets / details →
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

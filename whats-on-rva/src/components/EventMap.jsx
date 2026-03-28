import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const RVA_DEFAULT = [37.5407, -77.436];

const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
      map.setView(RVA_DEFAULT, 12);
      return;
    }
    if (pts.length === 1) {
      map.setView([pts[0].latitude, pts[0].longitude], 14);
      return;
    }
    const b = L.latLngBounds(pts.map((e) => [e.latitude, e.longitude]));
    map.fitBounds(b, { padding: [32, 32], maxZoom: 14 });
  }, [events, map]);
  return null;
}

function MapFlyTo({ selectedId, events }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const e = events.find((x) => x.id === selectedId);
    if (e && typeof e.latitude === 'number' && typeof e.longitude === 'number') {
      map.flyTo([e.latitude, e.longitude], 15, { duration: 0.5 });
    }
  }, [selectedId, events, map]);
  return null;
}

/**
 * OpenStreetMap + markers for normalized events that include lat/lng (CultureWorks geo or mock data).
 */
export default function EventMap({ events, selectedId, onSelectEvent }) {
  const pts = eventsWithCoords(events);

  return (
    <div className="flex h-[min(280px,42vh)] w-full flex-col overflow-hidden rounded-2xl border border-rva-slate/10 bg-rva-slate/5 shadow-sm sm:h-[min(320px,38vh)] lg:h-[min(72vh,640px)] lg:min-h-[400px]">
      <div className="flex items-center justify-between border-b border-rva-slate/10 bg-white px-3 py-2">
        <span className="text-xs font-semibold text-rva-slate">Map</span>
        <span className="text-[11px] text-rva-slate/50">
          {pts.length} pin{pts.length === 1 ? '' : 's'} · OpenStreetMap
        </span>
      </div>
      <div className="relative min-h-0 flex-1">
        <MapContainer
          center={RVA_DEFAULT}
          zoom={12}
          className="absolute inset-0 z-0"
          scrollWheelZoom
          aria-label="Event locations map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds events={events} />
          <MapFlyTo selectedId={selectedId} events={events} />
          {pts.map((e) => (
            <Marker
              key={e.id}
              position={[e.latitude, e.longitude]}
              icon={pinIcon}
              eventHandlers={{
                click: () => onSelectEvent?.(e.id),
              }}
            >
              <Popup>
                <div className="max-w-[220px]">
                  <p className="text-sm font-semibold leading-snug text-rva-slate">{e.title}</p>
                  <p className="mt-1 text-xs text-rva-slate/65">{e.venue}</p>
                  <a
                    href={e.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-rva-river hover:underline"
                  >
                    View listing →
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

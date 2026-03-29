import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Rectangle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { STORY_ZONE_POLYGONS } from '../data/storyMapZones.js';
import { getStoryMapPoints } from '../data/mapLayers.js';
import { getStory } from '../data/neighborhoodStories.js';
import { RICHMOND_VA_BOUNDS } from '../lib/richmondBounds.js';

const RVA_CENTER = [37.5407, -77.436];

const CITY_RECT = [
  [RICHMOND_VA_BOUNDS.south, RICHMOND_VA_BOUNDS.west],
  [RICHMOND_VA_BOUNDS.north, RICHMOND_VA_BOUNDS.east],
];

const pinStory = L.divIcon({
  className: 'rva-leaflet-divicon',
  html: '<div class="rva-map-pin-inner rva-map-pin-inner--story"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  popupAnchor: [0, -24],
});

function pointInRing(lat, lng, ring) {
  const poly = L.polygon(ring);
  return poly.getBounds().contains(L.latLng(lat, lng));
}

function ZoneStorySync({ onActiveSlugChange }) {
  const map = useMap();
  const recompute = useCallback(() => {
    const zoom = map.getZoom();
    const c = map.getCenter();
    let slug = null;
    for (const zone of STORY_ZONE_POLYGONS) {
      if (zoom < zone.minZoom) continue;
      if (pointInRing(c.lat, c.lng, zone.positions)) {
        slug = zone.slug;
        break;
      }
    }
    onActiveSlugChange(slug);
  }, [map, onActiveSlugChange]);

  useMapEvents({
    zoomend: recompute,
    moveend: recompute,
  });

  useEffect(() => {
    recompute();
  }, [recompute]);

  return null;
}

export default function StoryExploreMap({ onOpenStory }) {
  const storyPoints = useMemo(() => getStoryMapPoints(), []);
  const [activeSlug, setActiveSlug] = useState(null);
  const activeStory = activeSlug ? getStory(activeSlug) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-rva-james/25 bg-rva-cream/80 px-4 py-3 text-sm text-zinc-700">
        <p className="font-display font-bold text-rva-slate">Richmond story map</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
          Zoom to level {STORY_ZONE_POLYGONS[0]?.minZoom}+ and center on a colored corridor — a{' '}
          <strong>story card surfaces on the map</strong>. Orange pins jump straight into a neighborhood essay anytime.
        </p>
      </div>

      <div className="relative h-[min(420px,62vh)] w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-md ring-1 ring-black/5 lg:h-[min(560px,72vh)]">
        <MapContainer center={RVA_CENTER} zoom={11} className="z-0 h-full w-full" scrollWheelZoom zoomControl>
          <TileLayer
            attribution='&copy; OSM &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoneStorySync onActiveSlugChange={setActiveSlug} />
          {STORY_ZONE_POLYGONS.map((z) => (
            <Polygon
              key={z.slug}
              positions={z.positions}
              pathOptions={{
                color: z.color,
                weight: activeSlug === z.slug ? 3 : 2,
                opacity: activeSlug === z.slug ? 1 : 0.75,
                fillOpacity: activeSlug === z.slug ? 0.22 : 0.06,
              }}
            />
          ))}
          <Rectangle
            bounds={CITY_RECT}
            pathOptions={{
              color: '#C4A035',
              weight: 1,
              opacity: 0.45,
              fillOpacity: 0.02,
              dashArray: '6 10',
            }}
          />
          {storyPoints.map((s) => (
            <Marker
              key={s.slug}
              position={[s.lat, s.lng]}
              icon={pinStory}
              eventHandlers={{ click: () => onOpenStory?.(s.slug) }}
            >
              <Popup>
                <p className="m-0 max-w-[200px] text-sm font-bold text-zinc-900">{s.title}</p>
                <button
                  type="button"
                  className="mt-2 w-full rounded-md bg-rva-river py-1.5 text-xs font-bold text-white"
                  onClick={() => onOpenStory?.(s.slug)}
                >
                  Open story
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* On-map UI: story surfaces here, not below the map */}
        <div
          className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-end p-3 sm:p-4"
          aria-live="polite"
        >
          {!activeStory ? (
            <div className="pointer-events-none flex justify-center">
              <div className="max-w-sm rounded-2xl bg-zinc-950/80 px-4 py-2.5 text-center text-xs font-medium leading-snug text-white shadow-lg backdrop-blur-md ring-1 ring-white/15">
                Pan across RVA — when you&apos;re <strong className="text-rva-gold">centered in a zone</strong>, its story
                pops up on this map.
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto" style={{ animation: 'rvaStoryCardIn 0.35s ease-out both' }}>
              <div className="mx-auto flex max-w-lg flex-col overflow-hidden rounded-2xl border border-rva-river/20 bg-white/95 shadow-2xl shadow-rva-slate/15 ring-1 ring-black/5 backdrop-blur-md sm:flex-row sm:max-w-xl">
                <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-36 sm:min-h-[140px]">
                  <img
                    src={activeStory.heroImage}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {activeStory.neighborhoodTag}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rva-river">Story in this view</p>
                  <h3 className="mt-1 font-display text-lg font-bold leading-tight text-zinc-900">{activeStory.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-zinc-600">{activeStory.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenStory?.(activeStory.slug)}
                      className="rounded-xl bg-rva-river px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rva-river-light active:scale-[0.98]"
                    >
                      Open full story
                    </button>
                    <span className="self-center text-[11px] text-zinc-400">Drag the map to explore another zone</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes rvaStoryCardIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

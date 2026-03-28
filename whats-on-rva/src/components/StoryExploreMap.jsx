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
      <div className="rounded-2xl border border-violet-200/80 bg-violet-50/40 px-4 py-3 text-sm text-zinc-700">
        <p className="font-display font-bold text-violet-950">How this map works</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
          Zoom in toward a colored zone (zoom level {STORY_ZONE_POLYGONS[0]?.minZoom}+). When the map center sits inside a
          neighborhood, a story card appears below — like focusing a lens on that place.
        </p>
      </div>

      <div className="h-[min(380px,55vh)] w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-sm lg:h-[min(520px,70vh)]">
        <MapContainer center={RVA_CENTER} zoom={11} className="h-full w-full" scrollWheelZoom zoomControl>
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
                weight: 2,
                opacity: 0.75,
                fillOpacity: activeSlug === z.slug ? 0.18 : 0.06,
              }}
            />
          ))}
          <Rectangle
            bounds={CITY_RECT}
            pathOptions={{
              color: '#f59e0b',
              weight: 1,
              opacity: 0.4,
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
                  className="mt-2 w-full rounded-md bg-violet-600 py-1.5 text-xs font-bold text-white"
                  onClick={() => onOpenStory?.(s.slug)}
                >
                  Open story
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div
        className={`rounded-2xl border px-4 py-4 transition-colors ${
          activeStory
            ? 'border-violet-400 bg-white shadow-md ring-1 ring-violet-200'
            : 'border-dashed border-zinc-300 bg-zinc-50/80'
        }`}
      >
        {activeStory ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">You&apos;re zoomed into</p>
            <h3 className="mt-1 font-display text-lg font-bold text-zinc-900">{activeStory.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{activeStory.shortDescription}</p>
            <button
              type="button"
              onClick={() => onOpenStory?.(activeStory.slug)}
              className="mt-4 w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700 sm:w-auto sm:px-6"
            >
              Read full story
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-zinc-500">
            Pan and <strong>zoom closer</strong> (level {STORY_ZONE_POLYGONS[0]?.minZoom}+) into a purple, teal, or blue
            zone — the matching neighborhood story will appear here.
          </p>
        )}
      </div>
    </div>
  );
}

import { haversineKm } from './geo.js';
import { RICHMOND_TRANSIT_PINS } from '../data/transitPins.js';

const WALK_KMH = 5;
const WALK_DETOUR = 1.35;
const PULSE_EFFECTIVE_KMH = 16;
const ROUTE_DETOUR = 1.5;
const SHORT_WALK_SKIP_PULSE_KM = 0.65;

function roundMin(m) {
  return Math.max(1, Math.round(m));
}

/** Walking time from straight-line km (detour approximates blocks). */
export function walkMinutesFromLineKm(lineKm) {
  const pathKm = lineKm * WALK_DETOUR;
  return (pathKm / WALK_KMH) * 60;
}

export function findNearestTransitPin(lat, lng) {
  let best = RICHMOND_TRANSIT_PINS[0];
  let bestKm = Infinity;
  for (const p of RICHMOND_TRANSIT_PINS) {
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d < bestKm) {
      bestKm = d;
      best = p;
    }
  }
  return { pin: best, lineKm: bestKm };
}

/**
 * Rough door-to-door via “nearest Pulse stop” model (illustrative — not GTFS).
 * @returns {{ totalLow: number, totalHigh: number, mode: 'walk'|'pulse', walkToPulseMin: number, nearestLabel: string } | null}
 */
export function estimateTripFromOriginToEvent(originLat, originLng, eventLat, eventLng) {
  if (
    typeof originLat !== 'number' ||
    typeof originLng !== 'number' ||
    typeof eventLat !== 'number' ||
    typeof eventLng !== 'number'
  ) {
    return null;
  }

  const directKm = haversineKm(originLat, originLng, eventLat, eventLng);
  if (directKm < SHORT_WALK_SKIP_PULSE_KM) {
    const m = roundMin(walkMinutesFromLineKm(directKm));
    return {
      totalLow: m,
      totalHigh: m + 2,
      mode: 'walk',
      walkToPulseMin: 0,
      nearestLabel: '',
    };
  }

  const fromStop = findNearestTransitPin(originLat, originLng);
  const toStop = findNearestTransitPin(eventLat, eventLng);
  const walkToPulseMin = roundMin(walkMinutesFromLineKm(fromStop.lineKm));
  const walkFromPulseMin = roundMin(walkMinutesFromLineKm(toStop.lineKm));

  if (fromStop.pin.id === toStop.pin.id) {
    const m = roundMin(walkMinutesFromLineKm(directKm));
    return {
      totalLow: m,
      totalHigh: m + 4,
      mode: 'walk',
      walkToPulseMin,
      nearestLabel: fromStop.pin.label,
    };
  }

  const rideKm =
    haversineKm(fromStop.pin.lat, fromStop.pin.lng, toStop.pin.lat, toStop.pin.lng) * ROUTE_DETOUR;
  const rideMin = (rideKm / PULSE_EFFECTIVE_KMH) * 60;
  const base = walkToPulseMin + rideMin + walkFromPulseMin;

  return {
    totalLow: roundMin(base * 0.88),
    totalHigh: roundMin(base * 1.18),
    mode: 'pulse',
    walkToPulseMin,
    nearestLabel: fromStop.pin.label,
  };
}

const DISCLAIMER =
  'Illustrative math only — not live GRTC schedules. Check the official app or maps before you leave.';

/**
 * Build lines for UI + optional Google Maps transit URL.
 */
export function getEventTransitSummary(event, travelOrigin) {
  if (typeof event.latitude !== 'number' || typeof event.longitude !== 'number') {
    return null;
  }

  const elat = event.latitude;
  const elng = event.longitude;
  const { pin, lineKm } = findNearestTransitPin(elat, elng);
  const walkToPulse = roundMin(walkMinutesFromLineKm(lineKm));

  const lines = [
    {
      key: 'pulse',
      text: `~${walkToPulse} min walk (est.) to nearest **Pulse** stop: ${pin.label.split('·')[1]?.trim() || pin.label}`,
    },
  ];

  let trip = null;
  if (
    travelOrigin &&
    typeof travelOrigin.lat === 'number' &&
    typeof travelOrigin.lng === 'number'
  ) {
    trip = estimateTripFromOriginToEvent(travelOrigin.lat, travelOrigin.lng, elat, elng);
    if (trip) {
      if (trip.mode === 'pulse') {
        lines.push({
          key: 'you',
          text: `From **your location**: ~${trip.totalLow}–${trip.totalHigh} min total (walk + **Pulse** + walk, estimate).`,
        });
      } else {
        lines.push({
          key: 'you',
          text: `From **your location**: ~${trip.totalLow}–${trip.totalHigh} min **walking** (straight-line distance is short — driving/transit may not save time).`,
        });
      }
    }
  }

  const dest = `${elat},${elng}`;
  let mapsTransitUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=transit`;
  if (
    travelOrigin &&
    typeof travelOrigin.lat === 'number' &&
    typeof travelOrigin.lng === 'number'
  ) {
    const o = `${travelOrigin.lat},${travelOrigin.lng}`;
    mapsTransitUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(dest)}&travelmode=transit`;
  }

  return { lines, trip, disclaimer: DISCLAIMER, mapsTransitUrl };
}

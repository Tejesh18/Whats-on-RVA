/**
 * Downloads GRTC static GTFS and writes trimmed JSON for the app.
 * Run: npm run import-grtc  (requires network; re-run when schedules change)
 *
 * Feed terms: https://www.ridegrtc.com/gtfs-files-developer-license-agreement-and-terms-of-use
 */
import AdmZip from 'adm-zip';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src', 'data');

const GTFS_URL = 'https://www.ridegrtc.com/wp-content/uploads/2025/02/gtfs.zip';

/** Match `src/lib/richmondBounds.js` city box */
const BOUNDS = { south: 37.465, north: 37.615, west: -77.585, east: -77.375 };

function inBounds(lat, lng) {
  return lat >= BOUNDS.south && lat <= BOUNDS.north && lng >= BOUNDS.west && lng <= BOUNDS.east;
}

/** Minimal CSV row parser (handles quoted fields). */
function parseCsvRow(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
    } else if (c === ',' && !inQ) {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function parseStops(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(',');
  const idx = {
    id: header.indexOf('stop_id'),
    code: header.indexOf('stop_code'),
    name: header.indexOf('stop_name'),
    lat: header.indexOf('stop_lat'),
    lon: header.indexOf('stop_lon'),
  };
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvRow(lines[i]);
    if (cols.length < 5) continue;
    const lat = parseFloat(cols[idx.lat]);
    const lng = parseFloat(cols[idx.lon]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    rows.push({
      id: String(cols[idx.id] ?? ''),
      code: cols[idx.code] ? String(cols[idx.code]) : '',
      name: cols[idx.name] || 'Stop',
      lat,
      lng,
    });
  }
  return rows;
}

async function main() {
  mkdirSync(DATA, { recursive: true });
  console.log('Fetching', GTFS_URL);
  const res = await fetch(GTFS_URL);
  if (!res.ok) throw new Error(`GTFS download failed: ${res.status}`);
  const zip = new AdmZip(Buffer.from(await res.arrayBuffer()));

  const read = (name) => {
    const e = zip.getEntry(name);
    if (!e) throw new Error(`Missing ${name} in zip`);
    return e.getData().toString('utf8');
  };

  const feedInfoTxt = read('feed_info.txt');
  const feedLines = feedInfoTxt.split(/\r?\n/).filter(Boolean);
  const feedCols = parseCsvRow(feedLines[1] || '');
  const feedVersion = feedCols[5] || 'unknown';
  const feedEnd = feedCols[4] || '';

  const stops = parseStops(read('stops.txt'));
  const inBox = stops.filter((s) => inBounds(s.lat, s.lng));

  const routesTxt = read('routes.txt');
  const routeLines = routesTxt.split(/\r?\n/).filter(Boolean);
  const rHeader = routeLines[0].split(',');
  const pulseRouteIds = new Set();
  for (let i = 1; i < routeLines.length; i++) {
    const c = parseCsvRow(routeLines[i]);
    const routeId = c[0];
    const shortName = c[2] || '';
    const longName = (c[3] || '').toUpperCase();
    if (routeId === 'BRT' || shortName === 'BRT' || longName.includes('PULSE')) {
      pulseRouteIds.add(routeId);
    }
  }

  const tripsTxt = read('trips.txt');
  const tripLines = tripsTxt.split(/\r?\n/).filter(Boolean);
  const brtTripIds = new Set();
  for (let i = 1; i < tripLines.length; i++) {
    const c = parseCsvRow(tripLines[i]);
    const tripId = c[0];
    const routeId = c[1];
    if (pulseRouteIds.has(routeId)) brtTripIds.add(tripId);
  }

  console.log('BRT/Pulse trips:', brtTripIds.size);

  const stopTimesTxt = read('stop_times.txt');
  const pulseStopIds = new Set();
  const stLines = stopTimesTxt.split(/\r?\n/);
  for (let i = 1; i < stLines.length; i++) {
    const line = stLines[i];
    if (!line.trim()) continue;
    const c = parseCsvRow(line);
    const tripId = c[0];
    if (!brtTripIds.has(tripId)) continue;
    const stopId = String(c[3] ?? '');
    if (stopId) pulseStopIds.add(stopId);
  }

  const stopById = new Map(stops.map((s) => [s.id, s]));
  const pulseStops = [];
  for (const sid of pulseStopIds) {
    const s = stopById.get(sid);
    if (s && inBounds(s.lat, s.lng)) {
      pulseStops.push({
        id: `pulse-${s.id}`,
        stopId: s.id,
        code: s.code,
        label: `Pulse (BRT) · ${s.name}`,
        lat: s.lat,
        lng: s.lng,
      });
    }
  }

  pulseStops.sort((a, b) => a.label.localeCompare(b.label));

  const meta = {
    source: 'GRTC static GTFS',
    publisher: 'Greater Richmond Transit Company',
    publisherUrl: 'https://www.ridegrtc.com',
    gtfsZipUrl: GTFS_URL,
    feedVersion,
    feedEndDate: feedEnd,
    generatedAt: new Date().toISOString(),
    stopCountRichmondBox: inBox.length,
    pulseStopCount: pulseStops.length,
    bounds: BOUNDS,
    licenseNote:
      'Use subject to GRTC GTFS license. Data is scheduled service only — not live vehicle tracking.',
  };

  writeFileSync(join(DATA, 'grtcGtfsMeta.json'), JSON.stringify(meta, null, 2));
  writeFileSync(join(DATA, 'grtcStopsRichmond.json'), JSON.stringify(inBox, null, 2));
  writeFileSync(join(DATA, 'grtcPulseStops.json'), JSON.stringify(pulseStops, null, 2));

  console.log('Wrote grtcGtfsMeta.json, grtcStopsRichmond.json (%d stops), grtcPulseStops.json (%d)', inBox.length, pulseStops.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

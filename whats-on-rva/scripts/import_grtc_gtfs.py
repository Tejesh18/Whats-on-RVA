"""
Download GRTC static GTFS and write trimmed JSON (stdlib only).
Run: python scripts/import_grtc_gtfs.py

Also available: npm run import-grtc (Node + adm-zip) — same outputs.
"""
from __future__ import annotations

import csv
import io
import json
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data"
GTFS_URL = "https://www.ridegrtc.com/wp-content/uploads/2025/02/gtfs.zip"

BOUNDS = {"south": 37.465, "north": 37.615, "west": -77.585, "east": -77.375}


def in_bounds(lat: float, lng: float) -> bool:
    return BOUNDS["south"] <= lat <= BOUNDS["north"] and BOUNDS["west"] <= lng <= BOUNDS["east"]


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    print("Fetching", GTFS_URL)
    raw = urllib.request.urlopen(GTFS_URL, timeout=120).read()
    zf = zipfile.ZipFile(io.BytesIO(raw))

    def read_txt(name: str) -> str:
        return zf.read(name).decode("utf-8", errors="replace")

    stops_rows = list(csv.DictReader(io.StringIO(read_txt("stops.txt"))))
    stops = []
    for r in stops_rows:
        try:
            lat = float(r["stop_lat"])
            lng = float(r["stop_lon"])
        except (KeyError, ValueError):
            continue
        stops.append(
            {
                "id": str(r.get("stop_id", "")),
                "code": str(r.get("stop_code", "") or ""),
                "name": (r.get("stop_name") or "Stop").strip(),
                "lat": lat,
                "lng": lng,
            }
        )

    in_box = [s for s in stops if in_bounds(s["lat"], s["lng"])]

    routes = list(csv.DictReader(io.StringIO(read_txt("routes.txt"))))
    pulse_route_ids: set[str] = set()
    for r in routes:
        rid = r.get("route_id", "")
        short = (r.get("route_short_name") or "").strip()
        long = (r.get("route_long_name") or "").upper()
        if rid == "BRT" or short == "BRT" or "PULSE" in long:
            pulse_route_ids.add(rid)

    trips = list(csv.DictReader(io.StringIO(read_txt("trips.txt"))))
    brt_trip_ids = {t["trip_id"] for t in trips if t.get("route_id") in pulse_route_ids}
    print("BRT/Pulse trips:", len(brt_trip_ids))

    pulse_stop_ids: set[str] = set()
    with zf.open("stop_times.txt") as f:
        text = io.TextIOWrapper(f, encoding="utf-8")
        reader = csv.DictReader(text)
        for row in reader:
            if row.get("trip_id") in brt_trip_ids:
                sid = row.get("stop_id")
                if sid:
                    pulse_stop_ids.add(str(sid))

    stop_by_id = {s["id"]: s for s in stops}
    pulse_stops = []
    for sid in sorted(pulse_stop_ids, key=lambda x: int(x) if x.isdigit() else x):
        s = stop_by_id.get(sid)
        if s and in_bounds(s["lat"], s["lng"]):
            pulse_stops.append(
                {
                    "id": f"pulse-{s['id']}",
                    "stopId": s["id"],
                    "code": s["code"],
                    "label": f"Pulse (BRT) · {s['name']}",
                    "lat": s["lat"],
                    "lng": s["lng"],
                }
            )

    feed_rows = list(csv.DictReader(io.StringIO(read_txt("feed_info.txt"))))
    fi = feed_rows[0] if feed_rows else {}

    meta = {
        "source": "GRTC static GTFS",
        "publisher": "Greater Richmond Transit Company",
        "publisherUrl": "https://www.ridegrtc.com",
        "gtfsZipUrl": GTFS_URL,
        "feedVersion": fi.get("feed_version", "unknown"),
        "feedEndDate": fi.get("feed_end_date", ""),
        "generatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "stopCountRichmondBox": len(in_box),
        "pulseStopCount": len(pulse_stops),
        "bounds": BOUNDS,
        "licenseNote": "Use subject to GRTC GTFS license. Scheduled service only — not live vehicle tracking.",
    }

    (DATA / "grtcGtfsMeta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (DATA / "grtcStopsRichmond.json").write_text(json.dumps(in_box, indent=2), encoding="utf-8")
    (DATA / "grtcPulseStops.json").write_text(json.dumps(pulse_stops, indent=2), encoding="utf-8")
    print(
        f"Wrote grtcGtfsMeta.json, grtcStopsRichmond.json ({len(in_box)}), grtcPulseStops.json ({len(pulse_stops)})"
    )


if __name__ == "__main__":
    main()

/**
 * Universal links that open Google Maps (or Apple Maps) with full routing.
 * Real-time traffic, live transit, and turn-by-turn live inside those apps — not in our bundle.
 */

/**
 * @param {number} destLat
 * @param {number} destLng
 * @param {{ lat: number, lng: number } | null | undefined} travelOrigin
 * @returns {{ key: string, label: string, hint?: string, url: string }[]}
 */
export function getGoogleDirectionsModes(destLat, destLng, travelOrigin) {
  const dest = `${destLat},${destLng}`;
  const hasOrigin =
    travelOrigin &&
    typeof travelOrigin.lat === 'number' &&
    typeof travelOrigin.lng === 'number';

  const build = (travelmode) => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=${travelmode}`;
    if (hasOrigin) {
      const o = `${travelOrigin.lat},${travelOrigin.lng}`;
      url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(dest)}&travelmode=${travelmode}`;
    }
    return url;
  };

  return [
    {
      key: 'transit',
      label: 'Transit',
      hint: 'Includes GRTC where Maps has data',
      url: build('transit'),
    },
    {
      key: 'driving',
      label: 'Drive',
      hint: 'Live traffic in Google Maps',
      url: build('driving'),
    },
    { key: 'walking', label: 'Walk', url: build('walking') },
    { key: 'bicycling', label: 'Bike', url: build('bicycling') },
  ];
}

/**
 * Apple Maps directions (works well on iPhone / iPad).
 * @param {number} destLat
 * @param {number} destLng
 * @param {{ lat: number, lng: number } | null | undefined} travelOrigin
 * @param {'d'|'r'|'w'} dirflg d=drive, r=transit, w=walk
 */
export function appleMapsDirectionsUrl(destLat, destLng, travelOrigin, dirflg = 'd') {
  const daddr = `${destLat},${destLng}`;
  let url = `https://maps.apple.com/?daddr=${encodeURIComponent(daddr)}&dirflg=${dirflg}`;
  if (
    travelOrigin &&
    typeof travelOrigin.lat === 'number' &&
    typeof travelOrigin.lng === 'number'
  ) {
    const saddr = `${travelOrigin.lat},${travelOrigin.lng}`;
    url += `&saddr=${encodeURIComponent(saddr)}`;
  }
  return url;
}

import { useEffect, useState } from 'react';

/**
 * Lightweight “routes”: #privacy, #terms, or home (empty / other hashes).
 */
export function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
  );

  useEffect(() => {
    const read = () => setHash(window.location.hash.slice(1));
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  return hash;
}

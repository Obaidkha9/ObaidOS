"use client";

import { useEffect, useState } from "react";

/* Fetches real album artwork for a track from the free iTunes Search API,
   client-side (runs in the visitor's browser). Returns null until it resolves
   (or on any error / offline) so callers can fall back to a gradient. */
export function useItunesCover(term: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [prev, setPrev] = useState(term);
  if (term !== prev) {
    setPrev(term);
    setUrl(null); // clear the old cover the moment the term changes
  }
  useEffect(() => {
    if (!term) return;
    let cancelled = false;
    // strip punctuation (e.g. the hyphen in "Class-Sikh") which hurts matching
    const clean = term.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&entity=song&limit=1`)
      .then((r) => r.json())
      .then((d) => {
        const art: string | undefined = d?.results?.[0]?.artworkUrl100;
        if (!cancelled && art) setUrl(art.replace("100x100bb", "600x600bb"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [term]);
  return url;
}

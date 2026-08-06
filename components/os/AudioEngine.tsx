"use client";

import { useEffect } from "react";
import { useOS } from "@/lib/store";
import { PLAYLIST } from "@/lib/content";

/**
 * The whole app shares ONE <audio> element for the entire page session.
 *
 * Crucially it lives on `window`, *outside* React's tree — not as JSX with a
 * ref. That means React Strict Mode's mount→unmount→remount AND Fast-Refresh
 * module reloads all reuse the exact same element. It is therefore impossible
 * to end up with two overlapping streams (the classic bug where an orphaned
 * <audio> keeps playing while a freshly-mounted one starts a second copy).
 * Only a full page reload — which tears down `window` and stops audio anyway —
 * ever resets it.
 */
const AUDIO_KEY = "__obaidOsAudio";

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, HTMLAudioElement | undefined>;
  if (!w[AUDIO_KEY]) {
    const el = new Audio();
    el.preload = "metadata";
    w[AUDIO_KEY] = el;
  }
  return w[AUDIO_KEY] ?? null;
}

export default function AudioEngine() {
  const setPlaylist = useOS((s) => s.setPlaylist);
  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const isPlaying = useOS((s) => s.isPlaying);
  const volume = useOS((s) => s.volume);
  const pendingSeek = useOS((s) => s.pendingSeek);
  const hasAudio = useOS((s) => s.hasAudio);

  // wire the singleton element's media events into the store
  useEffect(() => {
    const el = getAudio();
    if (!el) return;
    const onTime = () => useOS.getState()._syncTime(el.currentTime, el.duration || 0);
    const onMeta = () => {
      useOS.getState().setHasAudio(true);
      useOS.getState()._syncTime(el.currentTime, el.duration || 0);
    };
    const onEnded = () => useOS.getState()._onEnded();
    const onErr = () => useOS.getState().setHasAudio(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onErr);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onErr);
    };
  }, []);

  // seed playlist once
  useEffect(() => {
    if (useOS.getState().playlist.length === 0) setPlaylist(PLAYLIST);
  }, [setPlaylist]);

  // load new track src when index changes
  useEffect(() => {
    const el = getAudio();
    const track = playlist[trackIndex];
    if (!el || !track) return;
    if (el.dataset.src !== track.src) {
      el.src = track.src ?? "";
      el.dataset.src = track.src ?? "";
      el.load();
    }
  }, [playlist, trackIndex]);

  // play / pause — guard the promise so autoplay rejection doesn't throw
  useEffect(() => {
    const el = getAudio();
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => {
        // autoplay blocked until a user gesture; the first gesture (below) starts it
      });
    } else {
      el.pause();
    }
  }, [isPlaying, trackIndex, playlist]);

  // if autoplay was blocked, start on the very first user gesture anywhere
  useEffect(() => {
    const kick = () => {
      const el = getAudio();
      if (el && el.paused && useOS.getState().isPlaying) el.play().catch(() => {});
    };
    const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    events.forEach((ev) => window.addEventListener(ev, kick, { passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, kick));
  }, []);

  // volume
  useEffect(() => {
    const el = getAudio();
    if (el) el.volume = volume;
  }, [volume]);

  // apply user seeks
  useEffect(() => {
    const el = getAudio();
    if (el && pendingSeek != null && Number.isFinite(pendingSeek)) {
      try {
        el.currentTime = pendingSeek;
      } catch {
        /* not seekable yet */
      }
      useOS.setState({ pendingSeek: null });
    }
  }, [pendingSeek]);

  // Fallback ticker: until real MP3s are dropped in /public/music, keep the
  // player UI (progress bar, island, lyrics) alive with a virtual clock.
  useEffect(() => {
    if (hasAudio || !isPlaying) return;
    const FAKE_DURATION = 210;
    useOS.setState((s) => ({ duration: s.duration || FAKE_DURATION }));
    const t = setInterval(() => {
      const s = useOS.getState();
      const d = s.duration || FAKE_DURATION;
      if (s.currentTime + 1 >= d) s.next();
      else s._syncTime(s.currentTime + 1, d);
    }, 1000);
    return () => clearInterval(t);
  }, [hasAudio, isPlaying, trackIndex]);

  // the element lives on `window`, so nothing to render
  return null;
}

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

/**
 * Start playback as robustly as the browser allows.
 * 1. Try to play with sound (works on localhost / sites the user has engaged
 *    with, and after any gesture).
 * 2. If that's blocked by the autoplay policy, play MUTED — muted autoplay is
 *    always permitted, so the track is already rolling silently and just needs
 *    to be unmuted (on unlock, or the first gesture) to become audible.
 */
function startAudio() {
  const el = getAudio();
  if (!el || !useOS.getState().isPlaying) return;
  el.play().catch(() => {
    el.muted = true;
    el.play().catch(() => {});
  });
}

/** Make the (possibly muted-primed) audio audible — call on unlock / gesture. */
function unmuteAudio() {
  const el = getAudio();
  if (!el || !useOS.getState().isPlaying) return;
  el.muted = false;
  if (el.paused) el.play().catch(() => {});
}

export default function AudioEngine() {
  const setPlaylist = useOS((s) => s.setPlaylist);
  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const isPlaying = useOS((s) => s.isPlaying);
  const phase = useOS((s) => s.phase);
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

  // play / pause — start (with the muted-autoplay fallback) or pause
  useEffect(() => {
    const el = getAudio();
    if (!el) return;
    if (isPlaying) startAudio();
    else el.pause();
  }, [isPlaying, trackIndex, playlist]);

  // Unlock → home: make the audio audible. Covers ALL unlock paths (tap, scroll,
  // and the automatic video-end unlock), unmuting whatever was primed silently.
  useEffect(() => {
    if (phase === "home") unmuteAudio();
  }, [phase]);

  // Any user gesture anywhere is a guaranteed moment we can start + unmute audio.
  useEffect(() => {
    const kick = () => unmuteAudio();
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

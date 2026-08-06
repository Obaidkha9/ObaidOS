"use client";

import { create } from "zustand";

export type Phase = "locked" | "home";
export type IslandMode = "idle" | "music" | "context";

/* ---- responsive tiers ------------------------------------------------ */
/* mobile  < 768  · tablet 768–1279 · laptop 1280–1919 · desktop ≥ 1920   */
export type Tier = "mobile" | "tablet" | "laptop" | "desktop";

export function tierOf(w: number): Tier {
  if (w < 768) return "mobile";
  if (w < 1280) return "tablet";
  if (w < 1920) return "laptop";
  return "desktop";
}

/* Fluid up-scale for large displays. Everything on the home canvas grows
   proportionally past the laptop tier so a 4K screen never looks sparse.
   Returns 1 below 1600px, then eases up to a sane ceiling. */
export function uiScaleOf(w: number): number {
  if (w < 1600) return 1;
  return Math.min(1.6, w / 1600);
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  artwork: string; // gradient css fallback
  cover?: string; // optional local cover image (takes priority over the live iTunes fetch)
  lyrics?: { time: number; text: string }[];
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WinState {
  key: string; // unique window instance id
  appId: string;
  originRect: Rect; // icon position the window grows from
  payload: string | null; // optional deep-link (e.g. a project id)
  context: string | null; // Dynamic Island label
  offset: number; // fixed cascade offset (px) so focus reorders z without moving
  z: number; // z-order (higher = on top); bumped on focus WITHOUT reordering the array
  minimized: boolean; // parked in the dock (kept mounted so scroll/state resumes)
}

interface OSState {
  /* ---- phase / booting ---- */
  phase: Phase;
  booted: boolean;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  unlock: () => void;
  lock: () => void;

  /* ---- viewport (single source of truth for responsive behaviour) ---- */
  vw: number;
  vh: number;
  tier: Tier;
  setViewport: (w: number, h: number) => void;

  /* ---- open apps (macOS-style multi-window) ---- */
  windows: WinState[]; // order === z-order; last item is focused / on top
  winSeq: number;
  openApp: (id: string, rect: Rect, payload?: string) => void;
  closeWindow: (key: string) => void;
  focusWindow: (key: string) => void;
  minimizeWindow: (key: string) => void;
  restoreWindow: (key: string) => void;

  /* ---- dynamic island ---- */
  islandMode: IslandMode;
  islandExpanded: boolean;
  contextLabel: string | null;
  setContext: (label: string | null) => void;
  setIslandMode: (m: IslandMode) => void;
  toggleIslandExpanded: (v?: boolean) => void;

  /* ---- music ---- */
  playlist: Track[];
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  pendingSeek: number | null;
  hasAudio: boolean; // becomes true once a real src loads
  setPlaylist: (t: Track[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
  _syncTime: (t: number, d: number) => void;
  _onEnded: () => void;
  setHasAudio: (v: boolean) => void;
}

export const useOS = create<OSState>((set, get) => ({
  phase: "locked",
  booted: false,
  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),

  /* 0×0 until measured on the client (same as the old local vp state) so SSR
     and first paint stay deterministic; corrected on mount + resize. */
  vw: 0,
  vh: 0,
  tier: "mobile",
  setViewport: (w, h) =>
    set((s) => {
      const tier = tierOf(w);
      if (s.vw === w && s.vh === h && s.tier === tier) return {};
      return { vw: w, vh: h, tier };
    }),

  unlock: () => {
    set({ phase: "home" });
    // start music on unlock if not already
    if (!get().isPlaying) get().play();
  },
  lock: () => set({ phase: "locked", windows: [] }),

  windows: [],
  winSeq: 1,
  openApp: (id, rect, payload) =>
    set((s) => {
      const context = s.contextLabel; // set by the launcher just before
      // Case-study windows (the "projects" app) may stack — one per project —
      // so we only reuse a window when the SAME case study is already open.
      // Every other app keeps a single window, reused on re-open.
      const nextZ = s.windows.reduce((m, w) => Math.max(m, w.z), 0) + 1;
      const existing =
        id === "projects"
          ? s.windows.find((w) => w.appId === id && (w.payload ?? null) === (payload ?? null))
          : s.windows.find((w) => w.appId === id);
      if (existing) {
        // Already open → just bring it to the front IN PLACE (bump z only).
        // We never reorder the array or touch originRect/offset, so the window
        // keeps its dragged position and its content is NOT remounted/reloaded.
        return {
          windows: s.windows.map((w) =>
            w.key === existing.key
              ? { ...w, z: nextZ, context, payload: payload ?? w.payload, minimized: false }
              : w,
          ),
          islandMode: "context",
        };
      }
      const key = `${id}-${s.winSeq}`;
      const win: WinState = {
        key,
        appId: id,
        originRect: rect,
        payload: payload ?? null,
        context,
        // every window opens dead-centre
        offset: 0,
        z: nextZ,
        minimized: false,
      };
      return {
        windows: [...s.windows, win],
        winSeq: s.winSeq + 1,
        islandMode: "context",
      };
    }),
  closeWindow: (key) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.key !== key);
      // the front-most remaining window is the one with the highest z
      const top = windows.reduce<WinState | null>(
        (best, w) => (!best || w.z > best.z ? w : best),
        null,
      );
      return {
        windows,
        islandMode: windows.length
          ? "context"
          : get().isPlaying
            ? "music"
            : "idle",
        contextLabel: top ? top.context : null,
      };
    }),
  focusWindow: (key) =>
    set((s) => {
      const win = s.windows.find((w) => w.key === key);
      const maxZ = s.windows.reduce((m, w) => Math.max(m, w.z), 0);
      // already on top → nothing to do
      if (!win || win.z === maxZ) return {};
      // bump z IN PLACE so the array order (and each window's drag position) is untouched
      return {
        windows: s.windows.map((w) => (w.key === key ? { ...w, z: maxZ + 1 } : w)),
        islandMode: "context",
        contextLabel: win.context,
      };
    }),
  minimizeWindow: (key) =>
    set((s) => {
      const windows = s.windows.map((w) =>
        w.key === key ? { ...w, minimized: true } : w,
      );
      // hand focus/context to the front-most window that's still on screen
      const top = windows
        .filter((w) => !w.minimized)
        .reduce<WinState | null>((best, w) => (!best || w.z > best.z ? w : best), null);
      return {
        windows,
        islandMode: top ? "context" : get().isPlaying ? "music" : "idle",
        contextLabel: top ? top.context : null,
      };
    }),
  restoreWindow: (key) =>
    set((s) => {
      const win = s.windows.find((w) => w.key === key);
      if (!win) return {};
      const maxZ = s.windows.reduce((m, w) => Math.max(m, w.z), 0);
      return {
        windows: s.windows.map((w) =>
          w.key === key ? { ...w, minimized: false, z: maxZ + 1 } : w,
        ),
        islandMode: "context",
        contextLabel: win.context,
      };
    }),

  islandMode: "idle",
  islandExpanded: false,
  contextLabel: null,
  setContext: (label) => set({ contextLabel: label }),
  setIslandMode: (m) => set({ islandMode: m }),
  toggleIslandExpanded: (v) =>
    set((s) => ({ islandExpanded: v ?? !s.islandExpanded })),

  playlist: [],
  trackIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  pendingSeek: null,
  hasAudio: false,
  setPlaylist: (t) => set({ playlist: t }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () =>
    set((s) => ({
      trackIndex:
        s.playlist.length === 0
          ? 0
          : (s.trackIndex + 1) % s.playlist.length,
      currentTime: 0,
      isPlaying: true,
    })),
  prev: () =>
    set((s) => {
      // restart if past 3s, else previous track (iOS behaviour)
      if (s.currentTime > 3) return { currentTime: 0 };
      return {
        trackIndex:
          s.playlist.length === 0
            ? 0
            : (s.trackIndex - 1 + s.playlist.length) % s.playlist.length,
        currentTime: 0,
        isPlaying: true,
      };
    }),
  seek: (t) => set({ currentTime: t, pendingSeek: t }),
  setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
  _syncTime: (t, d) => set({ currentTime: t, duration: d }),
  _onEnded: () => get().next(),
  setHasAudio: (v) => set({ hasAudio: v }),
}));

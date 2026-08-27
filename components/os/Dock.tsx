"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import AppIcon from "./AppIcon";
import { HOME_APPS, getApp, type AppMeta } from "@/lib/apps";
import { PROJECTS } from "@/lib/content";
import { useOS, type WinState } from "@/lib/store";
import { asset } from "@/lib/asset";

/* cover art used as the minimized "page" thumbnail for each case study */
const PROJECT_COVER: Record<string, string> = {
  "employee-portal": asset("/employee-portal-attendance-v2.webp"),
  "ask-ai": asset("/askai.webp"),
  carwaalah: asset("/carwaalah-card.jpg"),
  "youtube-redesign": asset("/youtube.webp"),
  "design-system": asset("/designsystem.webp"),
  "focus-forge": asset("/focus-forge.webp"),
};

/* cover art for windows that don't have a dock icon (e.g. games) */
const WINDOW_THUMB: Record<string, string> = {
  snake: asset("/snake.webp"),
  tictactoe: asset("/tictactoe.webp"),
};

function minimizedThumb(win: WinState) {
  const app = getApp(win.appId);
  if (win.appId === "projects" && win.payload && PROJECT_COVER[win.payload]) {
    const proj = PROJECTS.find((p) => p.id === win.payload);
    return { src: PROJECT_COVER[win.payload], label: proj?.name ?? "Case Study", cover: true };
  }
  if (win.appId === "preview" && win.payload) {
    try {
      const p = JSON.parse(win.payload);
      if (p.src) return { src: p.src as string, label: (p.name as string) ?? "Preview", cover: true };
    } catch {
      /* ignore */
    }
  }
  if (WINDOW_THUMB[win.appId]) {
    return { src: WINDOW_THUMB[win.appId], label: win.context ?? app?.name ?? "Window", cover: true };
  }
  return { src: asset(`/icons/${win.appId}.png`), label: win.context ?? app?.name ?? "Window", cover: false };
}

/* Custom dock-only icons (drawn via AppArt), routed to existing apps. */
const CONTACTS: AppMeta = {
  id: "contacts",
  name: "Contacts",
  glyph: "contacts",
  bg: "",
  context: "Contact",
};

/* - "experience" (Finder-face) dock icon → Finder opened at the Projects section
   - "about" dock icon → Finder opened at the About Me section
   phone / mail / timeline are intentionally hidden from the dock. */
const DOCK_ITEMS: AppMeta[] = [
  CONTACTS,
  ...HOME_APPS
    // Projects app is folded into Finder; timeline is hidden from the dock
    .filter((a) => a.id !== "projects" && a.id !== "timeline")
    .map((a) =>
      a.id === "experience"
        ? { ...a, name: "Projects", route: "finder", payload: "projects", context: "Projects" }
        : a.id === "about"
          ? { ...a, route: "finder", payload: "about", context: "About Obaid" }
          : a,
    ),
];

/* Magnification tuning. Each slot keeps a FIXED footprint (so the dock and the
   home-screen layout never reflow); only the icon scales via a transform. */
const SLOT = 52; // px — fixed slot size, never changes
const PEAK = 1.24; // scale directly under the cursor
const RANGE = 100; // cursor distance over which the swell falls off

/** Frosted iPad dock with macOS-style cursor magnification (transform-only). */
export default function Dock() {
  const reduced = useOS((s) => s.reducedMotion);
  const windows = useOS((s) => s.windows);
  const restoreWindow = useOS((s) => s.restoreWindow);
  const tier = useOS((s) => s.tier);
  const isMobile = tier === "mobile";
  const showLabels = tier === "mobile" || tier === "tablet";
  const minimized = windows.filter((w) => w.minimized);
  const mouseX = useMotionValue(Infinity);
  // Phones can't fit ~9 slots across; shrink each slot and let the pill scroll
  // horizontally instead of overflowing the viewport.
  const slot = isMobile ? 56 : SLOT;

  // a window "belongs" to a dock icon when that icon opens the same app
  // (the Finder is one window, reached from About Me / Projects). Those
  // minimize INTO their existing icon instead of adding a separate tile.
  const dockAppIds = new Set(DOCK_ITEMS.map((d) => d.route ?? d.id));
  const parkedTiles = minimized.filter((w) => !dockAppIds.has(w.appId));

  return (
    <div className="flex items-center justify-center gap-3 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-1">
      <div
        data-dock
        onMouseMove={(e) => !reduced && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex w-fit max-w-full items-end rounded-[26px] bg-[#2d2d33]/94 backdrop-blur-xl px-3 py-2 shadow-2xl ring-1 ring-white/10 ${
          isMobile ? "dock-scroll gap-2.5 overflow-x-auto" : "gap-2.5"
        }`}
      >
        {DOCK_ITEMS.map((app, i) => {
          const hasMinimized = minimized.some((w) => w.appId === (app.route ?? app.id));
          return (
            <DockItem key={app.id} mouseX={mouseX} reduced={reduced} label={app.name} slot={slot}>
              <AppIcon app={app} label={showLabels} index={i} />
              {hasMinimized && (
                <span className="pointer-events-none absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80" />
              )}
            </DockItem>
          );
        })}

        {/* minimized windows without a dock icon (case studies, games) */}
        <AnimatePresence>
          {parkedTiles.length > 0 && (
            <motion.div
              key="min-divider"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 1 }}
              exit={{ opacity: 0, width: 0 }}
              className="mx-0.5 h-9 w-px shrink-0 self-center bg-white/15"
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {parkedTiles.map((win) => {
            const t = minimizedThumb(win);
            return (
              <motion.div
                key={win.key}
                layout
                initial={{ opacity: 0, scale: 0.3, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: 18 }}
                transition={{ type: "spring", stiffness: 460, damping: 30 }}
              >
                <DockItem mouseX={mouseX} reduced={reduced} label={t.label} slot={slot}>
                  <div className="flex select-none flex-col items-center gap-1.5">
                    <button
                      onClick={() => restoreWindow(win.key)}
                      aria-label={`Restore ${t.label}`}
                      className="group relative block aspect-square w-full max-w-[64px] transition-transform active:scale-90"
                    >
                      {/* inset 9% to match the macOS icons' baked-in padding */}
                      <span className="absolute inset-[9%] overflow-hidden rounded-[22.5%] bg-[#1c1c1e] shadow-[0_8px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.src}
                          alt=""
                          draggable={false}
                          className={`h-full w-full ${t.cover ? "object-cover" : "object-contain p-1"}`}
                        />
                      </span>
                    </button>
                    {showLabels && (
                      <span className="max-w-[68px] truncate text-[11px] font-medium text-white/90 drop-shadow">
                        {t.label}
                      </span>
                    )}
                  </div>
                </DockItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DockItem({
  mouseX,
  reduced,
  label,
  slot = SLOT,
  children,
}: {
  mouseX: MotionValue<number>;
  reduced: boolean;
  label: string;
  slot?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // signed distance from cursor to this slot's horizontal centre
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return RANGE + 1;
    return x - (box.x + box.width / 2);
  });

  const scaleSync = useTransform(distance, [-RANGE, 0, RANGE], [1, PEAK, 1]);
  const scale = useSpring(scaleSync, { mass: 0.08, stiffness: 320, damping: 16 });

  return (
    // fixed footprint — layout never changes; the icon scales upward on top
    <div
      ref={ref}
      style={{ width: slot }}
      className="relative flex shrink-0 justify-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* macOS-style tooltip above the icon */}
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-4 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#2d2d33]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white shadow-lg ring-1 ring-white/10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        style={reduced ? undefined : { scale, transformOrigin: "bottom center" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

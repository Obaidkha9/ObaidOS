"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  animate,
} from "framer-motion";
import { useOS, type WinState } from "@/lib/store";
import { getApp } from "@/lib/apps";
import { spring } from "@/lib/utils";
import type { AppProps } from "@/components/apps/AppChrome";

/* Lazy-load app bodies so the shell stays light (perf / code-splitting). */
const REGISTRY: Record<string, ComponentType<AppProps>> = {
  about: dynamic(() => import("@/components/apps/NotesApp")),
  experience: dynamic(() => import("@/components/apps/FilesApp")),
  timeline: dynamic(() => import("@/components/apps/TimelineApp")),
  projects: dynamic(() => import("@/components/apps/ProjectsApp")),
  camera: dynamic(() => import("@/components/apps/CameraApp")),
  photos: dynamic(() => import("@/components/apps/PhotosApp")),
  music: dynamic(() => import("@/components/apps/MusicApp")),
  resume: dynamic(() => import("@/components/apps/ResumeApp")),
  mail: dynamic(() => import("@/components/apps/MailApp")),
  contact: dynamic(() => import("@/components/apps/MailApp")),
  contacts: dynamic(() => import("@/components/apps/ContactCardApp")),
  tictactoe: dynamic(() => import("@/components/apps/TicTacToeApp")),
  snake: dynamic(() => import("@/components/apps/SnakeApp")),
  flappybird: dynamic(() => import("@/components/apps/FlappyBirdApp")),
  dino: dynamic(() => import("@/components/apps/DinoRunApp")),
  connectfour: dynamic(() => import("@/components/apps/ConnectFourApp")),
  pong: dynamic(() => import("@/components/apps/PongApp")),
  breakout: dynamic(() => import("@/components/apps/BreakoutApp")),
  whackamole: dynamic(() => import("@/components/apps/WhackAMoleApp")),
  simon: dynamic(() => import("@/components/apps/SimonApp")),
  finder: dynamic(() => import("@/components/apps/FinderApp")),
  preview: dynamic(() => import("@/components/apps/PreviewApp")),
};

/* apps that render their own unified toolbar + traffic lights (no title bar) */
const CHROMELESS = new Set(["finder", "preview"]);

/* apps that want a compact window sized to their content (not the default large frame) */
const APP_SIZE: Record<string, { w: number; h: number }> = {
  contacts: { w: 660, h: 450 },
  photos: { w: 1140, h: 840 },
  preview: { w: 860, h: 640 },
  projects: { w: 1240, h: 860 },
  music: { w: 900, h: 620 },
  // portrait document — tall so more of the résumé page is visible (capped to
  // the viewport height by the sizing logic below)
  resume: { w: 820, h: 1000 },
  tictactoe: { w: 430, h: 520 },
  snake: { w: 470, h: 600 },
  flappybird: { w: 380, h: 610 },
  dino: { w: 660, h: 400 },
  connectfour: { w: 440, h: 560 },
  pong: { w: 660, h: 470 },
  breakout: { w: 460, h: 590 },
  whackamole: { w: 440, h: 560 },
  simon: { w: 430, h: 560 },
};

function TrafficLights({
  focused,
  onClose,
  onMin,
  onMax,
}: {
  focused: boolean;
  onClose: (e: React.MouseEvent) => void;
  onMin: (e: React.MouseEvent) => void;
  onMax: (e: React.MouseEvent) => void;
}) {
  const dot =
    "relative flex h-3 w-3 items-center justify-center rounded-full ring-1 ring-black/20 active:brightness-90";
  const gl = "opacity-0 transition-opacity group-hover/lights:opacity-100";
  const c = (color: string) => (focused ? color : "#4b4b4d");
  return (
    <div
      className="group/lights flex items-center gap-2"
      onDoubleClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button aria-label="Close window" onClick={onClose} className={dot} style={{ background: c("#ff5f57") }}>
        <svg className={gl} width="7" height="7" viewBox="0 0 10 10" stroke="#4d0000" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
        </svg>
      </button>
      <button aria-label="Minimize window" onClick={onMin} className={dot} style={{ background: c("#febc2e") }}>
        <svg className={gl} width="7" height="7" viewBox="0 0 10 10" stroke="#663d00" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 5h6" />
        </svg>
      </button>
      <button aria-label="Zoom window" onClick={onMax} className={dot} style={{ background: c("#28c840") }}>
        <svg className={gl} width="8" height="8" viewBox="0 0 10 10" fill="#0b4d17">
          <path d="M2 2.4h3.4L2 5.8zM8 7.6H4.6L8 4.2z" />
        </svg>
      </button>
    </div>
  );
}

function WindowFrame({
  win,
  index,
  focused,
  vp,
  reduced,
  onClose,
  onMinimize,
  onFocus,
}: {
  win: WinState;
  index: number;
  focused: boolean;
  vp: { w: number; h: number };
  reduced: boolean;
  onClose: (key: string) => void;
  onMinimize: (key: string) => void;
  onFocus: (key: string) => void;
}) {
  const [maximized, setMaximized] = useState(false);
  const [exitMode, setExitMode] = useState<"icon" | "dock">("icon");
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const isDesktop = vp.w >= 768;
  const app = getApp(win.appId);
  const Body = REGISTRY[win.appId];
  if (!app || !Body) return null;

  // Tier-aware window sizing: on big displays, generic content windows grow
  // (so they don't sit tiny on a 4K screen) and compact apps get a gentle bump.
  const compactScale = vp.w >= 2560 ? 1.35 : vp.w >= 1920 ? 1.18 : 1;
  const genCapW = vp.w >= 1920 ? 1500 : 1040;
  const genCapH = vp.h >= 1200 ? 1000 : 720;
  const sized = APP_SIZE[win.appId];
  const winW = sized
    ? Math.min(Math.round(sized.w * compactScale), vp.w - 40)
    : Math.min(genCapW, Math.round(vp.w * 0.82));
  const winH = sized
    ? Math.min(Math.round(sized.h * compactScale), vp.h - 40)
    : Math.min(genCapH, Math.round(vp.h * 0.84));
  const floating = {
    width: winW,
    height: winH,
    left: Math.round((vp.w - winW) / 2) + win.offset,
    top: Math.round((vp.h - winH) / 2 - 10) + win.offset,
    borderRadius: 14,
  };
  const full = {
    width: vp.w || 1200,
    height: vp.h || 800,
    left: 0,
    top: 0,
    borderRadius: 0,
  };
  const target = !isDesktop || maximized ? full : floating;

  // Keep the title bar (and its traffic-light controls) reachable no matter how
  // far the window is dragged — the top-left corner always stays on screen.
  const MARGIN = 8; // px kept from the top/left edges
  const TITLE = 44; // title-bar height that must remain visible
  const DOCK = 96; // reserved dock strip at the bottom
  const KEEP = 140; // px of the window kept on the right when pushed off-screen
  const dragConstraints = {
    left: MARGIN - floating.left,
    right: Math.max(MARGIN - floating.left, vp.w - KEEP - floating.left),
    top: MARGIN - floating.top,
    bottom: Math.max(MARGIN - floating.top, vp.h - DOCK - TITLE - floating.top),
  };

  const from = {
    top: win.originRect.y,
    left: win.originRect.x,
    width: win.originRect.width,
    height: win.originRect.height,
    borderRadius: 16,
    opacity: 0,
  };
  const to = { ...target, opacity: 1 };
  // parked-in-the-dock state — the window shrinks toward the dock but stays
  // mounted (so its scroll position / content resumes on restore)
  const dockRect = {
    top: vp.h - 66,
    left: vp.w / 2 - 40,
    width: 80,
    height: 54,
    borderRadius: 12,
    opacity: 0,
  };
  const exit =
    exitMode === "dock" ? dockRect : { ...from, opacity: 0 };

  const toggleMax = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isDesktop) return;
    animate(x, 0, spring.soft);
    animate(y, 0, spring.soft);
    setMaximized((m) => !m);
  };
  const doClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExitMode("icon");
    onClose(win.key);
  };
  const doMin = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    // reset any drag transform so the shrink lands cleanly on the dock
    animate(x, 0, spring.soft);
    animate(y, 0, spring.soft);
    onMinimize(win.key);
  };
  const startDrag = (e: ReactPointerEvent) => {
    onFocus(win.key);
    if (isDesktop && !maximized && !reduced) controls.start(e);
  };

  return (
    <motion.div
      data-window
      className="fixed flex flex-col overflow-hidden bg-black text-white ring-1 ring-white/10"
      style={{
        x,
        y,
        zIndex: 30 + win.z,
        pointerEvents: win.minimized ? "none" : undefined,
        boxShadow: focused
          ? "0 30px 90px -15px rgba(0,0,0,0.78)"
          : "0 18px 50px -20px rgba(0,0,0,0.6)",
      }}
      initial={reduced ? { ...to, opacity: 0 } : from}
      animate={win.minimized ? dockRect : to}
      exit={reduced ? { opacity: 0 } : exit}
      transition={reduced ? { duration: 0.15 } : spring.app}
      drag={isDesktop && !maximized && !reduced && !win.minimized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.03}
      dragConstraints={dragConstraints}
      onPointerDownCapture={() => onFocus(win.key)}
    >
      {/* macOS title bar (hidden for chromeless apps that draw their own) */}
      {!CHROMELESS.has(win.appId) && (
        <div
          onPointerDown={startDrag}
          onDoubleClick={toggleMax}
          className="flex h-10 shrink-0 cursor-default select-none items-center gap-3 px-4"
          style={{ background: "#1c1c1e", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <TrafficLights focused={focused} onClose={doClose} onMin={doMin} onMax={toggleMax} />
          <span
            className={`truncate text-[13px] font-semibold ${
              focused ? "text-white/70" : "text-white/40"
            }`}
          >
            {app.name}
          </span>
        </div>
      )}

      {/* content */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <Body
          onClose={doClose}
          payload={win.payload}
          onMinimize={doMin}
          onToggleMax={toggleMax}
          startDrag={startDrag}
          focused={focused}
        />
      </div>
    </motion.div>
  );
}

export default function AppWindow() {
  const windows = useOS((s) => s.windows);
  const closeWindow = useOS((s) => s.closeWindow);
  const focusWindow = useOS((s) => s.focusWindow);
  const minimizeWindow = useOS((s) => s.minimizeWindow);
  const reduced = useOS((s) => s.reducedMotion);

  const vw = useOS((s) => s.vw);
  const vh = useOS((s) => s.vh);
  const vp = { w: vw, h: vh };

  // Escape closes the focused (top) window
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const ws = useOS.getState().windows;
      const top = ws
        .filter((w) => !w.minimized)
        .reduce<(typeof ws)[number] | null>(
          (best, w) => (!best || w.z > best.z ? w : best),
          null,
        );
      if (top) closeWindow(top.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeWindow]);

  // the focused window is the front-most one that isn't parked in the dock
  const topVisibleZ = windows
    .filter((w) => !w.minimized)
    .reduce((m, w) => Math.max(m, w.z), 0);
  return (
    <AnimatePresence>
      {windows.map((win, i) => (
        <WindowFrame
          key={win.key}
          win={win}
          index={i}
          focused={!win.minimized && win.z === topVisibleZ}
          vp={vp}
          reduced={reduced}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
        />
      ))}
    </AnimatePresence>
  );
}

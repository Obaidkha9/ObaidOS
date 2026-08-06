"use client";

import { useEffect } from "react";
import { useOS } from "@/lib/store";
import AudioEngine from "./AudioEngine";
import DynamicIsland from "./DynamicIsland";
import LockScreen from "./LockScreen";
import HomeScreen from "./HomeScreen";
import AppWindow from "./AppWindow";

export default function OSShell() {
  const phase = useOS((s) => s.phase);
  const setReducedMotion = useOS((s) => s.setReducedMotion);
  const setViewport = useOS((s) => s.setViewport);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [setReducedMotion]);

  // Single viewport listener for the whole OS — every responsive decision
  // reads `tier` / `vw` / `vh` from the store instead of touching `window`.
  useEffect(() => {
    const set = () => setViewport(window.innerWidth, window.innerHeight);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [setViewport]);

  // Clicking the empty desktop (outside any window / dock / island) minimizes
  // the active window — like tucking it away to peek at the home screen.
  const onBackdropDown = (e: React.PointerEvent) => {
    if (useOS.getState().tier === "mobile") return; // full-screen windows on mobile
    const t = e.target as HTMLElement;
    if (t.closest("[data-window]") || t.closest("[data-dock]") || t.closest("[data-island]")) return;
    const st = useOS.getState();
    const top = st.windows
      .filter((w) => !w.minimized)
      .reduce<(typeof st.windows)[number] | null>(
        (best, w) => (!best || w.z > best.z ? w : best),
        null,
      );
    if (top) st.minimizeWindow(top.key);
  };

  return (
    <main className="os-root bg-black" onPointerDown={onBackdropDown}>
      <AudioEngine />

      {/* Home is always mounted; the Lock Screen sits on top and lifts away to
          reveal it (macOS-style), so the transition is seamless. */}
      <HomeScreen />
      {phase === "locked" && <LockScreen />}

      <AppWindow />

      {/* Dynamic Island is always mounted, always on top */}
      <DynamicIsland />
    </main>
  );
}

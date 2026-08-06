"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useOS } from "@/lib/store";
import Wallpaper from "./Wallpaper";
import LockButton from "./LockButton";

export default function LockScreen() {
  const unlock = useOS((s) => s.unlock);
  const play = useOS((s) => s.play);
  const reduced = useOS((s) => s.reducedMotion);

  // prime the music as the lock screen loads; the unlock tap (a real user
  // gesture) is what guarantees the browser lets it play — see AudioEngine.
  useEffect(() => {
    play();
  }, [play]);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick); // first paint, client-only
    const t = setInterval(tick, 1000 * 15);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);

  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useTransform(y, [-260, -40, 0], [0, 0.85, 1]);
  const locked = useRef(true);

  // Tap-only unlock — a click/tap (or Enter/Space) is a guaranteed user gesture,
  // so the music always starts. No swipe, wheel, or auto-unlock (those don't
  // count as gestures, which would leave the audio blocked).
  const doUnlock = () => {
    if (!locked.current) return;
    locked.current = false;
    play();
    const dur = reduced ? 0.001 : 0.6;
    // macOS-style reveal: lift + subtle zoom-in + fade, unveiling the desktop.
    animate(scale, 1.1, { duration: dur, ease: [0.32, 0.72, 0, 1] });
    animate(y, -window.innerHeight * 0.6, {
      duration: dur,
      ease: [0.32, 0.72, 0, 1],
      onComplete: unlock,
    });
  };

  const clock = now
    ? `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`
    : "--:--";
  const date = now
    ? now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <motion.div className="os-root z-40 select-none" style={{ y, scale, opacity }}>
      <Wallpaper mode="video" />

      {/* clock + date */}
      <div className="relative z-10 flex h-full flex-col items-center pt-[7vh]">
        <p className="text-sm font-medium tracking-wide text-white/70">{date}</p>
        <h1 className="mt-1 text-[13vw] font-bold leading-none tracking-tight text-white drop-shadow-2xl sm:text-[82px]">
          {clock}
        </h1>

        {/* tappable padlock — tap swings it open, then unlocks (a gesture → music plays) */}
        <LockButton onUnlock={doUnlock} />
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useOS } from "@/lib/store";
import Wallpaper from "./Wallpaper";

export default function LockScreen() {
  const unlock = useOS((s) => s.unlock);
  const play = useOS((s) => s.play);
  const reduced = useOS((s) => s.reducedMotion);

  // start the music as soon as the lock screen loads (autoplay is retried on
  // the first user gesture by the AudioEngine if the browser blocks it here)
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
  const hint = useTransform(y, [-80, 0], [0, 1]);
  const locked = useRef(true);

  const doUnlock = (auto = false) => {
    if (!locked.current) return;
    locked.current = false;
    // macOS-style reveal: lift + subtle zoom-in + fade, unveiling the desktop.
    // the automatic (video-end) unlock plays a touch slower for a gentler reveal.
    const dur = reduced ? 0.001 : auto ? 1.0 : 0.6;
    animate(scale, 1.1, { duration: dur, ease: [0.32, 0.72, 0, 1] });
    animate(y, -window.innerHeight * 0.6, {
      duration: dur,
      ease: [0.32, 0.72, 0, 1],
      onComplete: unlock,
    });
  };

  // wheel-up to unlock (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -18) doUnlock();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <motion.div
      className="os-root z-40"
      style={{ y, scale, opacity }}
      onPointerDown={() => play()}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.9, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -110 || info.velocity.y < -550) doUnlock();
        else animate(y, 0, { type: "spring", stiffness: 400, damping: 40 });
      }}
    >
      <Wallpaper mode="video" onEnded={() => doUnlock(true)} />

      {/* clock + date */}
      <div className="relative z-10 flex h-full flex-col items-center pt-[7vh]">
        <motion.p
          style={{ opacity: hint }}
          className="text-sm font-medium tracking-wide text-white/70"
        >
          {date}
        </motion.p>
        <h1 className="mt-1 text-[13vw] font-bold leading-none tracking-tight text-white drop-shadow-2xl sm:text-[82px]">
          {clock}
        </h1>

        {/* swipe up hint */}
        <button
          onClick={() => doUnlock()}
          aria-label="Unlock — swipe up"
          className="mt-auto flex flex-col items-center gap-0.5 pb-[7vh]"
        >
          <motion.svg
            animate={reduced ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="opacity-80"
          >
            <path d="M6 14l6-6 6 6" />
          </motion.svg>
          <span className="text-xs font-medium tracking-wide text-white/70">
            Swipe up to open Obaid OS
          </span>
        </button>
      </div>
    </motion.div>
  );
}

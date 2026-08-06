"use client";

import { motion } from "framer-motion";
import { useOS } from "@/lib/store";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/*  macOS-style gradient wallpapers.                                   */
/*  Switch the default by changing ACTIVE, or drop in a photo:         */
/*  set ACTIVE = "photo" and put wallpaper.jpg in /public.             */
/* ------------------------------------------------------------------ */

type Blob = { c: string; x: string; y: string; s: string };
type Preset = { base: string; blobs: Blob[] };

const PRESETS: Record<string, Preset> = {
  // macOS Sequoia — deep blue → indigo → violet (matches #0F53FC accent)
  sequoia: {
    base: "linear-gradient(160deg,#05060f 0%,#0a1030 48%,#150a34 100%)",
    blobs: [
      { c: "#0f53fc", x: "-12%", y: "-14%", s: "72vh" },
      { c: "#3b74ff", x: "58%", y: "-8%", s: "60vh" },
      { c: "#6a2cff", x: "62%", y: "48%", s: "64vh" },
      { c: "#8f00ff", x: "8%", y: "60%", s: "58vh" },
      { c: "#1e3a8a", x: "35%", y: "30%", s: "50vh" },
    ],
  },
  // macOS Sonoma — flowing multicolor
  sonoma: {
    base: "linear-gradient(160deg,#0a0618 0%,#241033 50%,#3a1030 100%)",
    blobs: [
      { c: "#0f53fc", x: "-10%", y: "-10%", s: "66vh" },
      { c: "#8f00ff", x: "55%", y: "-5%", s: "60vh" },
      { c: "#ff2d78", x: "60%", y: "50%", s: "58vh" },
      { c: "#ff9f0a", x: "5%", y: "58%", s: "56vh" },
    ],
  },
  // macOS Big Sur — warm sunset
  bigSur: {
    base: "linear-gradient(160deg,#0d0714 0%,#3a1230 55%,#5a1f2e 100%)",
    blobs: [
      { c: "#8f00ff", x: "-8%", y: "-5%", s: "60vh" },
      { c: "#ff2d78", x: "55%", y: "10%", s: "60vh" },
      { c: "#ff7a1a", x: "40%", y: "55%", s: "64vh" },
      { c: "#ffd60a", x: "10%", y: "70%", s: "46vh" },
    ],
  },
};

type Mode = keyof typeof PRESETS | "photo" | "video" | "tahoe";
const ACTIVE: Mode = "photo";
const PHOTO_SRC = asset("/arsenal-heritage.webp");
const VIDEO_SRC = asset("/arsenal.mp4");
const VIDEO_WEBM = asset("/arsenal.webm");

/** `mode` overrides the default wallpaper — the lock screen passes "video",
    the unlocked home screen passes "photo". */
export default function Wallpaper({
  dim = false,
  mode = ACTIVE,
  onEnded,
}: {
  dim?: boolean;
  mode?: Mode;
  /** fired when the video wallpaper reaches the end of its content loop */
  onEnded?: () => void;
}) {
  const reduced = useOS((s) => s.reducedMotion);

  if (mode === "tahoe") {
    // macOS-Tahoe dark base with a very subtle crimson atmosphere (no glow)
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 100% at 82% 12%, rgba(122,22,22,0.30), transparent 55%)," +
              "radial-gradient(110% 90% at 12% 92%, rgba(42,13,13,0.65), transparent 60%)," +
              "linear-gradient(160deg,#0a0a0a 0%,#111111 52%,#171717 100%)",
          }}
        />
        {/* faint top + bottom vignette to seat the widgets */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        {dim && <div className="absolute inset-0 bg-black/35" />}
      </div>
    );
  }

  if (mode === "video") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* portrait (720x1280) source rotated 90° left → fills as 16:9 widescreen */}
        <video
          className="absolute left-1/2 top-1/2 object-cover"
          style={{
            width: "100vh",
            height: "100vw",
            transform: "translate(-50%, -50%) rotate(-90deg)",
          }}
          poster={PHOTO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // trim: loop back before the "JDB PLAYZ / subscribe" outro (~24s)
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.currentTime >= 23.8) {
              v.currentTime = 0;
              onEnded?.();
            }
          }}
        >
          {/* WebM (VP9) first for Chrome/Firefox/Edge; mp4 fallback for Safari */}
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        {/* top + bottom scrims keep the clock, status bar and dock legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.32) 100%)",
          }}
        />
        {dim && <div className="absolute inset-0 bg-black/35" />}
      </div>
    );
  }

  if (mode === "photo") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PHOTO_SRC})` }}
        />
        {/* top + bottom scrims keep the clock, status bar and dock legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.32) 100%)",
          }}
        />
        {dim && <div className="absolute inset-0 bg-black/35" />}
      </div>
    );
  }

  const preset = PRESETS[mode as keyof typeof PRESETS] ?? PRESETS.sequoia;

  return (
    <div
      className="absolute inset-0 overflow-hidden noise"
      style={{ background: preset.base }}
    >
      {/* soft drifting colour blobs form the mesh gradient */}
      {preset.blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: `radial-gradient(circle at center, ${b.c}, transparent 68%)`,
            filter: "blur(70px)",
            opacity: 0.7,
            willChange: "transform",
          }}
          animate={
            reduced
              ? undefined
              : {
                  x: [0, i % 2 ? 26 : -26, 0],
                  y: [0, i % 2 ? -22 : 22, 0],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: 16 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* highlight sheen top-left, like macOS light source */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 0%, rgba(255,255,255,0.10), transparent 45%)",
        }}
      />
      {/* vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {dim && <div className="absolute inset-0 bg-black/25" />}
    </div>
  );
}

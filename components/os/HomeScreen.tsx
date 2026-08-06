"use client";

import { motion } from "framer-motion";
import { useOS, uiScaleOf } from "@/lib/store";
import Wallpaper from "./Wallpaper";
import HomeAesthetic from "./HomeAesthetic";
import Dock from "./Dock";

export default function HomeScreen() {
  const reduced = useOS((s) => s.reducedMotion);
  const phase = useOS((s) => s.phase);
  const isMobile = useOS((s) => s.tier === "mobile");
  const vw = useOS((s) => s.vw);

  // Fluid up-scale on large displays so the whole home canvas (status bar +
  // grid + dock) grows proportionally instead of leaving a 4K screen sparse.
  // `zoom` magnifies the subtree; the compensating calc() keeps it exactly
  // filling the viewport. Driven by real innerWidth → no media-query feedback.
  const scale = isMobile ? 1 : uiScaleOf(vw);
  const scaleStyle =
    scale > 1
      ? { zoom: scale, width: `calc(100% / ${scale})`, height: `calc(100% / ${scale})` }
      : undefined;

  return (
    <motion.div
      className="os-root z-10"
      initial={false}
      animate={{ scale: phase === "home" ? 1 : 1.08 }}
      transition={{ duration: reduced ? 0 : 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      <Wallpaper mode="photo" />
      <div className="relative z-10 flex h-full flex-col" style={scaleStyle}>
        {/* home canvas — iPad widget grid on tablet+, a scrollable stack on phones */}
        <div
          className={`relative min-h-0 flex-1 ${
            isMobile ? "app-scroll overflow-y-auto" : "overflow-hidden"
          }`}
        >
          <div
            className={
              isMobile
                ? "px-4 pb-6 pt-[calc(var(--safe-top)_+_16px)]"
                : "h-full px-6 py-3 sm:px-12 sm:py-4 lg:px-20 lg:py-5"
            }
          >
            <HomeAesthetic />
          </div>
        </div>

        {/* dock */}
        <Dock />
      </div>
    </motion.div>
  );
}

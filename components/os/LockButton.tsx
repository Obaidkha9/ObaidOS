"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/store";

/**
 * A single circular padlock button. Tapping it swings the shackle open, then
 * (after the brief animation) lifts the lock screen away. A tap is a real user
 * gesture, so the music reliably starts.
 */
export default function LockButton({ onUnlock }: { onUnlock: () => void }) {
  const reduced = useOS((s) => s.reducedMotion);
  const [opening, setOpening] = useState(false);

  const handle = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onUnlock, reduced ? 0 : 280);
  };

  return (
    <div className="mt-auto mb-[7vh] flex flex-col items-center gap-3">
      <motion.button
        type="button"
        aria-label="Tap to unlock Obaid OS"
        onClick={handle}
        whileTap={{ scale: 0.92 }}
        animate={opening || reduced ? {} : { scale: [1, 1.045, 1] }}
        transition={opening ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12 shadow-lg ring-1 ring-white/20 backdrop-blur-xl"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* body */}
          <rect x="5" y="11" width="14" height="10" rx="2" />
          {/* shackle — swings open on a hinge at its bottom-right */}
          <motion.path
            d="M8 11V7a4 4 0 0 1 8 0v4"
            style={{ transformBox: "fill-box", transformOrigin: "bottom right" }}
            animate={opening ? { rotate: -28 } : { rotate: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
          />
        </svg>
      </motion.button>
      <span className="text-xs font-medium tracking-wide text-white/70">
        Tap to unlock Obaid OS
      </span>
    </div>
  );
}

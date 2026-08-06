"use client";

import { motion } from "framer-motion";

/* Design System — opens through ProjectsApp exactly like the YouTube case
   study (same window path + layoutId spring), embedding the Figma file with a
   toolbar to jump to the full editor. */

const FIGMA_URL =
  "https://www.figma.com/design/y1sYl567f2Y0HHuY824X2z/Design-System?node-id=0-1&t=rrHBC2cQ0O85sqPZ-1";

export default function FigmaCaseStudy({ onBack }: { onBack: () => void }) {
  const src = `https://www.figma.com/embed?embed_host=obaidos&url=${encodeURIComponent(FIGMA_URL)}`;
  return (
    <motion.div
      layoutId="proj-design-system"
      className="absolute inset-0 z-30 flex flex-col overflow-hidden bg-[#0b0b0c]"
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-[#1a1a1f] px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[12px] font-medium text-white/50">
            Design System — open in Figma to explore the full system in depth
          </span>
        </div>
        <a
          href={FIGMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/90 transition hover:bg-white/20"
        >
          Open in Figma
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#1e1e1e]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/40">
          Loading Design System…
        </div>
        <iframe src={src} title="Design System" className="relative h-full w-full border-0" allowFullScreen />
      </div>
    </motion.div>
  );
}

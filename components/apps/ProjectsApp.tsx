"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import SmoothScroll from "@/components/os/SmoothScroll";
import YouTubeCaseStudy from "./YouTubeCaseStudy";
import EmployeePortalCaseStudy from "./EmployeePortalCaseStudy";
import FigmaCaseStudy from "./FigmaCaseStudy";
import AskAiCaseStudy from "./AskAiCaseStudy";
import CarwaalahCaseStudy from "./CarwaalahCaseStudy";
import FocusForgeCaseStudy from "./FocusForgeCaseStudy";
import { PROJECTS, type Project } from "@/lib/content";
import { useOS } from "@/lib/store";

function CaseStudy({ p, onBack }: { p: Project; onBack: () => void }) {
  const sections: [string, string][] = [
    ["Overview", p.overview],
    ["Problem", p.problem],
    ["Research", p.research],
    ["Wireframes", p.wireframes],
    ["Solution", p.solution],
  ];
  return (
    <motion.div
      layoutId={`proj-${p.id}`}
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ background: "#0b0b0c" }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <SmoothScroll>
        {/* hero */}
        <div
          className="relative flex h-64 flex-col justify-end p-6 pt-[max(env(safe-area-inset-top),48px)]"
          style={{ background: `linear-gradient(160deg,${p.color},#000)` }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl font-bold"
          >
            {p.name}
          </motion.h2>
          <p className="text-white/70">{p.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-28 pt-6">
          {sections.map(([h, body], i) => (
            <motion.section
              key={h}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="mb-7"
            >
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: p.color }}>
                {h}
              </h3>
              <p className="text-[15px] leading-relaxed text-white/80">{body}</p>
            </motion.section>
          ))}

          {/* screens gallery */}
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: p.color }}>
            Screens
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl ring-1 ring-white/10"
                style={{
                  background: `linear-gradient(${140 + i * 25}deg,${p.color}55,#111)`,
                }}
              />
            ))}
          </div>

          {/* impact */}
          <h3 className="mb-2 mt-7 text-xs font-semibold uppercase tracking-wider" style={{ color: p.color }}>
            Impact
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {p.impact.map((im) => (
              <div
                key={im}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.05] px-4 py-3"
              >
                <span className="text-lg" style={{ color: p.color }}>↗</span>
                <span className="text-[15px] text-white/85">{im}</span>
              </div>
            ))}
          </div>
        </div>
      </SmoothScroll>
    </motion.div>
  );
}

export default function ProjectsApp({ onClose, payload }: AppProps) {
  const setContext = useOS((s) => s.setContext);
  // honor a deep-link (opened from a Widgets-page project shortcut)
  const [open, setOpen] = useState<Project | null>(
    () => PROJECTS.find((p) => p.id === payload) ?? null,
  );

  const select = (p: Project) => {
    setContext(`Viewing ${p.name}`);
    setOpen(p);
  };
  const back = () => {
    setContext("Projects");
    setOpen(null);
  };

  return (
    <div className="relative h-full">
      <AppChrome title="Projects" accent="#5e5ce6" onClose={onClose} bg="#141414">
        <p className="mb-5 text-sm text-white/50">
          Each project opens like its own app.
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
          {PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => select(p)}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 26 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                layoutId={`proj-${p.id}`}
                className="flex aspect-square w-full max-w-[70px] items-center justify-center rounded-[22%] text-2xl font-bold text-white shadow-lg ring-1 ring-white/10"
                style={{ background: `linear-gradient(160deg,${p.color},#000)` }}
              >
                {p.name[0]}
              </motion.div>
              <span className="text-center text-xs font-medium text-white/90">
                {p.name}
              </span>
            </motion.button>
          ))}
        </div>
      </AppChrome>

      <AnimatePresence>
        {open && (open.id === "youtube-redesign"
          ? <YouTubeCaseStudy key={open.id} onBack={back} />
          : open.id === "employee-portal"
          ? <EmployeePortalCaseStudy key={open.id} onBack={back} />
          : open.id === "design-system"
          ? <FigmaCaseStudy key={open.id} onBack={back} />
          : open.id === "ask-ai"
          ? <AskAiCaseStudy key={open.id} onBack={back} />
          : open.id === "carwaalah"
          ? <CarwaalahCaseStudy key={open.id} onBack={back} />
          : open.id === "focus-forge"
          ? <FocusForgeCaseStudy key={open.id} onBack={back} />
          : <CaseStudy key={open.id} p={open} onBack={back} />)}
      </AnimatePresence>
    </div>
  );
}

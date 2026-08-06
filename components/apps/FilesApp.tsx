"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import { EXPERIENCE, type ExperienceEntry } from "@/lib/content";

function FolderIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 40" className="h-14 w-16" aria-hidden>
      <path
        d="M2 8a4 4 0 0 1 4-4h11l4 4h21a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
        fill={color}
      />
      <path
        d="M2 12h44v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"
        fill={color}
        opacity="0.75"
      />
    </svg>
  );
}

function Detail({ e, onBack }: { e: ExperienceEntry; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-[15px] font-medium text-[#0f53fc]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Experience
      </button>

      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
          style={{ background: e.color }}
        >
          {e.company[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold">{e.company}</h2>
          <p className="text-white/60">{e.role}</p>
          <p className="text-sm text-white/40">{e.period}</p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-white/75">{e.summary}</p>

      {(
        [
          ["Responsibilities", e.responsibilities],
          ["Projects", e.projects],
          ["Achievements", e.achievements],
        ] as const
      ).map(([title, items]) => (
        <section key={title} className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
            {title}
          </h3>
          <div className="overflow-hidden rounded-2xl bg-white/[0.05]">
            {items.map((it, i) => (
              <div
                key={it}
                className="flex items-center gap-3 px-4 py-3 text-[15px] text-white/85"
                style={{
                  borderTop: i ? "1px solid rgba(255,255,255,0.06)" : undefined,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: e.color }}
                />
                {it}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-6 grid grid-cols-2 gap-3">
        {["Screenshots", "Design Files"].map((t) => (
          <div
            key={t}
            className="flex h-28 flex-col justify-end rounded-2xl p-3"
            style={{
              background: `linear-gradient(160deg,${e.color}44,${e.color}22)`,
            }}
          >
            <span className="text-sm font-medium text-white/80">{t}</span>
            <span className="text-xs text-white/40">Tap to preview</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function FilesApp({ onClose }: AppProps) {
  const [open, setOpen] = useState<ExperienceEntry | null>(null);

  return (
    <AppChrome title="Experience" onClose={onClose} bg="#141414">
      <AnimatePresence mode="wait">
        {open ? (
          <Detail key="detail" e={open} onBack={() => setOpen(null)} />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <p className="mb-4 text-sm text-white/50">
              Career folders · newest first
            </p>
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
              {[...EXPERIENCE].reverse().map((e, i) => (
                <motion.button
                  key={e.id}
                  onClick={() => setOpen(e)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <FolderIcon color={e.color} />
                  <span className="text-center text-xs font-medium text-white/90">
                    {e.company}
                  </span>
                  <span className="text-center text-[10px] text-white/40">
                    {e.start} – {e.end}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                Recents
              </h3>
              <div className="overflow-hidden rounded-2xl bg-white/[0.05]">
                {[...EXPERIENCE].reverse().map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => setOpen(e)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    style={{
                      borderTop: i ? "1px solid rgba(255,255,255,0.06)" : undefined,
                    }}
                  >
                    <FolderIcon color={e.color} />
                    <span className="flex-1">
                      <span className="block text-[15px] font-medium">
                        {e.company}
                      </span>
                      <span className="block text-xs text-white/45">
                        {e.role} · {e.period}
                      </span>
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppChrome>
  );
}

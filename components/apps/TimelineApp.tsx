"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import { EXPERIENCE } from "@/lib/content";

export default function TimelineApp({ onClose }: AppProps) {
  const [active, setActive] = useState(EXPERIENCE.length - 1);

  return (
    <AppChrome title="Timeline" accent="#ff9f0a" onClose={onClose} bg="#141414">
      <p className="mb-8 text-sm text-white/50">
        A short story of how I got here.
      </p>

      <div className="relative pl-8">
        {/* the animated line */}
        <motion.div
          className="absolute left-[9px] top-2 w-[3px] rounded-full bg-gradient-to-b from-[#34c759] via-[#0f53fc] to-[#8f00ff]"
          initial={{ height: 0 }}
          animate={{ height: "calc(100% - 16px)" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        />

        {EXPERIENCE.map((e, i) => (
          <motion.button
            key={e.id}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 260, damping: 26 }}
            className="relative mb-8 block w-full text-left"
          >
            {/* milestone dot */}
            <span
              className="absolute -left-[26px] top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-black"
              style={{ background: e.color }}
            >
              <motion.span
                className="h-full w-full rounded-full"
                style={{ background: e.color }}
                animate={
                  active === i
                    ? { boxShadow: `0 0 0 6px ${e.color}33` }
                    : { boxShadow: `0 0 0 0px ${e.color}00` }
                }
              />
            </span>

            <motion.div
              animate={{
                scale: active === i ? 1 : 0.98,
                opacity: active === i ? 1 : 0.7,
              }}
              className="rounded-2xl border p-4"
              style={{
                borderColor: active === i ? `${e.color}66` : "rgba(255,255,255,0.08)",
                background:
                  active === i
                    ? `linear-gradient(160deg,${e.color}22,transparent)`
                    : "rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                {e.period}
              </span>
              <h3 className="mt-0.5 text-lg font-bold" style={{ color: e.color }}>
                {e.company}
              </h3>
              <p className="text-sm text-white/60">{e.role}</p>
              {active === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 overflow-hidden text-sm leading-relaxed text-white/70"
                >
                  {e.summary}
                </motion.p>
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </AppChrome>
  );
}

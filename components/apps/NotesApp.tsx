"use client";

import { motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import { ABOUT, PROFILE } from "@/lib/content";

export default function NotesApp({ onClose }: AppProps) {
  return (
    <AppChrome title="Notes" accent="#ffd60a" onClose={onClose} bg="#141414">
      <article className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold">{ABOUT.title}</h2>
        <p className="mt-1 text-xs text-white/40">
          {ABOUT.updated} · {PROFILE.name}
        </p>

        <div className="mt-6 space-y-7 text-[15px] leading-relaxed text-white/85">
          {ABOUT.sections.map((sec, i) => (
            <motion.section
              key={sec.heading}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <h3 className="mb-1.5 text-lg font-semibold text-white">
                {sec.heading}
              </h3>
              {sec.body && <p className="text-white/70">{sec.body}</p>}
              {sec.list && (
                <ul className="mt-1 space-y-1.5">
                  {sec.list.map((li) => (
                    <li key={li} className="flex gap-2 text-white/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffd60a]" />
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      </article>
    </AppChrome>
  );
}

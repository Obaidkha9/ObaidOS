"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";
import { PROJECTS, EXPERIENCE } from "@/lib/content";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const t = setInterval(tick, 1000 * 20);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);
  return now;
}

export default function HomeWidgets() {
  const launch = useLaunch();
  const now = useClock();

  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const isPlaying = useOS((s) => s.isPlaying);
  const toggle = useOS((s) => s.toggle);
  const track = playlist[trackIndex];
  const current = EXPERIENCE[EXPERIENCE.length - 1];

  const musicRef = useRef<HTMLButtonElement>(null);
  const roleRef = useRef<HTMLButtonElement>(null);
  const timeRef = useRef<HTMLButtonElement>(null);
  const projRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const wrap = (i: number) => ({
    initial: { opacity: 0, y: 18, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay: 0.05 + i * 0.05, type: "spring" as const, stiffness: 400, damping: 30 },
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <p className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
        Widgets
      </p>

      {/* Now Playing — large widget */}
      <motion.button
        {...wrap(0)}
        ref={musicRef}
        onClick={() => launch("music", musicRef.current, { context: "Now Playing" })}
        className="relative flex w-full items-center gap-4 overflow-hidden rounded-[26px] p-4 text-left ring-1 ring-white/10"
        style={{ background: track?.artwork ?? "#0f53fc" }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="relative h-20 w-20 shrink-0 rounded-2xl shadow-lg ring-1 ring-white/20"
          style={{ background: track?.artwork ?? "#0f53fc" }}
        />
        <div className="relative min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
            Now Playing
          </p>
          <p className="truncate text-lg font-bold text-white">
            {track?.title ?? "Midnight City"}
          </p>
          <p className="truncate text-sm text-white/70">{track?.artist ?? "M83"}</p>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              toggle();
            }
          }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur active:scale-90"
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </motion.button>

      {/* two small widgets */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          {...wrap(1)}
          ref={timeRef}
          onClick={() => launch("timeline", timeRef.current, { context: "Career Timeline" })}
          className="glass flex aspect-square flex-col justify-between rounded-[26px] p-4 text-left ring-1 ring-white/10"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4d7bff]">
            Timeline
          </span>
          <div>
            <p className="text-3xl font-bold tabular-nums text-white">
              {now
                ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
                : "--:--"}
            </p>
            <p className="text-sm text-white/50">
              {now
                ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
                : ""}
            </p>
          </div>
          <span className="text-xs text-white/40">The full career story →</span>
        </motion.button>

        <motion.button
          {...wrap(2)}
          ref={roleRef}
          onClick={() => launch("experience", roleRef.current, { context: "Browsing Experience" })}
          className="flex aspect-square flex-col justify-between rounded-[26px] p-4 text-left ring-1 ring-white/10"
          style={{ background: `linear-gradient(160deg,${current.color},#000)` }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Currently
          </span>
          <div>
            <p className="text-2xl font-bold text-white">{current.company}</p>
            <p className="text-sm text-white/70">{current.role}</p>
          </div>
          <span className="text-xs text-white/60">{current.period}</span>
        </motion.button>
      </div>

      {/* project shortcuts */}
      <div>
        <p className="px-1 pb-3 pt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          Featured Projects
        </p>
        <div className="grid grid-cols-4 gap-x-4 gap-y-5 sm:grid-cols-5">
          {PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              {...wrap(3 + i)}
              ref={(el) => {
                projRefs.current[p.id] = el;
              }}
              onClick={() =>
                launch("projects", projRefs.current[p.id], {
                  context: `Viewing ${p.name}`,
                  payload: p.id,
                })
              }
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="flex aspect-square w-full max-w-[64px] items-center justify-center rounded-[22%] text-xl font-bold text-white shadow-lg ring-1 ring-white/10"
                style={{ background: `linear-gradient(160deg,${p.color},#000)` }}
              >
                {p.name[0]}
              </span>
              <span className="max-w-[68px] truncate text-[11px] font-medium text-white/90">
                {p.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

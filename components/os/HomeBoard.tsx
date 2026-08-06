"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";
import { formatTime } from "@/lib/utils";
import { EXPERIENCE, PROJECTS } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Page 3 — macOS-style floating widget board.                        */
/*  Widgets hug the left + right edges; the centre stays open so the    */
/*  video wallpaper reads through.                                      */
/* ------------------------------------------------------------------ */

/* round computed SVG coords so server + client serialize identically. */
const rnd = (n: number) => Math.round(n * 100) / 100;

function Panel({
  children,
  className = "",
  onClick,
  style,
  i = 0,
}: {
  children?: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  style?: CSSProperties;
  i?: number;
}) {
  const reduced = useOS((s) => s.reducedMotion);
  return (
    <motion.div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as unknown as MouseEvent<HTMLElement>);
              }
            }
          : undefined
      }
      style={style}
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.03 + i * 0.04, type: "spring", stiffness: 380, damping: 30 }}
      className={`relative overflow-hidden rounded-[16px] text-left shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* --- analog clock (continuously sweeping second hand) --------------- */
function AnalogClock() {
  const reduced = useOS((s) => s.reducedMotion);
  const [now, setNow] = useState<Date | null>(null);
  const secRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const t = setInterval(tick, 10000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    if (reduced) {
      const upd = () => el.setAttribute("transform", `rotate(${new Date().getSeconds() * 6} 50 50)`);
      upd();
      const t = setInterval(upd, 1000);
      return () => clearInterval(t);
    }
    let raf = 0;
    const loop = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      el.setAttribute("transform", `rotate(${s * 6} 50 50)`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const hh = now ? now.getHours() % 12 : 10;
  const mm = now ? now.getMinutes() : 9;
  const hourAngle = (hh + mm / 60) * 30;
  const minAngle = mm * 6;
  const NUMS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width="100" height="100" rx="24" fill="#fbfbf9" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const hour = i % 5 === 0;
        const r1 = hour ? 38 : 41;
        const r2 = 45;
        return (
          <line
            key={i}
            x1={rnd(50 + r1 * Math.sin(a))}
            y1={rnd(50 - r1 * Math.cos(a))}
            x2={rnd(50 + r2 * Math.sin(a))}
            y2={rnd(50 - r2 * Math.cos(a))}
            stroke={hour ? "#333" : "#b8b8b8"}
            strokeWidth={hour ? 1.4 : 0.7}
            strokeLinecap="round"
          />
        );
      })}
      {NUMS.map((n, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const R = 31;
        return (
          <text
            key={n}
            x={rnd(50 + R * Math.sin(a))}
            y={rnd(50 - R * Math.cos(a))}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8.5"
            fontWeight="700"
            fill="#1a1a1a"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {n}
          </text>
        );
      })}
      <line x1="50" y1="55" x2="50" y2="33" stroke="#1a1a1a" strokeWidth="3.2" strokeLinecap="round" transform={`rotate(${hourAngle} 50 50)`} />
      <line x1="50" y1="57" x2="50" y2="21" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${minAngle} 50 50)`} />
      <g ref={secRef}>
        <line x1="50" y1="59" x2="50" y2="17" stroke="#ff9500" strokeWidth="1" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="2.4" fill="#ff9500" />
      <circle cx="50" cy="50" r="1" fill="#1a1a1a" />
    </svg>
  );
}

export default function HomeBoard() {
  const launch = useLaunch();
  const open =
    (id: string, opts?: { context?: string; payload?: string }) =>
    (e: MouseEvent<HTMLElement>) =>
      launch(id, e.currentTarget, opts);

  /* music */
  const isPlaying = useOS((s) => s.isPlaying);
  const toggle = useOS((s) => s.toggle);
  const next = useOS((s) => s.next);
  const prev = useOS((s) => s.prev);
  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const currentTime = useOS((s) => s.currentTime);
  const duration = useOS((s) => s.duration);
  const track = playlist[trackIndex];
  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  /* measure the clock + music block so the project card can match its height */
  const topRef = useRef<HTMLDivElement>(null);
  const [topH, setTopH] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const update = () => setTopH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* experience — most recent first */
  const exp = [...EXPERIENCE].reverse();

  return (
    <div className="flex h-full items-stretch justify-between gap-4 px-6 py-3 sm:px-10">
      {/* ============================ LEFT ============================ */}
      <div className="flex w-[28%] min-w-[240px] max-w-[320px] flex-col justify-start gap-3">
        {/* clock + music — measured so the project card can match its height */}
        <div ref={topRef} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3.5">
          {/* clock — 1 row × 1 col */}
          <Panel i={0} onClick={open("about", { context: "About Obaid" })} className="aspect-square bg-[#fbfbf9]">
            <AnalogClock />
          </Panel>

          {/* about me — 1 row × 1 col (equal to clock), full-width orange header */}
          <Panel i={1} onClick={open("about", { context: "About Obaid" })} className="flex aspect-square flex-col bg-[#2d2d33]/85 backdrop-blur-md">
            <div className="flex items-center gap-2 bg-[#ff9f0a] px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z" />
              </svg>
              <span className="text-xs font-bold text-white">About Me</span>
            </div>
            <div className="flex flex-1 flex-col p-3.5">
              <p className="text-[15px] font-bold leading-snug text-white">Hi, I&apos;m Obaid</p>
              <p className="mt-1 text-xs leading-tight text-white/55">{PROFILE_ROLE}</p>
              <p className="mt-auto text-xs text-white/45">Jaipur, India</p>
            </div>
          </Panel>
          </div>

          {/* now playing (cream) — full width */}
          <Panel i={2} onClick={open("music", { context: "Now Playing" })} className="bg-[#efe9dc] p-3.5">
            <div className="flex items-center gap-3">
              <div
                className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-center"
                style={{ background: track?.artwork ?? "#111" }}
              >
                <span className="px-1.5 text-[10px] font-black uppercase leading-tight tracking-wide text-white/90">
                  {track?.artist ?? "Seedhe Maut"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-neutral-500">Now Playing</p>
                <div className="flex items-center gap-2">
                  <p className="truncate text-lg font-bold text-neutral-900">{track?.title ?? "Maina"}</p>
                  <span className="rounded-[5px] bg-neutral-400 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">E</span>
                </div>
                <p className="truncate text-sm text-neutral-500">{track?.artist ?? "Seedhe Maut"}</p>
                <div className="mt-2 flex items-center gap-6 text-neutral-800">
                  <Ctrl label="Previous" onClick={prev}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6v12H5V6zM20 6v12l-9-6z" /></svg>
                  </Ctrl>
                  <Ctrl label={isPlaying ? "Pause" : "Play"} onClick={toggle}>
                    {isPlaying ? (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.3" /><rect x="14" y="5" width="4" height="14" rx="1.3" /></svg>
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </Ctrl>
                  <Ctrl label="Next" onClick={next}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6v12h2V6zM4 6v12l9-6z" /></svg>
                  </Ctrl>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2.5 text-[11px] tabular-nums text-neutral-500">
              <span>{formatTime(currentTime)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-400/40">
                <div className="h-full rounded-full bg-neutral-700" style={{ width: `${progress * 100}%` }} />
              </div>
              <span>{formatTime(duration || 226)}</span>
            </div>
          </Panel>
        </div>

        {/* projects — same card as bottom-right; height = clock + music combined */}
        <ProjectCarousel i={3} style={topH ? { height: topH } : undefined} />
      </div>

      {/* =========================== CENTER =========================== */}
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <FlappyCard i={2} onClick={open("flappybird", { context: "Playing Flappy Bird" })} />
      </div>

      {/* ============================ RIGHT =========================== */}
      <div className="flex w-[30%] min-w-[250px] max-w-[350px] flex-col justify-between gap-4">
        {/* experience */}
        <Panel i={1} onClick={open("experience", { context: "Browsing Experience" })} className="bg-[#2d2d33]/85 backdrop-blur-md p-4">
          <div className="mb-3 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" opacity="0.7" aria-hidden>
              <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z" />
            </svg>
            <span className="text-[15px] font-semibold text-white">Experience</span>
          </div>
          <ul className="space-y-3.5">
            {exp.map((e, idx) => (
              <li key={e.id} className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: idx === 0 ? "#ff9f0a" : "transparent", border: idx === 0 ? "none" : "2px solid rgba(255,255,255,0.5)" }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight text-white">{e.role}</p>
                    <p className="shrink-0 text-[11px] text-white/45">{e.period}</p>
                  </div>
                  <p className="text-[12px] text-white/50">{e.company}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* project carousel */}
        <ProjectCarousel i={3} />
      </div>
    </div>
  );
}

const PROFILE_ROLE = "UX Engineer & Product Designer";

/* Flappy Bird game card — illustrated thumbnail; click opens the playable window. */
function FlappyCard({ onClick, i }: { onClick: (e: MouseEvent<HTMLElement>) => void; i: number }) {
  return (
    <Panel i={i} onClick={onClick} className="w-full max-w-[280px] aspect-[3/4]">
      <svg viewBox="0 0 210 280" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="fbsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4ec0ca" />
            <stop offset="1" stopColor="#a5e6ec" />
          </linearGradient>
        </defs>
        <rect width="210" height="280" fill="url(#fbsky)" />
        {/* clouds */}
        <g fill="#ffffff" opacity="0.85">
          <ellipse cx="45" cy="46" rx="22" ry="11" />
          <ellipse cx="68" cy="49" rx="15" ry="8" />
          <ellipse cx="165" cy="70" rx="18" ry="9" />
        </g>
        {/* pipes */}
        <g fill="#5cbf3a" stroke="#3f8f2a" strokeWidth="2">
          <rect x="150" y="0" width="44" height="86" />
          <rect x="146" y="78" width="52" height="18" />
          <rect x="150" y="176" width="44" height="72" />
          <rect x="146" y="168" width="52" height="18" />
          <rect x="34" y="0" width="44" height="48" />
          <rect x="30" y="40" width="52" height="18" />
        </g>
        {/* ground */}
        <rect x="0" y="248" width="210" height="32" fill="#ded895" />
        <rect x="0" y="248" width="210" height="9" fill="#7ec850" />
        {/* bird */}
        <g transform="translate(88,132) rotate(-12)">
          <circle r="17" fill="#f7d51d" stroke="#e0a000" strokeWidth="2" />
          <ellipse cx="-4" cy="5" rx="8" ry="5" fill="#fff" />
          <circle cx="7" cy="-5" r="6" fill="#fff" />
          <circle cx="8.5" cy="-5" r="2.6" fill="#222" />
          <path d="M14 -1 L25 1.5 L14 6 Z" fill="#ff8c1a" />
        </g>
      </svg>
      {/* title + play */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-8">
        <p className="text-sm font-bold text-white drop-shadow">Flappy Bird</p>
        <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">Play</span>
      </div>
    </Panel>
  );
}

/* Project card — reused on the left column and the bottom-right.
   Each instance keeps its own carousel index. */
function ProjectCarousel({
  className = "",
  style,
  i = 0,
}: {
  className?: string;
  style?: CSSProperties;
  i?: number;
}) {
  const launch = useLaunch();
  const [proj, setProj] = useState(0);
  const project = PROJECTS[proj];
  const step = (d: number) =>
    setProj((p) => (p + d + PROJECTS.length) % PROJECTS.length);

  return (
    <Panel i={i} style={style} className={`flex shrink-0 flex-col bg-[#2d2d33]/85 backdrop-blur-md p-3 ${className}`}>
      <div className="relative min-h-[130px] flex-1 overflow-hidden rounded-[16px]" style={{ background: `linear-gradient(160deg,${project.color}, #0b0b12)` }}>
        <button
          aria-label="Previous project"
          onClick={(e) => { e.stopPropagation(); step(-1); }}
          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md active:scale-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          aria-label="Next project"
          onClick={(e) => { e.stopPropagation(); step(1); }}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-md active:scale-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {PROJECTS.map((_, idx) => (
            <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === proj ? "w-4 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{project.name}</p>
          <p className="truncate text-[11px] text-white/50">{project.tags[0] ?? "Design"} · {project.year}</p>
        </div>
        <button
          onClick={(e) => launch("projects", e.currentTarget, { context: `Viewing ${project.name}`, payload: project.id })}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 active:scale-95"
        >
          View All
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </Panel>
  );
}

/* small transport control that stops propagation to the card */
function Ctrl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer active:scale-90"
    >
      {children}
    </span>
  );
}

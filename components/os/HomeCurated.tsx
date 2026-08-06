"use client";

import {
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";
import { formatTime } from "@/lib/utils";
import { PROFILE, PROJECTS } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Page 4 — curated "Apple-designed portfolio" dashboard.             */
/*  Hierarchy: Identity · Currently · Projects · Music · Arsenal · Nav */
/* ------------------------------------------------------------------ */

const CARD = "rounded-[22px] bg-[#2d2d33]/94 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]";

/* project carousel order (per spec) */
const CAROUSEL = ["youtube-redesign", "carwaalah", "ask-ai", "design-system"]
  .map((id) => PROJECTS.find((p) => p.id === id))
  .filter(Boolean) as (typeof PROJECTS)[number][];

export default function HomeCurated() {
  const launch = useLaunch();
  const openFinder =
    (payload: string, context: string) => (e: MouseEvent<HTMLElement>) =>
      launch("finder", e.currentTarget, { context, payload });

  return (
    <div
      className="grid h-full gap-3.5 px-6 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10"
      style={{
        gridTemplateColumns: "repeat(6,1fr)",
        gridTemplateRows: "repeat(6,1fr)",
        gridTemplateAreas: `
          "iden iden proj proj musi musi"
          "iden iden proj proj musi musi"
          "iden iden proj proj arse arse"
          "iden iden proj proj arse arse"
          "curr curr nav  nav  nav  nav"
          "curr curr nav  nav  nav  nav"`,
      }}
    >
      <Identity />
      <Currently />
      <Projects />
      <Music />
      <Arsenal />
      <NavHub openFinder={openFinder} />
    </div>
  );
}

/* ---------- Identity (contact-poster style) ----------------------- */
function Identity() {
  return (
    <section
      style={{ gridArea: "iden" }}
      className="relative overflow-hidden rounded-[22px] ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      {/* profile photo — drops in automatically if /profile.jpg exists */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundColor: "#1a1416",
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%), url('/profile.jpg')",
        }}
      />
      {/* fallback monogram sheen when no photo */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 70% 20%, rgba(122,22,22,0.35), transparent 60%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-sm font-medium text-white/60">Hi, I&apos;m</p>
        <h1 className="mt-1 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl">
          Obaid<br />Yusuf Zai
        </h1>
        <p className="mt-3 text-[15px] font-semibold leading-tight text-white/90">
          UX Engineer<br />Product Designer
        </p>
        <p className="mt-3 text-xs text-white/55">Jaipur, India · 4+ Years Experience</p>
      </div>
    </section>
  );
}

/* ---------- Currently (merged About + Status) --------------------- */
function Currently() {
  return (
    <section style={{ gridArea: "curr" }} className={`flex flex-col justify-center gap-3.5 p-6 ${CARD}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Currently</p>
      <div>
        <h2 className="text-xl font-bold leading-tight text-white">UX Engineer III</h2>
        <p className="mt-0.5 text-sm font-semibold text-white/60">
          at <span className="text-[#ff6a6a]">Ensylon</span>
        </p>
      </div>
      <p className="text-[13px] font-medium text-white/85">Available for Full-Time &amp; Freelance</p>
      <div className="text-[12px] leading-relaxed text-white/45">
        <p>4+ Years Experience · Jaipur, India</p>
        <p>Product Design • UX Engineering</p>
      </div>
    </section>
  );
}

/* ---------- Projects — Apple Photos style carousel ---------------- */
function Projects() {
  const launch = useLaunch();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(0);
  const p = CAROUSEL[i];
  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI((n + CAROUSEL.length) % CAROUSEL.length);
  };

  return (
    <section style={{ gridArea: "proj" }} className={`flex flex-col overflow-hidden p-4 ${CARD}`}>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-white">Featured Work</span>
        <span className="text-[11px] text-white/40">{i + 1} / {CAROUSEL.length}</span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.button
            key={p.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0.4 }),
              center: { x: 0, opacity: 1 },
              leave: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0.4 }),
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1);
              else if (info.offset.x > 60) go(i - 1);
            }}
            onClick={() => launch("finder", document.body, { context: `Viewing ${p.name}`, payload: "projects" })}
            className="absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left"
            style={{ background: `linear-gradient(160deg, ${p.color}, #0b0b12)` }}
          >
            <span className="mt-auto bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
              <span className="flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur">
                    {t}
                  </span>
                ))}
              </span>
              <span className="mt-2 block text-xl font-bold text-white">{p.name}</span>
              <span className="mt-1 block truncate text-[12px] text-white/70">{p.subtitle} · {p.year}</span>
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* pagination dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {CAROUSEL.map((_, n) => (
          <button
            key={n}
            aria-label={`Project ${n + 1}`}
            onClick={() => go(n)}
            className={`h-1.5 rounded-full transition-all ${n === i ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------- Music — Apple Music hero ------------------------------ */
function Music() {
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

  const Ctrl = ({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) => (
    <button aria-label={label} onClick={onClick} className="text-white active:scale-90">
      {children}
    </button>
  );

  return (
    <section style={{ gridArea: "musi" }} className={`flex flex-col gap-3 p-4 ${CARD}`}>
      <div className="flex min-h-0 flex-1 items-center gap-4">
        <div
          className="relative aspect-square h-full max-h-[130px] shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10"
          style={{ background: track?.artwork ?? "linear-gradient(135deg,#0f53fc,#8f00ff)" }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ff6a6a]">Now Playing</p>
          <p className="mt-1 truncate text-lg font-bold text-white">{track?.title ?? "Add songs"}</p>
          <p className="truncate text-sm text-white/55">{track?.artist ?? "—"}</p>
          <div className="mt-3 flex items-center gap-6 text-white">
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
      <div className="flex items-center gap-2.5 text-[10px] tabular-nums text-white/40">
        <span>{formatTime(currentTime)}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-white/80" style={{ width: `${progress * 100}%` }} />
        </div>
        <span>{formatTime(duration || 226)}</span>
      </div>
    </section>
  );
}

/* ---------- Arsenal interest widget ------------------------------- */
function Arsenal() {
  return (
    <section
      style={{ gridArea: "arse" }}
      className="relative flex flex-col justify-between overflow-hidden rounded-[22px] p-5 ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(155deg,#3a0d0d,#170808 70%,#0e0606)" }} />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Favourite Club</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">Arsenal FC</h2>
      </div>
      <div className="relative flex items-end justify-between text-white/70">
        <div className="text-[13px] leading-relaxed">
          <p className="text-white/90">Next Match</p>
          <p>Season Updates</p>
        </div>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#ef4444" aria-hidden className="opacity-90">
          <path d="M12 2c-2 3-5 4-8 4 0 7 3 12 8 16 5-4 8-9 8-16-3 0-6-1-8-4z" />
        </svg>
      </div>
    </section>
  );
}

/* ---------- Navigation Hub (Launchpad) ---------------------------- */
function NavHub({ openFinder }: { openFinder: (payload: string, context: string) => (e: MouseEvent<HTMLElement>) => void }) {
  const ITEMS: { key: string; label: string; color: string; icon: ReactNode; onClick: (e: MouseEvent<HTMLElement>) => void }[] = [
    { key: "projects", label: "Projects", color: "#0a84ff", icon: ICONS.projects, onClick: openFinder("projects", "Projects") },
    { key: "experience", label: "Experience", color: "#5e5ce6", icon: ICONS.experience, onClick: openFinder("experience", "Experience") },
    { key: "resume", label: "Resume", color: "#ff3b30", icon: ICONS.resume, onClick: openFinder("resume", "Resume") },
    { key: "photos", label: "Photos", color: "#ff9f0a", icon: ICONS.photos, onClick: openFinder("gallery", "Photos") },
    { key: "certificates", label: "Certificates", color: "#ff375f", icon: ICONS.certificates, onClick: openFinder("certificates", "Certificates") },
    { key: "github", label: "Github", color: "#333338", icon: ICONS.github, onClick: () => window.open("https://github.com", "_blank", "noopener,noreferrer") },
    { key: "linkedin", label: "LinkedIn", color: "#0a66c2", icon: ICONS.linkedin, onClick: () => window.open(PROFILE.linkedin, "_blank", "noopener,noreferrer") },
    { key: "contact", label: "Contact", color: "#30d158", icon: ICONS.contact, onClick: openFinder("contact", "Contact") },
  ];
  return (
    <section style={{ gridArea: "nav" }} className={`flex items-center p-5 ${CARD}`}>
      <div className="grid w-full grid-cols-4 gap-x-3 gap-y-4 sm:grid-cols-8">
        {ITEMS.map((it) => (
          <button key={it.key} onClick={it.onClick} className="group flex flex-col items-center gap-1.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-[14px] text-white shadow-md ring-1 ring-white/10 transition-transform group-active:scale-90 group-hover:-translate-y-0.5"
              style={{ background: it.color }}
            >
              {it.icon}
            </span>
            <span className="text-[11px] font-medium text-white/70">{it.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICONS: Record<string, ReactNode> = {
  projects: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>),
  experience: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18" /></svg>),
  resume: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M7 3.5h6.5L19 9v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7 3.5z" /><path d="M13.5 3.5V9H19M9 13h6M9 16.5h4" /></svg>),
  photos: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.4" /><path d="M21 16l-5-5-4 4-2-2-4 4" /></svg>),
  certificates: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="9.5" r="5.5" /><path d="M8.6 14l-1.6 6 5-2.8 5 2.8-1.6-6M9.7 9.5l1.8 1.8 3-3.4" /></svg>),
  github: (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>),
  linkedin: (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 4.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z" /></svg>),
  contact: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M4 7.5l8 5.5 8-5.5" /></svg>),
};

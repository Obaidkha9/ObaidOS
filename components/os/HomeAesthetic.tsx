"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";
import { formatTime } from "@/lib/utils";
import { asset } from "@/lib/asset";
import WeatherContent from "./WeatherContent";
/* Workspace widget — the productivity tools used to design, build & ship. */
const TOOLS: { name: string; sub: string; href: string; icon: string; invert?: boolean }[] = [
  // row 1
  { name: "Figma", sub: "Design Systems", href: "https://figma.com", icon: asset("/icons/figma.webp") },
  { name: "ChatGPT", sub: "Research & Ideation", href: "https://chatgpt.com", icon: asset("/icons/chatgpt.webp"), invert: true },
  { name: "Claude Code", sub: "AI Development", href: "https://claude.com/claude-code", icon: asset("/icons/claude.webp") },
  { name: "Pinterest", sub: "Inspiration", href: "https://pinterest.com", icon: asset("/icons/pinterest.webp") },
  { name: "GitHub", sub: "Version Control", href: "https://github.com", icon: asset("/icons/github.webp"), invert: true },
  { name: "VS Code", sub: "Code Editor", href: "https://code.visualstudio.com", icon: asset("/icons/vscode.webp") },
  // row 2
  { name: "Framer", sub: "Prototyping", href: "https://framer.com", icon: asset("/icons/framer.webp") },
  { name: "Adobe XD", sub: "Legacy Projects", href: "https://www.adobe.com/products/xd.html", icon: asset("/icons/adobexd.webp") },
  { name: "Photoshop", sub: "Photo Editing", href: "https://www.adobe.com/products/photoshop.html", icon: asset("/icons/photoshop.webp") },
  { name: "Illustrator", sub: "Vector Art", href: "https://www.adobe.com/products/illustrator.html", icon: asset("/icons/illustrator.webp") },
  { name: "Power BI", sub: "Analytics", href: "https://powerbi.microsoft.com", icon: asset("/icons/powerbi.webp") },
  { name: "WordPress", sub: "CMS", href: "https://wordpress.org", icon: asset("/icons/wordpress.webp") },
];

function Workspace() {
  return (
    <div style={{ gridArea: "clus" }} className="flex flex-col rounded-[20px] bg-[#2d2d33]/94 backdrop-blur-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
      <div className="mb-2.5">
        <p className="text-[11px] font-semibold text-white/70">Daily Workflow</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {[TOOLS.slice(0, 6), TOOLS.slice(6)].map((row, ri) => (
          <div key={ri} className="flex items-center justify-between">
            {row.map((t) => (
              <div key={t.name} className="group relative flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center transition duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.04]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.icon} alt={t.name} className="h-[37px] w-[37px] object-contain" draggable={false} style={t.invert ? { filter: "invert(1)" } : undefined} />
                </div>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#2d2d33]/94 backdrop-blur-xl px-2.5 py-1.5 text-center opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
                  <span className="block text-[11px] font-semibold leading-tight text-white">{t.name}</span>
                  <span className="block text-[10px] leading-tight text-white/55">{t.sub}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* round computed SVG coords so server + client serialize identically (avoids
   float-precision hydration mismatches). */
const rnd = (n: number) => Math.round(n * 100) / 100;

const FEATURED: { id: string; name: string; sub: string; color: string; img: string; pos?: string; contain?: boolean; light?: boolean; noLabel?: boolean; stacked?: boolean; href?: string }[] = [
  { id: "design-system", name: "Design System", sub: "Scalable Design System", color: "#34c759", img: asset("/designsystem.webp") },
  { id: "focus-forge", name: "FocusForge", sub: "Build unbreakable focus habits", color: "#6258f6", img: asset("/focus-forge.webp"), pos: "center" },
  { id: "youtube-redesign", name: "YouTube Redesign", sub: "A concept study", color: "#ff3b30", img: asset("/youtube.webp") },
  { id: "employee-portal", name: "Employee Portal", sub: "", color: "#eaf4ff", img: asset("/employee-portal-attendance-v2.webp"), stacked: true },
  { id: "carwaalah", name: "Carwaalah", sub: "Car rentals, redesigned", color: "#FFC83D", img: asset("/carwaalah-card.jpg"), pos: "center", contain: true, light: true, noLabel: true },
  { id: "ask-ai", name: "ASK AI", sub: "AI-Powered Assistant", color: "#3b82f6", img: asset("/askai.webp"), pos: "center" },
];

function Tile({
  area,
  children,
  className = "",
  onClick,
  style,
  i = 0,
}: {
  area: string;
  children?: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  i?: number;
}) {
  const reduced = useOS((s) => s.reducedMotion);
  return (
    <motion.button
      onClick={onClick}
      initial={reduced ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.02 + i * 0.02, type: "spring", stiffness: 420, damping: 30 }}
      style={{ gridArea: area, ...style }}
      className={`relative overflow-hidden rounded-[16px] text-left shadow-md ring-1 ring-white/10 ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* Fetches the real album cover for a track from the free iTunes Search API,
   client-side (runs in the visitor's browser). Falls back to null on any
   error (CORS / offline) so the generative art below still shows. */
function useItunesCover(term: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [prev, setPrev] = useState(term);
  if (term !== prev) {
    setPrev(term);
    setUrl(null); // clear old cover the moment the track changes
  }
  useEffect(() => {
    if (!term) return;
    let cancelled = false;
    fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`,
    )
      .then((r) => r.json())
      .then((d) => {
        const art: string | undefined = d?.results?.[0]?.artworkUrl100;
        if (!cancelled && art) setUrl(art.replace("100x100bb", "600x600bb"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [term]);
  return url;
}

/* Album cover: real fetched artwork on top, generative art as fallback. */
function AlbumCover({
  artwork,
  seed,
  title,
  artist,
  cover: coverSrc,
}: {
  artwork?: string;
  seed: number;
  title?: string;
  artist?: string;
  cover?: string;
}) {
  // skip the remote fetch entirely when a local cover is provided
  const live = useItunesCover(!coverSrc && title && artist ? `${artist} ${title}` : "");
  const cover = coverSrc || live; // explicit track cover takes priority over the live fetch
  const v = ((seed % 4) + 4) % 4;
  return (
    <div
      className="noise absolute inset-0 overflow-hidden rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
      style={{ background: artwork ?? "linear-gradient(135deg,#0f53fc,#8f00ff)" }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {v === 0 && (
          <>
            <circle cx="70" cy="34" r="26" fill="#fff" opacity="0.85" />
            <rect x="0" y="66" width="100" height="34" fill="#000" opacity="0.18" />
          </>
        )}
        {v === 1 && (
          <g fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5">
            {[10, 20, 30, 40].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} />
            ))}
          </g>
        )}
        {v === 2 && (
          <>
            <path d="M0 100 L100 0 L100 40 L40 100 Z" fill="#fff" opacity="0.16" />
            <circle cx="30" cy="34" r="16" fill="#000" opacity="0.22" />
          </>
        )}
        {v === 3 && (
          <>
            <ellipse cx="32" cy="38" rx="34" ry="26" fill="#fff" opacity="0.16" />
            <ellipse cx="74" cy="70" rx="30" ry="24" fill="#000" opacity="0.2" />
          </>
        )}
      </svg>
      {/* real album cover (fetched at runtime) fades in over the fallback */}
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}
      {/* soft top sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-60" />
    </div>
  );
}

/* Game cards — thumbnail art; click opens the playable game in a window. */
function GameCard({ area, id, name, img, contain, bg }: { area: string; id: string; name: string; img: string; contain?: boolean; bg?: string }) {
  const launch = useLaunch();
  const isMobile = useOS((s) => s.tier === "mobile");
  return (
    <button
      style={{ gridArea: area, background: bg }}
      onClick={(e) => launch(id, e.currentTarget, { context: `Playing ${name}` })}
      aria-label={`Play ${name}`}
      className="group relative overflow-hidden rounded-[16px] bg-[#2d2d33]/94 shadow-md ring-1 ring-white/10 backdrop-blur-xl transition active:scale-[0.98]"
    >
      {/* On mobile the card stays the same size but the artwork is inset into a
          smaller centred thumbnail instead of bleeding to the edges. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={name} className={`absolute inset-0 h-full w-full transition duration-300 group-hover:scale-[1.04] ${isMobile ? "object-contain p-4" : contain ? "object-contain p-1.5" : "object-cover"}`} />
      {/* play affordance */}
      <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition group-hover:bg-black/70">
        Play
      </span>
    </button>
  );
}

/* Page-3-style analog clock: light square face filling the tile. */
function ClockFace() {
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
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const hour = i % 5 === 0;
        const r1 = hour ? 38 : 41;
        const r2 = 45;
        return (
          <line key={i} x1={rnd(50 + r1 * Math.sin(a))} y1={rnd(50 - r1 * Math.cos(a))} x2={rnd(50 + r2 * Math.sin(a))} y2={rnd(50 - r2 * Math.cos(a))} stroke={hour ? "#c4c4ce" : "#54545e"} strokeWidth={hour ? 1.4 : 0.7} strokeLinecap="round" />
        );
      })}
      {NUMS.map((n, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const R = 31;
        return (
          <text key={n} x={rnd(50 + R * Math.sin(a))} y={rnd(50 - R * Math.cos(a))} textAnchor="middle" dominantBaseline="central" fontSize="8.5" fontWeight="700" fill="#e9e9ef" style={{ fontFamily: "var(--font-sans)" }}>{n}</text>
        );
      })}
      <line x1="50" y1="55" x2="50" y2="33" stroke="#f4f4f7" strokeWidth="3.2" strokeLinecap="round" transform={`rotate(${hourAngle} 50 50)`} />
      <line x1="50" y1="57" x2="50" y2="21" stroke="#f4f4f7" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${minAngle} 50 50)`} />
      <g ref={secRef}>
        <line x1="50" y1="59" x2="50" y2="17" stroke="#ff9500" strokeWidth="1" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="2.4" fill="#ff9500" />
      <circle cx="50" cy="50" r="1" fill="#2d2d33" />
    </svg>
  );
}

/* Featured Projects — one project visible at a time, with pagination dots */
function FeaturedCarousel() {
  const launch = useLaunch();
  const unlocked = useOS((s) => s.phase === "home");
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(0);
  const [paused, setPaused] = useState(false);
  const wheelAt = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const p = FEATURED[i];
  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI((n + FEATURED.length) % FEATURED.length);
  };

  // native non-passive wheel listener so scrolling over the card only moves
  // the carousel — no mac back-swipe, no page scroll, no page flip. It only
  // fires while the cursor is over the card.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 6) return;
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - wheelAt.current < 380) return; // one project per gesture
      wheelAt.current = now;
      const step = d > 0 ? -1 : 1;
      setDir(step);
      setI((v) => (v + step + FEATURED.length) % FEATURED.length);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // auto-advance every 7s — only after the screen is unlocked (the timer starts
  // fresh the moment we reach the home screen); resets on manual nav, pauses on hover
  useEffect(() => {
    if (paused || !unlocked) return;
    const t = setTimeout(() => {
      setDir(1);
      setI((v) => (v + 1) % FEATURED.length);
    }, 7000);
    return () => clearTimeout(t);
  }, [i, paused, unlocked]);

  return (
    <div
      ref={rootRef}
      style={{ gridArea: "feat" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col rounded-[16px] bg-[#2d2d33]/94 backdrop-blur-xl p-4 pt-3 shadow-md ring-1 ring-white/10"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/70">Featured Projects</span>
        <span className="text-[11px] text-white/40">{i + 1} / {FEATURED.length}</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
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
              if (info.offset.x < -50) go(i + 1);
              else if (info.offset.x > 50) go(i - 1);
            }}
            onClick={() => launch("projects", document.body, { context: `Viewing ${p.name}`, payload: p.id })}
            className="group absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-xl text-left ring-1 ring-white/10"
            style={{ background: p.stacked ? p.color : p.light ? "#ffffff" : `linear-gradient(160deg,${p.color},#0b0b12)` }}
          >
            {p.stacked ? (
              /* badge/lanyard enlarged and centred to fill the card (no title) */
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
            ) : (
              <>
                {p.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt={p.name} style={{ objectPosition: p.pos ?? "left top" }} className={`absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-[1.05] ${p.contain ? "object-contain" : "object-cover"}`} loading="lazy" />
                )}
                {!p.noLabel && (
                  <span className={`mt-auto p-4 ${p.light ? "bg-gradient-to-t from-white via-white/85 to-transparent" : "bg-gradient-to-t from-black/80 via-black/30 to-transparent"}`}>
                    <span className={`block text-base font-semibold ${p.light ? "text-[#17181c]" : "text-white"}`}>{p.name}</span>
                    <span className={`mt-0.5 block truncate text-[11px] ${p.light ? "text-black/55" : "text-white/70"}`}>{p.sub}</span>
                  </span>
                )}
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {FEATURED.map((_, n) => (
          <button
            key={n}
            aria-label={`Project ${n + 1}`}
            onClick={() => go(n)}
            className={`h-1.5 rounded-full transition-all ${n === i ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* Favourite club — Arsenal, cartoon art with the characters centred */
function ArsenalCard() {
  return (
    <div
      style={{ gridArea: "arse" }}
      role="button"
      tabIndex={0}
      onClick={() => window.open("https://www.arsenal.com", "_blank", "noopener,noreferrer")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.open("https://www.arsenal.com", "_blank", "noopener,noreferrer"); } }}
      className="group relative overflow-hidden rounded-[16px] shadow-md ring-1 ring-white/10"
    >
      {/* sunburst backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/arsenal-rays.webp")} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]" />
      {/* characters (text stripped, bg made transparent), centred in the card */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/arsenal-cut.webp")}
        alt="Arsenal"
        className="absolute inset-0 h-full w-full object-contain px-4 py-8 transition-transform duration-300 group-hover:scale-[1.05]"
      />
      <p className="absolute left-5 top-3 text-[11px] font-semibold text-white/70">
        Favourite Club
      </p>
      <h2 className="absolute bottom-3 left-1/2 -translate-x-1/2 text-base font-bold tracking-tight text-white">
        Arsenal FC
      </h2>
      <button
        onClick={(e) => { e.stopPropagation(); window.open("https://www.arsenal.com", "_blank", "noopener,noreferrer"); }}
        className="absolute bottom-2.5 right-2.5 rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition group-hover:bg-black/75"
      >
        View
      </button>
    </div>
  );
}

export default function HomeAesthetic() {
  const launch = useLaunch();
  const isPlaying = useOS((s) => s.isPlaying);
  const toggle = useOS((s) => s.toggle);
  const next = useOS((s) => s.next);
  const prev = useOS((s) => s.prev);
  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const currentTime = useOS((s) => s.currentTime);
  const duration = useOS((s) => s.duration);
  const seek = useOS((s) => s.seek);
  const reduced = useOS((s) => s.reducedMotion);
  const track = playlist[trackIndex];
  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  // scrub the Now Playing progress bar (without opening the Music window)
  const progressRef = useRef<HTMLDivElement>(null);
  const scrub = (clientX: number) => {
    const el = progressRef.current;
    if (!el || !duration) return;
    const r = el.getBoundingClientRect();
    seek(Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration);
  };

  const open =
    (id: string, opts?: { context?: string; payload?: string }) =>
    (e: MouseEvent<HTMLButtonElement>) =>
      launch(id, e.currentTarget, opts);

  const isMobile = useOS((s) => s.tier === "mobile");

  /* Below 768px the 6×6 iPad grid can't shrink to a phone, so we reflow the
     same tiles into a scrollable two-column stack (rows are a fixed unit tall;
     tiles span rows to size themselves). The desktop/tablet layout is the
     original iPad canvas that fills the viewport. */
  const gridStyle: CSSProperties = isMobile
    ? {
        // Row unit ≈ half the column width, so every 1-column card that spans
        // 2 rows comes out an equal-sized square (~square at phone widths).
        gridTemplateColumns: "repeat(2,1fr)",
        gridAutoRows: "90px",
        gridTemplateAreas: `
          "clk   weat"
          "clk   weat"
          "nowp  nowp"
          "nowp  nowp"
          "feat  feat"
          "feat  feat"
          "feat  feat"
          "feat  feat"
          "abt   wire"
          "abt   wire"
          "why   exp"
          "why   exp"
          "clus  clus"
          "clus  clus"
          "arse  arse"
          "arse  arse"
          "arse  arse"
          "ttt   snake"
          "ttt   snake"`,
      }
    : {
        gridTemplateColumns: "repeat(6,1fr)",
        gridTemplateRows: "repeat(6,1fr)",
        gridTemplateAreas: `
          "clk   weat  feat  feat  nowp  nowp"
          "clk   weat  feat  feat  nowp  nowp"
          "abt   wire  feat  feat  arse  arse"
          "abt   wire  feat  feat  arse  arse"
          "why   exp   clus  clus  ttt   snake"
          "why   exp   clus  clus  ttt   snake"`,
      };

  return (
    <div
      className={`grid ${isMobile ? "gap-3" : "h-full gap-3.5 sm:gap-4"}`}
      style={gridStyle}
    >
      {/* Now Playing card */}
      <Tile area="nowp" i={0} onClick={open("music", { context: "Now Playing" })} className="flex flex-col justify-between bg-[#2d2d33]/94 backdrop-blur-xl p-4">
        <div className="flex min-h-0 flex-1 items-stretch gap-4">
          {/* album art (left, spans height) */}
          <div className="relative aspect-square h-full shrink-0 overflow-hidden rounded-2xl">
            <AlbumCover artwork={track?.artwork} seed={trackIndex} title={track?.title} artist={track?.artist} cover={track?.cover} />
          </div>

          {/* right column: info + controls */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div>
              <p className="text-[11px] font-medium text-white/50">Now Playing</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="truncate text-base font-bold leading-tight text-white">{track?.title ?? "Maina"}</p>
                <span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px] font-bold leading-none text-white/80">E</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-white/50">{track?.artist ?? "Seedhe Maut"}</p>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-7">
                <span role="button" tabIndex={0} aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev(); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); prev(); } }} className="active:scale-90">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6v12H5V6zM20 6v12l-9-6z" /></svg>
                </span>
                <span role="button" tabIndex={0} aria-label={isPlaying ? "Pause" : "Play"} onClick={(e) => { e.stopPropagation(); toggle(); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); toggle(); } }} className="active:scale-90">
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.3" /><rect x="14" y="5" width="4" height="14" rx="1.3" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </span>
                <span role="button" tabIndex={0} aria-label="Next" onClick={(e) => { e.stopPropagation(); next(); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); next(); } }} className="active:scale-90">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6v12h2V6zM4 6v12l9-6z" /></svg>
                </span>
              </div>
              {/* expand / AirPlay-style toggle */}
              <span className="text-white/45" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9l4-4 4 4M8 15l4 4 4-4" /></svg>
              </span>
            </div>
          </div>
        </div>

        {/* full-width progress bar with times on either side */}
        <div className="mt-3 flex items-center gap-3 text-[11px] tabular-nums text-white/45">
          <span>{formatTime(currentTime)}</span>
          {/* clickable scrubber — seeks without opening the Music window */}
          <div
            ref={progressRef}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(currentTime)}
            aria-valuemax={Math.round(duration) || 0}
            tabIndex={0}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); scrub(e.clientX); }}
            className="relative -my-1.5 flex-1 cursor-pointer py-1.5"
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#ff8a00,#ff9f0a)" }} />
            </div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </Tile>

      {/* current focus — Apple-style progress tracker */}
      <Tile area="wire" i={2} style={{ cursor: "default" }} className="flex flex-col bg-[#2d2d33]/94 backdrop-blur-xl p-3.5">
        <p className="text-[11px] font-semibold text-white/70">Current Focus</p>

        <div className="flex flex-1 flex-col justify-center gap-4">
          {[
            { label: "Research", pct: 90 },
            { label: "Wireframes", pct: 70 },
            { label: "Prototype", pct: 40 },
          ].map((f, i) => (
            <div key={f.label}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[11px] font-medium text-white/80">{f.label}</span>
                <span className="text-[10px] font-semibold tabular-nums text-white/45">{f.pct}%</span>
              </div>
              <div className="h-[5px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-white/85"
                  initial={{ width: 0 }}
                  animate={{ width: `${f.pct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 }}
                />
              </div>
            </div>
          ))}
        </div>
      </Tile>

      {/* clock — squared analog clock, dark themed */}
      <Tile area="clk" i={0} style={{ cursor: "default" }} className="flex items-center justify-center bg-[#2d2d33]/94 backdrop-blur-xl">
        <div className={`aspect-square ${isMobile ? "w-[72%]" : "w-[86%]"}`}>
          <ClockFace />
        </div>
      </Tile>

      {/* about me — full-width orange header (opens Finder → About section) */}
      <Tile area="abt" i={1} onClick={open("finder", { context: "About Obaid", payload: "about" })} className="flex flex-col bg-[#2d2d33]/94 backdrop-blur-xl">
        <div className="flex items-center gap-2 bg-[#ff9f0a] px-3.5 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z" />
          </svg>
          <span className="text-xs font-bold text-white">About Me</span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-base font-bold leading-snug text-white">Hi, I&apos;m Obaid</p>
          <p className="mt-1 text-xs leading-tight text-white/55">UX Engineer &amp; Product Designer</p>
          <p className="mt-auto text-xs text-white/45">Jaipur, India</p>
        </div>
      </Tile>

      {/* weather — macOS dark-mode deep-blue theme */}
      <Tile area="weat" i={6} className="rounded-[16px] bg-[#2d2d33]/94 backdrop-blur-xl p-3.5" style={{ cursor: "default" }}>
        <WeatherContent />
      </Tile>

      {/* Workspace — macOS-style productivity tools widget */}
      <Workspace />

      {/* Featured Projects — one-at-a-time carousel */}
      <FeaturedCarousel />

      {/* Favourite club — Arsenal (matches page 4) */}
      <ArsenalCard />

      {/* games — thumbnail cards that open the playable window */}
      <GameCard area="ttt" id="tictactoe" name="Tic-Tac-Toe" img={asset("/tictactoe.webp")} />
      <GameCard area="snake" id="snake" name="Snake Chase" img={asset("/snake.webp")} />

      {/* Why Hire Me — value proposition card */}
      <motion.div
        style={{ gridArea: "why", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
        initial={reduced ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.24, type: "spring", stiffness: 420, damping: 30 }}
        className="relative flex flex-col overflow-hidden rounded-[16px] bg-[#2d2d33]/94 p-3.5 ring-1 ring-white/10 backdrop-blur-xl"
      >
        <span className="text-[11px] font-semibold text-white/70">Why Hire Me?</span>
        <ul className="mt-3 flex flex-1 flex-col justify-center gap-2 text-left">
          {["Design Systems", "Enterprise UX", "Product Thinking", "Frontend Awareness", "AI-Driven Workflows"].map((s) => (
            <li key={s} className="flex items-center gap-2 text-[13.5px] font-semibold leading-tight text-white/90">
              <span className="h-1 w-1 shrink-0 rounded-full bg-white/40" />
              {s}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Experience timeline card */}
      <Tile area="exp" i={10} onClick={open("finder", { context: "Professional Experience", payload: "experience" })} className="flex flex-col bg-[#2d2d33]/94 p-3.5 backdrop-blur-xl">
        <span className="text-[11px] font-semibold text-white/70">Experience</span>
        <div className="mt-3 flex flex-1 flex-col justify-center">
          <div className="relative flex flex-col gap-4">
            <span aria-hidden className="absolute bottom-[7px] left-[3.5px] top-[7px] w-px bg-white/15" />
            {[
              { years: "2025 — 2026", company: "Ensylon" },
              { years: "2024 — 2025", company: "Cognitive Stars" },
              { years: "2022 — 2023", company: "TechCream" },
            ].map((e) => (
              <div key={e.company} className="flex gap-3">
                <span className="relative z-10 mt-[3px] h-[7px] w-[7px] shrink-0 rounded-full bg-white/70 ring-2 ring-[#2d2d33]" />
                <div>
                  <p className="text-[10px] font-medium leading-none text-white/45">{e.years}</p>
                  <p className="mt-1 text-[13.5px] font-semibold leading-tight text-white/90">{e.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tile>
    </div>
  );
}

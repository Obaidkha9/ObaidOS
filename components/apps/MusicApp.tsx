"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOS, type Track } from "@/lib/store";
import { formatTime, spring } from "@/lib/utils";
import { useItunesCover } from "@/lib/useItunesCover";

/* eighth-note glyph shown when no cover image is available */
function NoteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="15.5" r="2.5" />
      <path d="M9 17.5V6l11-2v11.5" />
    </svg>
  );
}

/* album tile — always renders something: cover image, else gradient + note */
function Art({ track, url, className, iconClass }: { track?: Track; url?: string | null; className: string; iconClass: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: track?.artwork ?? "#222" }}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={track?.title ?? ""} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-white/80"><NoteGlyph className={iconClass} /></span>
      )}
    </div>
  );
}

/* now-playing equalizer */
function Equalizer() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-[#ff9f0a]" animate={{ height: [4, 12, 6, 14, 4] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }} />
      ))}
    </span>
  );
}

function TrackRow({ t, i, active, playing, onSelect }: { t: Track; i: number; active: boolean; playing: boolean; onSelect?: () => void }) {
  // only fetch remotely when there's no locally-saved cover
  const live = useItunesCover(t.cover ? "" : `${t.artist} ${t.title}`);
  const url = t.cover || live;
  return (
    <button
      onClick={() => { useOS.setState({ trackIndex: i, currentTime: 0, isPlaying: true }); onSelect?.(); }}
      className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${active ? "bg-[#ff9f0a]/15" : "hover:bg-white/[0.07]"}`}
    >
      <span className={`w-5 shrink-0 text-center text-[12px] tabular-nums ${active ? "text-[#ff9f0a]" : "text-white/40"}`}>{String(i + 1).padStart(2, "0")}</span>
      <Art track={t} url={url} className="h-11 w-11 shrink-0 rounded-md ring-1 ring-white/10" iconClass="h-5 w-5" />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[14px] font-medium ${active ? "text-[#ff9f0a]" : "text-white"}`}>{t.title}</span>
        <span className="block truncate text-[12px] text-white/50">{t.artist}</span>
      </span>
      {active && playing ? <Equalizer /> : null}
    </button>
  );
}

export default function MusicApp() {
  const isMobile = useOS((s) => s.tier === "mobile");
  const [showList, setShowList] = useState(false);
  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const isPlaying = useOS((s) => s.isPlaying);
  const currentTime = useOS((s) => s.currentTime);
  const duration = useOS((s) => s.duration);
  const toggle = useOS((s) => s.toggle);
  const next = useOS((s) => s.next);
  const prev = useOS((s) => s.prev);
  const seek = useOS((s) => s.seek);

  const track = playlist[trackIndex];
  const live = useItunesCover(track && !track.cover ? `${track.artist} ${track.title}` : "");
  const cover = track?.cover || live;
  const barRef = useRef<HTMLDivElement>(null);

  const progress = duration ? currentTime / duration : 0;
  const scrub = (clientX: number) => {
    const el = barRef.current;
    if (!el || !duration) return;
    const r = el.getBoundingClientRect();
    seek(Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration);
  };

  return (
    <div className="relative flex h-full text-white" style={{ fontFamily: "var(--font-sans)", background: "#141414" }}>
      {/* LEFT — now playing (full width on mobile) */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-8 py-6 ${isMobile ? "w-full" : "w-[60%]"}`}>
        {isMobile && (
          <button
            onClick={() => setShowList(true)}
            aria-label="Show playlist"
            className="absolute right-4 top-4 flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-white/80 transition active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            <span className="text-[12px] font-medium">Playlist</span>
          </button>
        )}
        <motion.div
          animate={{ scale: isPlaying ? 1 : 0.92 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="aspect-square w-full max-w-[230px]"
        >
          <Art track={track} url={cover} className="h-full w-full rounded-2xl ring-1 ring-white/10" iconClass="h-16 w-16" />
        </motion.div>

        <div className="mt-6 w-full max-w-[300px] text-center">
          <h2 className="truncate text-[22px] font-bold leading-tight">{track?.title ?? "Not Playing"}</h2>
          <p className="truncate text-[15px] text-white/60">{track?.artist ?? "—"}</p>
        </div>

        <div ref={barRef} onClick={(e) => scrub(e.clientX)} className="mt-5 h-6 w-full max-w-[300px] cursor-pointer" role="slider" aria-label="Seek" aria-valuenow={Math.round(currentTime)} aria-valuemax={Math.round(duration) || 0}>
          <div className="relative top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/20">
            <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#ff8a00,#ff9f0a)" }} />
          </div>
        </div>
        <div className="flex w-full max-w-[300px] justify-between text-[11px] tabular-nums text-white/45">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-9">
          <button onClick={prev} aria-label="Previous" className="text-white/90 transition active:scale-90">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6v12H5V6zM20 6v12l-9-6z" /></svg>
          </button>
          <button onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"} className="flex h-14 w-14 items-center justify-center rounded-full text-black transition active:scale-90" style={{ background: "#ff9f0a" }}>
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.4" /><rect x="14" y="5" width="4" height="14" rx="1.4" /></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button onClick={next} aria-label="Next" className="text-white/90 transition active:scale-90">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6v12h2V6zM4 6v12l9-6z" /></svg>
          </button>
        </div>
      </div>

      {/* RIGHT — OBAID.FM collection (desktop/tablet only) */}
      {!isMobile && (
        <div className="relative z-10 flex min-h-0 w-[40%] flex-col border-l border-white/10 bg-[#1c1c1e] px-5 py-6">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[16px] font-bold tracking-wide">Obaid.fm</span>
            <span className="text-[11px] text-white/45">{playlist.length} tracks · Personal Collection</span>
          </div>
          <div className="app-scroll -mx-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2">
            {playlist.map((t, i) => (
              <TrackRow key={t.id} t={t} i={i} active={i === trackIndex} playing={isPlaying} />
            ))}
          </div>
        </div>
      )}

      {/* MOBILE — playlist as a slide-up sheet with a traffic-light close */}
      <AnimatePresence>
        {isMobile && showList && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring.soft}
            className="absolute inset-0 z-50 flex flex-col bg-[#1c1c1e]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <button
                onClick={() => setShowList(false)}
                aria-label="Close playlist"
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] ring-1 ring-black/20 active:brightness-90"
              />
              <span className="text-[16px] font-bold tracking-wide">Obaid.fm</span>
              <span className="ml-1 text-[11px] text-white/45">{playlist.length} tracks · Personal Collection</span>
            </div>
            <div className="app-scroll min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3">
              {playlist.map((t, i) => (
                <TrackRow key={t.id} t={t} i={i} active={i === trackIndex} playing={isPlaying} onSelect={() => setShowList(false)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

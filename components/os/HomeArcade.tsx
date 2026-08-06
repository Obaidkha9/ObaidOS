"use client";

import { motion } from "framer-motion";
import { type ReactNode, type MouseEvent } from "react";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";

/* ------------------------------------------------------------------ */
/*  Page 5 — Arcade. A grid of playable games (each opens in a window). */
/* ------------------------------------------------------------------ */

type Game = { id: string; name: string; tag: string; bg: string; art: ReactNode };

/* ---- illustrated glyphs for each card ---- */
const DinoArt = (
  <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    <rect x="70" y="30" width="18" height="34" rx="7" fill="#2b2b30" />
    <rect x="82" y="22" width="16" height="16" rx="5" fill="#2b2b30" />
    <circle cx="93" cy="28" r="1.8" fill="#fff" />
    <rect x="30" y="40" width="8" height="24" rx="4" fill="#3faa5a" />
    <rect x="24" y="48" width="6" height="10" rx="3" fill="#3faa5a" />
    <line x1="10" y1="66" x2="110" y2="66" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
  </svg>
);
const C4Art = (
  <svg viewBox="0 0 90 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    <rect x="12" y="8" width="66" height="64" rx="8" fill="#1b4fd1" />
    {[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => {
      const fill = (c + r) % 3 === 0 ? "#ff4d4d" : (c + r) % 3 === 1 ? "#ffd21f" : "#0e3aa0";
      return <circle key={`${c}-${r}`} cx={22 + c * 16} cy={20 + r * 17} r="6.5" fill={fill} />;
    }))}
  </svg>
);
const PongArt = (
  <svg viewBox="0 0 120 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    <rect x="14" y="24" width="7" height="32" rx="3" fill="#fff" />
    <rect x="99" y="12" width="7" height="32" rx="3" fill="#fff" />
    <circle cx="60" cy="42" r="6" fill="#fff" />
    <line x1="60" y1="8" x2="60" y2="72" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="5 7" />
  </svg>
);
const BreakoutArt = (
  <svg viewBox="0 0 110 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    {["#ff5b5b", "#ff9f0a", "#ffd21f"].map((c, r) => [0, 1, 2, 3].map((i) => (
      <rect key={`${r}-${i}`} x={12 + i * 22} y={12 + r * 12} width="18" height="8" rx="2" fill={c} />
    )))}
    <rect x="44" y="66" width="26" height="7" rx="3" fill="#fff" />
    <circle cx="57" cy="54" r="5" fill="#fff" />
  </svg>
);
const MoleArt = (
  <svg viewBox="0 0 90 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    <ellipse cx="45" cy="66" rx="34" ry="9" fill="#3c2815" />
    <path d="M28 62 a17 17 0 0 1 34 0 z" fill="#a9743f" />
    <circle cx="39" cy="52" r="2.4" fill="#000" />
    <circle cx="51" cy="52" r="2.4" fill="#000" />
    <ellipse cx="45" cy="58" rx="4" ry="2.6" fill="#3c2815" />
  </svg>
);
const SimonArt = (
  <svg viewBox="0 0 80 80" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
    <path d="M40 40 L40 8 A32 32 0 0 0 8 40 Z" fill="#4ade80" />
    <path d="M40 40 L72 40 A32 32 0 0 0 40 8 Z" fill="#f87171" />
    <path d="M40 40 L8 40 A32 32 0 0 0 40 72 Z" fill="#fde047" />
    <path d="M40 40 L40 72 A32 32 0 0 0 72 40 Z" fill="#60a5fa" />
    <circle cx="40" cy="40" r="10" fill="#0d0d12" />
  </svg>
);

const GAMES: Game[] = [
  { id: "dino", name: "Dino Run", tag: "Endless runner", bg: "linear-gradient(160deg,#e8ebef,#bcc4cd)", art: DinoArt },
  { id: "connectfour", name: "Connect Four", tag: "vs AI", bg: "linear-gradient(160deg,#2f6bff,#1233a8)", art: C4Art },
  { id: "pong", name: "Pong", tag: "vs AI", bg: "linear-gradient(160deg,#1f2937,#0b1220)", art: PongArt },
  { id: "breakout", name: "Breakout", tag: "Brick breaker", bg: "linear-gradient(160deg,#243049,#0f1424)", art: BreakoutArt },
  { id: "whackamole", name: "Whack-a-Mole", tag: "Beat the clock", bg: "linear-gradient(160deg,#2f7d32,#123a16)", art: MoleArt },
  { id: "simon", name: "Simon", tag: "Memory", bg: "linear-gradient(160deg,#3a2b6b,#161029)", art: SimonArt },
];

function GameTile({ game, i }: { game: Game; i: number }) {
  const launch = useLaunch();
  const reduced = useOS((s) => s.reducedMotion);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => launch(game.id, e.currentTarget, { context: `Playing ${game.name}` });
  return (
    <motion.button
      onClick={onClick}
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.04 + i * 0.05, type: "spring", stiffness: 380, damping: 28 }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] text-left shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition active:scale-[0.98]"
      style={{ background: game.bg }}
    >
      <div className="flex flex-1 items-center justify-center p-5 transition-transform duration-300 group-hover:scale-105">
        <div className="h-[64%] max-h-[120px] w-[70%]">{game.art}</div>
      </div>
      <div className="flex items-center justify-between bg-black/25 px-4 py-2.5 backdrop-blur-sm">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{game.name}</p>
          <p className="truncate text-[11px] text-white/60">{game.tag}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">Play</span>
      </div>
    </motion.button>
  );
}

export default function HomeArcade() {
  return (
    <div className="app-scroll h-full overflow-y-auto px-6 py-6 sm:px-12 sm:py-8 lg:px-20 lg:py-10">
      <div className="mx-auto flex h-full max-w-5xl flex-col">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-white drop-shadow">Arcade</h1>
            <p className="mt-0.5 text-sm text-white/70 drop-shadow">Six little games — tap to play.</p>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <GameTile key={g.id} game={g} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

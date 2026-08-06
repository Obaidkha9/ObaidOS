"use client";

import { useEffect, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Connect Four — you (red) vs AI (yellow). Click a column to drop. */
const COLS = 7, ROWS = 6;
type Disc = "R" | "Y" | null;

function makeGrid(): Disc[][] {
  return Array.from({ length: ROWS }, () => Array<Disc>(COLS).fill(null));
}
function dropRow(g: Disc[][], col: number) {
  for (let r = ROWS - 1; r >= 0; r--) if (!g[r][col]) return r;
  return -1;
}
function winnerAt(g: Disc[][]): Disc {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const v = g[r][c]; if (!v) continue;
    for (const [dr, dc] of dirs) {
      let k = 1;
      while (k < 4 && g[r + dr * k]?.[c + dc * k] === v) k++;
      if (k === 4) return v;
    }
  }
  return null;
}
function aiMove(g: Disc[][]): number {
  const valid = [...Array(COLS).keys()].filter((c) => dropRow(g, c) >= 0);
  // 1) win now
  for (const c of valid) { const r = dropRow(g, c); g[r][c] = "Y"; const w = winnerAt(g) === "Y"; g[r][c] = null; if (w) return c; }
  // 2) block player win
  for (const c of valid) { const r = dropRow(g, c); g[r][c] = "R"; const w = winnerAt(g) === "R"; g[r][c] = null; if (w) return c; }
  // 3) avoid giving player an immediate win on top
  const safe = valid.filter((c) => {
    const r = dropRow(g, c); g[r][c] = "Y";
    const r2 = dropRow(g, c); let bad = false;
    if (r2 >= 0) { g[r2][c] = "R"; bad = winnerAt(g) === "R"; g[r2][c] = null; }
    g[r][c] = null; return !bad;
  });
  const pool = safe.length ? safe : valid;
  // 4) prefer center
  pool.sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b));
  const bestDist = Math.abs(3 - pool[0]);
  const top = pool.filter((c) => Math.abs(3 - c) === bestDist);
  return top[Math.floor(Math.random() * top.length)];
}

export default function ConnectFourApp(_: AppProps) {
  const [grid, setGrid] = useState<Disc[][]>(makeGrid);
  const [turn, setTurn] = useState<"R" | "Y">("R");
  const win = winnerAt(grid);
  const full = grid[0].every(Boolean);
  const status = win ? (win === "R" ? "You win! 🎉" : "AI wins") : full ? "Draw" : turn === "R" ? "Your turn" : "AI thinking…";

  const drop = (col: number) => {
    if (win || turn !== "R") return;
    const r = dropRow(grid, col); if (r < 0) return;
    const g = grid.map((row) => row.slice());
    g[r][col] = "R"; setGrid(g); setTurn("Y");
  };
  const reset = () => { setGrid(makeGrid()); setTurn("R"); };

  useEffect(() => {
    if (turn !== "Y" || win || full) return;
    const t = setTimeout(() => {
      const g = grid.map((row) => row.slice());
      const c = aiMove(g); const r = dropRow(g, c);
      if (r >= 0) g[r][c] = "Y";
      setGrid(g); setTurn("R");
    }, 450);
    return () => clearTimeout(t);
  }, [turn, grid, win, full]);

  return (
    <div className="flex h-full flex-col bg-[#0f0f10] p-5 text-white" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">Connect Four</h1>
          <p className="text-xs text-white/45">You vs AI</p>
        </div>
        <button onClick={reset} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/80 transition hover:bg-white/15 active:scale-95">Reset</button>
      </div>

      <div className="mx-auto w-full max-w-[360px] rounded-2xl bg-[#1b4fd1] p-2.5">
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: COLS }).map((_, c) => (
            <button key={c} onClick={() => drop(c)} disabled={!!win || turn !== "R"} aria-label={`Drop column ${c + 1}`} className="flex flex-col gap-1.5 rounded-md transition hover:bg-white/10 disabled:hover:bg-transparent">
              {Array.from({ length: ROWS }).map((_, r) => {
                const v = grid[r][c];
                return <span key={r} className="aspect-square w-full rounded-full" style={{ background: v === "R" ? "#ff4d4d" : v === "Y" ? "#ffd21f" : "#0e3aa0" }} />;
              })}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-white/70">{status}</p>
    </div>
  );
}

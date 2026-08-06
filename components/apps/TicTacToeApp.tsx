"use client";

import { useEffect, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Tic-Tac-Toe — you (X) vs an unbeatable minimax AI (O). */
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
type Cell = "X" | "O" | null;
function winLine(b: Cell[]) {
  for (const l of LINES) {
    const [a, c, d] = l;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return l;
  }
  return null;
}
function minimax(b: Cell[], isMax: boolean): number {
  const l = winLine(b);
  const w = l ? b[l[0]] : null;
  if (w === "O") return 10;
  if (w === "X") return -10;
  if (b.every(Boolean)) return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = isMax ? "O" : "X";
    const s = minimax(b, !isMax);
    b[i] = null;
    best = isMax ? Math.max(best, s) : Math.min(best, s);
  }
  return best;
}
function bestMove(board: Cell[]) {
  const b = board.slice();
  let best = -Infinity;
  let m = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = "O";
    const s = minimax(b, false);
    b[i] = null;
    if (s > best) { best = s; m = i; }
  }
  return m;
}

export default function TicTacToeApp(_: AppProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const line = winLine(board);
  const win = line ? board[line[0]] : null;
  const full = board.every(Boolean);
  const status = win
    ? win === "X" ? "You win! 🎉" : "AI wins"
    : full ? "Draw" : turn === "X" ? "Your move" : "AI thinking…";

  const play = (i: number) => {
    if (board[i] || win || turn !== "X") return;
    const b = board.slice();
    b[i] = "X";
    setBoard(b);
    setTurn("O");
  };
  const reset = () => { setBoard(Array(9).fill(null)); setTurn("X"); };

  useEffect(() => {
    if (turn !== "O" || win || full) return;
    const t = setTimeout(() => {
      const m = bestMove(board);
      if (m >= 0) {
        const b = board.slice();
        b[m] = "O";
        setBoard(b);
      }
      setTurn("X");
    }, 430);
    return () => clearTimeout(t);
  }, [turn, board, win, full]);

  return (
    <div className="flex h-full flex-col bg-[#0f0f10] p-6 text-white" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">Tic-Tac-Toe</h1>
          <p className="text-xs text-white/45">vs unbeatable AI</p>
        </div>
        <button onClick={reset} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/80 transition hover:bg-white/15 active:scale-95">Reset</button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-2.5">
        {board.map((c, i) => {
          const wc = line?.includes(i);
          return (
            <button
              key={i}
              onClick={() => play(i)}
              disabled={!!c || !!win || turn !== "X"}
              aria-label={`cell ${i + 1}`}
              className={`flex items-center justify-center rounded-2xl text-5xl font-black ring-1 ring-white/10 transition active:scale-95 disabled:active:scale-100 ${wc ? "bg-white/15" : "bg-white/[0.04] hover:bg-white/[0.07]"}`}
            >
              <span className={c === "X" ? "text-[#7c8cff]" : "text-[#ff9f0a]"}>{c}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm font-medium text-white/70">{status}</p>
    </div>
  );
}

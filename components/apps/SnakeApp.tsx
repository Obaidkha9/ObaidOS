"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AppProps } from "./AppChrome";

const SIZE = 15;
type P = { x: number; y: number };

function DpadBtn({ onClick, children, label }: { onClick: () => void; children: ReactNode; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex h-11 items-center justify-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/15 active:scale-90">
      {children}
    </button>
  );
}

export default function SnakeApp(_: AppProps) {
  const [snake, setSnake] = useState<P[]>([{ x: 7, y: 9 }]);
  const [food, setFood] = useState<P>({ x: 7, y: 4 });
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef<P>({ x: 0, y: -1 });
  const foodRef = useRef(food);
  foodRef.current = food;

  const turn = (nd: P) => {
    const d = dirRef.current;
    if (nd.x !== -d.x && nd.y !== -d.y) dirRef.current = nd;
  };

  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, P> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      turn(nd);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setSnake((s) => {
        const d = dirRef.current;
        const head = { x: s[0].x + d.x, y: s[0].y + d.y };
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || s.some((p) => p.x === head.x && p.y === head.y)) {
          setOver(true);
          setRunning(false);
          return s;
        }
        const ns = [head, ...s];
        const f = foodRef.current;
        if (head.x === f.x && head.y === f.y) {
          setScore((v) => v + 1);
          let nf: P;
          do {
            nf = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
          } while (ns.some((p) => p.x === nf.x && p.y === nf.y));
          setFood(nf);
        } else {
          ns.pop();
        }
        return ns;
      });
    }, 130);
    return () => clearInterval(iv);
  }, [running]);

  const start = () => {
    setSnake([{ x: 7, y: 9 }]);
    dirRef.current = { x: 0, y: -1 };
    setFood({ x: 7, y: 4 });
    setScore(0);
    setOver(false);
    setRunning(true);
  };

  return (
    <div className="flex h-full flex-col justify-center bg-[#0f0f10] p-5 text-white" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Snake Chase</h1>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/80">Score {score}</span>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[330px]">
        <div
          className="absolute inset-0 grid overflow-hidden rounded-2xl bg-black/50 ring-1 ring-white/10"
          style={{ gridTemplateColumns: `repeat(${SIZE},1fr)`, gridTemplateRows: `repeat(${SIZE},1fr)` }}
        >
          {snake.map((p, i) => (
            <span key={i} style={{ gridColumn: p.x + 1, gridRow: p.y + 1 }} className={`m-[1px] rounded-[3px] ${i === 0 ? "bg-[#5b8cff]" : "bg-[#34c759]"}`} />
          ))}
          <span style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }} className="m-[2px] rounded-full bg-[#ff453a]" />
        </div>
        {!running && (
          <button onClick={start} className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 text-base font-semibold text-white backdrop-blur-sm">
            {over ? "Game Over · Play again" : "Tap to play ▸"}
          </button>
        )}
      </div>

      {/* on-screen d-pad for touch */}
      <div className="mx-auto mt-5 grid w-[168px] grid-cols-3 grid-rows-2 gap-2">
        <span />
        <DpadBtn label="Up" onClick={() => turn({ x: 0, y: -1 })}>▲</DpadBtn>
        <span />
        <DpadBtn label="Left" onClick={() => turn({ x: -1, y: 0 })}>◀</DpadBtn>
        <DpadBtn label="Down" onClick={() => turn({ x: 0, y: 1 })}>▼</DpadBtn>
        <DpadBtn label="Right" onClick={() => turn({ x: 1, y: 0 })}>▶</DpadBtn>
      </div>
      <p className="mt-3 text-center text-xs text-white/35">Arrow keys or the pad to move</p>
    </div>
  );
}

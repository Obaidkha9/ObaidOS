"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Breakout — move the paddle with the mouse or ← →. Clear all the bricks. */
const W = 400, H = 480;
const PW = 74, PH = 12, R = 7;
const COLS = 7, ROWS = 5, BW = 50, BH = 18, TOP = 54, LEFT = 11, GAPX = 4, GAPY = 8;
const COLORS = ["#ff5b5b", "#ff9f0a", "#ffd21f", "#34c759", "#0a84ff"];

type Brick = { x: number; y: number; alive: boolean; c: string };

function makeBricks(): Brick[] {
  const arr: Brick[] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    arr.push({ x: LEFT + c * (BW + GAPX), y: TOP + r * (BH + GAPY), alive: true, c: COLORS[r % COLORS.length] });
  }
  return arr;
}

export default function BreakoutApp(_: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over" | "won">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const phaseRef = useRef(phase); phaseRef.current = phase;

  const px = useRef(W / 2 - PW / 2);
  const ball = useRef({ x: W / 2, y: H - 60, vx: 3, vy: -3.4 });
  const bricks = useRef<Brick[]>(makeBricks());
  const scoreRef = useRef(0), livesRef = useRef(3);
  const keys = useRef({ l: false, r: false });

  const resetBall = () => { ball.current = { x: px.current + PW / 2, y: H - 60, vx: 3 * (Math.random() < 0.5 ? 1 : -1), vy: -3.4 }; };
  const start = () => {
    bricks.current = makeBricks(); scoreRef.current = 0; livesRef.current = 3;
    setScore(0); setLives(3); px.current = W / 2 - PW / 2; resetBall();
    phaseRef.current = "playing"; setPhase("playing");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") { keys.current.l = true; e.preventDefault(); } if (e.key === "ArrowRight") { keys.current.r = true; e.preventDefault(); } };
    const up = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") keys.current.l = false; if (e.key === "ArrowRight") keys.current.r = false; };
    window.addEventListener("keydown", down, { capture: true });
    window.addEventListener("keyup", up, { capture: true });
    return () => { window.removeEventListener("keydown", down, { capture: true } as EventListenerOptions); window.removeEventListener("keyup", up, { capture: true } as EventListenerOptions); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.fillStyle = "#0f1424"; ctx.fillRect(0, 0, W, H);
      for (const b of bricks.current) { if (!b.alive) continue; ctx.fillStyle = b.c; roundRect(ctx, b.x, b.y, BW, BH, 4); ctx.fill(); }
      ctx.fillStyle = "#e8eaf0"; roundRect(ctx, px.current, H - 28, PW, PH, 6); ctx.fill();
      ctx.beginPath(); ctx.arc(ball.current.x, ball.current.y, R, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "700 15px -apple-system, Arial, sans-serif";
      ctx.textAlign = "left"; ctx.fillText(`Score ${scoreRef.current}`, 12, 26);
      ctx.textAlign = "right"; ctx.fillText("♥".repeat(livesRef.current), W - 12, 26);
    };

    let raf = 0;
    const loop = () => {
      if (phaseRef.current === "playing") {
        if (keys.current.l) px.current -= 7;
        if (keys.current.r) px.current += 7;
        px.current = Math.max(0, Math.min(W - PW, px.current));
        const b = ball.current;
        b.x += b.vx; b.y += b.vy;
        if (b.x < R) { b.x = R; b.vx *= -1; }
        if (b.x > W - R) { b.x = W - R; b.vx *= -1; }
        if (b.y < R) { b.y = R; b.vy *= -1; }
        // paddle
        if (b.y + R > H - 28 && b.y + R < H - 28 + PH + 6 && b.x > px.current && b.x < px.current + PW && b.vy > 0) {
          b.vy = -Math.abs(b.vy); b.vx += ((b.x - (px.current + PW / 2)) / (PW / 2)) * 2;
        }
        if (b.y > H) {
          livesRef.current--; setLives(livesRef.current);
          if (livesRef.current <= 0) { phaseRef.current = "over"; setPhase("over"); } else resetBall();
        }
        // bricks
        for (const br of bricks.current) {
          if (!br.alive) continue;
          if (b.x > br.x - R && b.x < br.x + BW + R && b.y > br.y - R && b.y < br.y + BH + R) {
            br.alive = false; scoreRef.current += 10; setScore(scoreRef.current);
            const fromSide = b.x < br.x || b.x > br.x + BW;
            if (fromSide) b.vx *= -1; else b.vy *= -1;
            break;
          }
        }
        if (bricks.current.every((br) => !br.alive)) { phaseRef.current = "won"; setPhase("won"); }
      }
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    px.current = Math.max(0, Math.min(W - PW, x - PW / 2));
  };

  return (
    <div className="relative flex h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden bg-[#0f1424]" style={{ fontFamily: "var(--font-sans)" }} onPointerDown={() => { if (phase !== "playing") start(); }}>
      <canvas ref={canvasRef} className="block h-full w-full" onPointerMove={onMove} />
      {phase !== "playing" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/60 px-7 py-5 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-white">{phase === "won" ? "You cleared it! 🎉" : phase === "over" ? "Game Over" : "Breakout"}</p>
            {(phase === "over" || phase === "won") && <p className="mt-1 text-[13px] text-white/80">Score {score}</p>}
            <p className="mt-2 text-[13px] font-medium text-white/90">Mouse or ← → · tap to {phase === "idle" ? "start" : "play again"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

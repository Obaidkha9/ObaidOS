"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Dino Run — endless runner. Space / ↑ / tap to jump. */
const W = 600, H = 260, GROUND = 210;

type Obs = { x: number; w: number; h: number };

export default function DinoRunApp(_: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const dino = useRef({ y: GROUND, vy: 0 });
  const obs = useRef<Obs[]>([]);
  const speed = useRef(4.2);
  const scoreRef = useRef(0);
  const nextGap = useRef(0);

  const start = () => {
    dino.current = { y: GROUND, vy: 0 };
    obs.current = [];
    speed.current = 4.2;
    scoreRef.current = 0;
    setScore(0);
    nextGap.current = 60;
    phaseRef.current = "playing";
    setPhase("playing");
  };
  const jump = () => {
    if (phaseRef.current !== "playing") { start(); return; }
    if (dino.current.y >= GROUND) dino.current.vy = -12;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); e.stopImmediatePropagation(); jump(); }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(dpr, dpr);
    const DW = 34, DH = 38;

    const over = () => {
      if (phaseRef.current !== "playing") return;
      phaseRef.current = "over"; setPhase("over");
      setBest((p) => Math.max(p, scoreRef.current));
    };
    const render = () => {
      ctx.fillStyle = "#f5f6f8"; ctx.fillRect(0, 0, W, H);
      // ground
      ctx.strokeStyle = "#9aa0a8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 2); ctx.lineTo(W, GROUND + 2); ctx.stroke();
      // obstacles (cacti)
      ctx.fillStyle = "#3faa5a";
      for (const o of obs.current) {
        ctx.beginPath();
        // rounded cactus
        const r = 5;
        const x = o.x, y = GROUND + 2 - o.h, w = o.w, h = o.h;
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, 0);
        ctx.lineTo(x, y + h); ctx.arcTo(x, y, x + r, y, r); ctx.closePath(); ctx.fill();
      }
      // dino
      const d = dino.current;
      ctx.fillStyle = "#2b2b30";
      const dx = 60, dy = d.y - DH;
      ctx.beginPath();
      const rr = 8;
      ctx.moveTo(dx + rr, dy); ctx.arcTo(dx + DW, dy, dx + DW, dy + DH, rr);
      ctx.arcTo(dx + DW, dy + DH, dx, dy + DH, rr); ctx.arcTo(dx, dy + DH, dx, dy, rr);
      ctx.arcTo(dx, dy, dx + DW, dy, rr); ctx.closePath(); ctx.fill();
      // eye
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(dx + DW - 8, dy + 11, 3, 0, Math.PI * 2); ctx.fill();
      // score
      ctx.fillStyle = "#6b7280"; ctx.font = "700 16px -apple-system, Arial, sans-serif"; ctx.textAlign = "right";
      ctx.fillText(String(scoreRef.current).padStart(5, "0"), W - 16, 28);
    };

    let raf = 0, frame = 0;
    const loop = () => {
      if (phaseRef.current === "playing") {
        frame++;
        const d = dino.current;
        d.vy += 0.62; d.y += d.vy;
        if (d.y > GROUND) { d.y = GROUND; d.vy = 0; }
        speed.current += 0.0016;
        for (const o of obs.current) o.x -= speed.current;
        while (obs.current.length && obs.current[0].x + obs.current[0].w < -4) obs.current.shift();
        nextGap.current -= speed.current;
        if (nextGap.current <= 0) {
          const h = 26 + Math.floor(Math.random() * 26);
          obs.current.push({ x: W + 10, w: 14 + Math.floor(Math.random() * 12), h });
          nextGap.current = 220 + Math.random() * 160;
        }
        if (frame % 6 === 0) { scoreRef.current++; setScore(scoreRef.current); }
        // collision
        const dx = 60, dw = 34, dh = 38, dyTop = d.y - dh;
        for (const o of obs.current) {
          const oy = GROUND + 2 - o.h;
          if (dx + dw - 6 > o.x && dx + 6 < o.x + o.w && d.y - 4 > oy) { over(); break; }
        }
      }
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden bg-[#f5f6f8]" style={{ fontFamily: "var(--font-sans)" }} onPointerDown={(e) => { e.preventDefault(); jump(); }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {phase !== "playing" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/70 px-7 py-5 text-center">
            <p className="text-lg font-bold text-white">{phase === "over" ? "Game Over" : "Dino Run"}</p>
            {phase === "over" && <p className="mt-1 text-[13px] text-white/80">Score {score} · Best {best}</p>}
            <p className="mt-2 text-[13px] font-medium text-white/90">{phase === "over" ? "Tap to run again" : "Tap or Space to jump"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

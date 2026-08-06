"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Pong — you (left) vs AI (right). Move with mouse or ↑ / ↓. First to 7. */
const W = 600, H = 380, PH = 74, PW = 12, R = 8;

export default function PongApp(_: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [ps, setPs] = useState(0);
  const [as, setAs] = useState(0);
  const phaseRef = useRef(phase); phaseRef.current = phase;

  const py = useRef(H / 2 - PH / 2);
  const ay = useRef(H / 2 - PH / 2);
  const ball = useRef({ x: W / 2, y: H / 2, vx: 4.5, vy: 2.5 });
  const psRef = useRef(0), asRef = useRef(0);
  const keys = useRef({ up: false, down: false });

  const serve = (dir: number) => {
    ball.current = { x: W / 2, y: H / 2, vx: 4.5 * dir, vy: (Math.random() * 4 - 2) };
  };
  const start = () => {
    psRef.current = 0; asRef.current = 0; setPs(0); setAs(0);
    py.current = ay.current = H / 2 - PH / 2;
    serve(Math.random() < 0.5 ? 1 : -1);
    phaseRef.current = "playing"; setPhase("playing");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") { keys.current.up = true; e.preventDefault(); }
      if (e.key === "ArrowDown") { keys.current.down = true; e.preventDefault(); }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") keys.current.up = false;
      if (e.key === "ArrowDown") keys.current.down = false;
    };
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
      ctx.fillStyle = "#0b1220"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 3; ctx.setLineDash([10, 12]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#fff";
      ctx.fillRect(18, py.current, PW, PH);
      ctx.fillRect(W - 18 - PW, ay.current, PW, PH);
      ctx.beginPath(); ctx.arc(ball.current.x, ball.current.y, R, 0, Math.PI * 2); ctx.fill();
      ctx.font = "700 40px -apple-system, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(String(psRef.current), W / 2 - 50, 54);
      ctx.fillText(String(asRef.current), W / 2 + 50, 54);
    };

    let raf = 0;
    const loop = () => {
      if (phaseRef.current === "playing") {
        if (keys.current.up) py.current -= 6.5;
        if (keys.current.down) py.current += 6.5;
        py.current = Math.max(0, Math.min(H - PH, py.current));
        // AI easing toward ball
        const target = ball.current.y - PH / 2;
        ay.current += Math.max(-5, Math.min(5, (target - ay.current) * 0.11));
        ay.current = Math.max(0, Math.min(H - PH, ay.current));
        const b = ball.current;
        b.x += b.vx; b.y += b.vy;
        if (b.y < R) { b.y = R; b.vy *= -1; }
        if (b.y > H - R) { b.y = H - R; b.vy *= -1; }
        // paddles
        if (b.x - R < 18 + PW && b.x - R > 12 && b.y > py.current && b.y < py.current + PH && b.vx < 0) {
          b.vx = Math.abs(b.vx) * 1.04; b.vy += ((b.y - (py.current + PH / 2)) / (PH / 2)) * 3;
        }
        if (b.x + R > W - 18 - PW && b.x + R < W - 12 && b.y > ay.current && b.y < ay.current + PH && b.vx > 0) {
          b.vx = -Math.abs(b.vx) * 1.04; b.vy += ((b.y - (ay.current + PH / 2)) / (PH / 2)) * 3;
        }
        if (b.x < -R) { asRef.current++; setAs(asRef.current); finishOrServe(1); }
        if (b.x > W + R) { psRef.current++; setPs(psRef.current); finishOrServe(-1); }
      }
      render();
      raf = requestAnimationFrame(loop);
    };
    const finishOrServe = (dir: number) => {
      if (psRef.current >= 7 || asRef.current >= 7) { phaseRef.current = "over"; setPhase("over"); }
      else serve(dir);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    py.current = Math.max(0, Math.min(H - PH, y - PH / 2));
  };

  return (
    <div className="relative flex h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden bg-[#0b1220]" style={{ fontFamily: "var(--font-sans)" }} onPointerDown={() => { if (phase !== "playing") start(); }}>
      <canvas ref={canvasRef} className="block h-full w-full" onPointerMove={onMove} />
      {phase !== "playing" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/60 px-7 py-5 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-white">{phase === "over" ? (ps > as ? "You win! 🎉" : "AI wins") : "Pong"}</p>
            <p className="mt-1 text-[13px] text-white/80">{phase === "over" ? `${ps} – ${as}` : "Mouse or ↑ ↓ · first to 7"}</p>
            <p className="mt-2 text-[13px] font-medium text-white/90">Tap to {phase === "over" ? "rematch" : "start"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

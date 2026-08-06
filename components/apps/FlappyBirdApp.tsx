"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Flappy Bird — canvas game. Tap / click / Space to flap. World is a fixed
   320×480 logical space; the window keeps a 2:3 aspect so it fills cleanly. */
const W = 320, H = 480, GROUND = 70;
const GRAV = 0.46, FLAP = -7.4;
const PIPE_W = 56, GAP = 150, SPEED = 2.3, SPACING = 185;
const BIRD_X = 84, BIRD_R = 13;

type Pipe = { x: number; top: number; passed: boolean };

export default function FlappyBirdApp(_: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const bird = useRef({ y: H * 0.44, vy: 0 });
  const pipes = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const tilt = useRef(0);

  const randTop = () => 70 + Math.floor(Math.random() * (H - GROUND - GAP - 140));

  const start = () => {
    bird.current = { y: H * 0.44, vy: FLAP };
    pipes.current = [{ x: W + 40, top: randTop(), passed: false }];
    scoreRef.current = 0;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
  };
  const flap = () => {
    if (phaseRef.current === "playing") bird.current.vy = FLAP;
    else start();
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        e.stopImmediatePropagation();
        flap();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // game loop + render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const gameOver = () => {
      if (phaseRef.current !== "playing") return;
      phaseRef.current = "over";
      setPhase("over");
      setBest((p) => Math.max(p, scoreRef.current));
    };

    const render = () => {
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#4ec0ca");
      sky.addColorStop(1, "#a5e6ec");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // pipes
      for (const p of pipes.current) {
        const by = p.top + GAP;
        ctx.fillStyle = "#5cbf3a";
        ctx.strokeStyle = "#3f8f2a";
        ctx.lineWidth = 2;
        ctx.fillRect(p.x, 0, PIPE_W, p.top);
        ctx.strokeRect(p.x, 0, PIPE_W, p.top);
        ctx.fillRect(p.x - 4, p.top - 22, PIPE_W + 8, 22);
        ctx.strokeRect(p.x - 4, p.top - 22, PIPE_W + 8, 22);
        ctx.fillRect(p.x, by, PIPE_W, H - GROUND - by);
        ctx.strokeRect(p.x, by, PIPE_W, H - GROUND - by);
        ctx.fillRect(p.x - 4, by, PIPE_W + 8, 22);
        ctx.strokeRect(p.x - 4, by, PIPE_W + 8, 22);
      }

      // ground
      ctx.fillStyle = "#ded895";
      ctx.fillRect(0, H - GROUND, W, GROUND);
      ctx.fillStyle = "#7ec850";
      ctx.fillRect(0, H - GROUND, W, 10);
      ctx.fillStyle = "#5fa838";
      ctx.fillRect(0, H - GROUND + 10, W, 3);

      // bird
      const b = bird.current;
      ctx.save();
      ctx.translate(BIRD_X, b.y);
      ctx.rotate(Math.max(-0.5, Math.min(1.3, tilt.current * 0.5)));
      ctx.fillStyle = "#f7d51d";
      ctx.strokeStyle = "#e0a000";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(-4, 4, 7, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(6, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(7.5, -4, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff8c1a";
      ctx.beginPath();
      ctx.moveTo(12, -1);
      ctx.lineTo(22, 1);
      ctx.lineTo(12, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // score
      if (phaseRef.current !== "idle") {
        ctx.font = "700 36px -apple-system, Helvetica, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.fillStyle = "#fff";
        ctx.strokeText(String(scoreRef.current), W / 2, 64);
        ctx.fillText(String(scoreRef.current), W / 2, 64);
      }
    };

    let raf = 0;
    const loop = () => {
      if (phaseRef.current === "playing") {
        const b = bird.current;
        b.vy += GRAV;
        b.y += b.vy;
        tilt.current = b.vy / 12;

        const ps = pipes.current;
        if (ps.length === 0 || ps[ps.length - 1].x < W - SPACING) {
          ps.push({ x: W, top: randTop(), passed: false });
        }
        for (const p of ps) p.x -= SPEED;
        while (ps.length && ps[0].x + PIPE_W < -4) ps.shift();

        for (const p of ps) {
          if (!p.passed && p.x + PIPE_W < BIRD_X) {
            p.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
          const inX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
          if (inX && (b.y - BIRD_R < p.top || b.y + BIRD_R > p.top + GAP)) gameOver();
        }
        if (b.y + BIRD_R >= H - GROUND) {
          b.y = H - GROUND - BIRD_R;
          gameOver();
        }
        if (b.y - BIRD_R < 0) {
          b.y = BIRD_R;
          b.vy = 0;
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
    <div
      className="relative h-full w-full cursor-pointer select-none overflow-hidden bg-[#4ec0ca]"
      style={{ fontFamily: "var(--font-sans)" }}
      onPointerDown={(e) => { e.preventDefault(); flap(); }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* idle overlay */}
      {phase === "idle" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-2xl bg-black/35 px-6 py-4 backdrop-blur-sm">
            <p className="text-lg font-bold text-white">Flappy Bird</p>
            <p className="mt-1 text-[13px] text-white/85">Tap or press Space to fly</p>
          </div>
        </div>
      )}

      {/* game-over overlay */}
      {phase === "over" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/45 px-8 py-5 text-center backdrop-blur-sm">
            <p className="text-lg font-bold text-white">Game Over</p>
            <p className="mt-1 text-[13px] text-white/85">Score <span className="font-semibold text-white">{score}</span> · Best <span className="font-semibold text-white">{best}</span></p>
            <p className="mt-2 text-[13px] font-medium text-white">Tap to play again</p>
          </div>
        </div>
      )}
    </div>
  );
}

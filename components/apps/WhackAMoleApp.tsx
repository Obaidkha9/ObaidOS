"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Whack-a-Mole — moles pop up for 30 seconds. Tap them to score. */
const GAME_SECONDS = 30;

export default function WhackAMoleApp(_: AppProps) {
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(GAME_SECONDS);
  const [running, setRunning] = useState(false);
  const [whacked, setWhacked] = useState<number | null>(null);

  const runRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    runRef.current = true;
    let spawn: ReturnType<typeof setTimeout>;
    const pop = () => {
      if (!runRef.current) return;
      const hole = Math.floor(Math.random() * 9);
      setActive(hole);
      const up = 650 + Math.random() * 550;
      spawn = setTimeout(() => { setActive((a) => (a === hole ? null : a)); setTimeout(pop, 180 + Math.random() * 350); }, up);
    };
    pop();
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          runRef.current = false;
          setRunning(false);
          setActive(null);
          setScore((s) => { setBest((b) => Math.max(b, s)); return s; });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { runRef.current = false; clearTimeout(spawn); clearInterval(timer); };
  }, [running]);

  const start = () => { setScore(0); setTime(GAME_SECONDS); setActive(null); setWhacked(null); setRunning(true); };
  const hit = (i: number) => {
    if (!running || active !== i) return;
    setScore((s) => s + 1);
    setActive(null);
    setWhacked(i);
    setTimeout(() => setWhacked((w) => (w === i ? null : w)), 150);
  };

  const idle = !running && time === GAME_SECONDS;
  const over = !running && time === 0;

  return (
    <div className="flex h-full flex-col bg-[#0f1a0f] p-5 text-white" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">Whack-a-Mole</h1>
          <p className="text-xs text-white/45">Tap the moles!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">⏱ {time}s</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">Score {score}</span>
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-[320px] flex-1 grid-cols-3 grid-rows-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            onClick={() => hit(i)}
            aria-label={`hole ${i + 1}`}
            className="relative flex items-end justify-center overflow-hidden rounded-2xl bg-[#5a3d22] ring-1 ring-black/30"
          >
            {/* dirt mound */}
            <span className="absolute inset-x-0 bottom-0 h-1/3 rounded-t-[40%] bg-[#3c2815]" />
            {/* mole */}
            <span
              className={`relative mb-1 flex h-[58%] w-[62%] items-center justify-center rounded-t-full bg-[#a9743f] transition-transform duration-100 ${active === i ? "translate-y-0" : "translate-y-[130%]"} ${whacked === i ? "scale-90 brightness-75" : ""}`}
            >
              <span className="mt-2 flex flex-col items-center">
                <span className="flex gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-black" /><i className="h-1.5 w-1.5 rounded-full bg-black" /></span>
                <i className="mt-1 h-1.5 w-2.5 rounded-full bg-[#3c2815]" />
              </span>
            </span>
          </button>
        ))}

        {(idle || over) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={start} className="rounded-2xl bg-black/60 px-7 py-5 text-center backdrop-blur-sm active:scale-95">
              <p className="text-lg font-bold text-white">{over ? "Time's up!" : "Whack-a-Mole"}</p>
              {over && <p className="mt-1 text-[13px] text-white/80">Score {score} · Best {best}</p>}
              <p className="mt-2 text-[13px] font-medium text-white/90">Tap to {over ? "play again" : "start"}</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

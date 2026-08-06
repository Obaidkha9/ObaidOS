"use client";

import { useEffect, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/* Simon — watch the sequence, then repeat it. It grows each round. */
const PADS = [
  { on: "#4ade80", off: "#166534" }, // green
  { on: "#f87171", off: "#7f1d1d" }, // red
  { on: "#fde047", off: "#854d0e" }, // yellow
  { on: "#60a5fa", off: "#1e3a8a" }, // blue
];

export default function SimonApp(_: AppProps) {
  const [seq, setSeq] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "watch" | "input" | "over">("idle");
  const [best, setBest] = useState(0);
  const inputIdx = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef(phase); phaseRef.current = phase;

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const playSeq = (s: number[]) => {
    setPhase("watch"); phaseRef.current = "watch";
    clearTimers();
    s.forEach((pad, i) => {
      timers.current.push(setTimeout(() => setFlash(pad), 550 + i * 620));
      timers.current.push(setTimeout(() => setFlash(null), 550 + i * 620 + 380));
    });
    timers.current.push(setTimeout(() => { setPhase("input"); phaseRef.current = "input"; inputIdx.current = 0; }, 550 + s.length * 620));
  };

  const nextRound = (prev: number[]) => {
    const s = [...prev, Math.floor(Math.random() * 4)];
    setSeq(s);
    playSeq(s);
  };
  const start = () => { setPhase("idle"); setSeq([]); inputIdx.current = 0; nextRound([]); };

  const press = (pad: number) => {
    if (phaseRef.current !== "input") return;
    setFlash(pad);
    setTimeout(() => setFlash((f) => (f === pad ? null : f)), 180);
    if (pad !== seq[inputIdx.current]) {
      setPhase("over"); phaseRef.current = "over";
      setBest((b) => Math.max(b, seq.length - 1));
      return;
    }
    inputIdx.current++;
    if (inputIdx.current === seq.length) {
      setTimeout(() => nextRound(seq), 650);
    }
  };

  const label = phase === "watch" ? "Watch…" : phase === "input" ? "Your turn" : phase === "over" ? "Wrong!" : "Simon";
  const round = seq.length;

  return (
    <div className="flex h-full flex-col items-center bg-[#0d0d12] p-5 text-white" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="mb-4 flex w-full items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">Simon</h1>
          <p className="text-xs text-white/45">Repeat the pattern</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium">Round {round}</span>
      </div>

      <div className="relative grid aspect-square w-full max-w-[300px] grid-cols-2 grid-rows-2 gap-2.5">
        {PADS.map((p, i) => (
          <button
            key={i}
            onClick={() => press(i)}
            disabled={phase !== "input"}
            aria-label={`pad ${i + 1}`}
            className={`transition-all duration-100 ${i === 0 ? "rounded-tl-[100%]" : i === 1 ? "rounded-tr-[100%]" : i === 2 ? "rounded-bl-[100%]" : "rounded-br-[100%]"}`}
            style={{ background: flash === i ? p.on : p.off, boxShadow: flash === i ? `0 0 24px ${p.on}` : "none" }}
          />
        ))}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0d0d12] text-center text-[13px] font-semibold text-white/80 ring-1 ring-white/10">
          {label}
        </div>
      </div>

      {(phase === "idle" || phase === "over") && (
        <button onClick={start} className="mt-6 rounded-full bg-white/12 px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20 active:scale-95">
          {phase === "over" ? `Play again · Best ${best}` : "Start"}
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick); // first paint, client-only
    const t = setInterval(tick, 1000 * 20);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);
  return now;
}

export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const now = useClock();
  const time = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";
  const color = dark ? "text-black" : "text-white";

  return (
    <div
      className={`pointer-events-none relative z-30 flex h-11 items-center justify-between px-7 text-[15px] font-semibold ${color}`}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 11.5 5.6 8.9a3.3 3.3 0 0 1 4.8 0zM2.6 6a7.6 7.6 0 0 1 10.8 0l-1.5 1.6a5.4 5.4 0 0 0-7.8 0zM0 3.3a11.3 11.3 0 0 1 16 0l-1.5 1.6a9.1 9.1 0 0 0-13 0z" />
        </svg>
        {/* battery */}
        <div className="flex items-center gap-0.5">
          <div className="relative h-3 w-6 rounded-[3px] border border-current opacity-90">
            <div className="absolute inset-[1.5px] right-1.5 rounded-[1px] bg-current" />
          </div>
          <div className="h-1.5 w-0.5 rounded-r-sm bg-current opacity-60" />
        </div>
      </div>
    </div>
  );
}

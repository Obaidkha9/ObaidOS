"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import SmoothScroll from "@/components/os/SmoothScroll";

export interface AppProps {
  onClose: () => void;
  payload?: string | null;
  /* Passed only to "chromeless" apps (e.g. Finder) that render their own
     unified toolbar + traffic lights + drag handle. */
  onMinimize?: () => void;
  onToggleMax?: () => void;
  startDrag?: (e: ReactPointerEvent) => void;
  focused?: boolean;
}

interface ChromeProps {
  title: string;
  /** still accepted from callers, but styling is handled by the window now */
  accent?: string;
  onClose?: () => void; // window traffic-lights handle closing
  right?: ReactNode;
  children: ReactNode;
  bg?: string;
  scroll?: boolean;
}

/**
 * Shared app chrome that sits *inside* a macOS window (below the traffic-light
 * title bar): a translucent toolbar with a large title, over a Lenis-driven
 * scroll body.
 */
export default function AppChrome({
  title,
  right,
  children,
  bg = "#000",
  scroll = true,
}: ChromeProps) {
  const header = title || right ? (
    <div
      className="sticky top-0 z-20 flex items-center justify-between px-5 pb-3 pt-4 glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {right && <div className="flex items-center gap-3">{right}</div>}
    </div>
  ) : null;

  return (
    <div className="h-full w-full" style={{ background: bg }}>
      {scroll ? (
        <SmoothScroll>
          {header}
          <div className="px-5 pb-16 pt-4">{children}</div>
        </SmoothScroll>
      ) : (
        <div className="flex h-full flex-col">
          {header}
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppProps } from "./AppChrome";

/**
 * A real, draggable window that previews an image (assignment mockups,
 * certificates, project covers, gallery photos). Chromeless — it draws its own
 * macOS toolbar (traffic lights + filename) so the whole window can be dragged.
 * Payload is a JSON string, either:
 *   { src, name, zoom? }                     — a single image
 *   { list: [{src,name}], index, name }      — a gallery with prev/next paging
 */
export default function PreviewApp({
  payload,
  onClose,
  onMinimize,
  onToggleMax,
  startDrag,
  focused = true,
}: AppProps) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(payload ?? "{}") as {
        src?: string;
        name?: string;
        zoom?: boolean;
        list?: { src: string; name: string }[];
        index?: number;
        rate?: number;
      };
    } catch {
      return {};
    }
  }, [payload]);

  const list = Array.isArray(parsed.list) ? parsed.list : null;
  const [idx, setIdx] = useState(0);
  // sync to the launch index whenever a new payload opens
  useEffect(() => {
    setIdx(list && typeof parsed.index === "number" ? parsed.index : 0);
  }, [payload]); // eslint-disable-line react-hooks/exhaustive-deps

  const cur = list && list.length ? list[Math.min(idx, list.length - 1)] : null;
  const src = cur?.src ?? parsed.src ?? "";
  const name = cur?.name ?? parsed.name ?? "Preview";
  const zoomable = !!parsed.zoom;
  const hasNav = !!list && list.length > 1;
  const go = (d: number) => list && setIdx((i) => (i + d + list.length) % list.length);

  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(src);

  // apply an optional slowed/faster playback rate to the video
  const videoRef = useRef<HTMLVideoElement>(null);
  const rate = typeof parsed.rate === "number" ? parsed.rate : 1;
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }, [rate, src]);

  const [scale, setScale] = useState(1);
  useEffect(() => setScale(1), [src]); // reset zoom when a different image opens

  // arrow-key paging for the gallery
  useEffect(() => {
    if (!hasNav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasNav, list]); // eslint-disable-line react-hooks/exhaustive-deps

  const dot =
    "flex h-3 w-3 items-center justify-center rounded-full ring-1 ring-black/20 active:brightness-90";
  const c = (col: string) => (focused ? col : "#4b4b4d");
  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="relative flex h-full w-full flex-col bg-[#141414] text-white" style={{ fontFamily: "var(--font-sans)" }}>
      {/* toolbar — drag handle */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={onToggleMax}
        className="flex h-[52px] shrink-0 cursor-default select-none items-center gap-3 border-b px-4"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#1c1c1e" }}
      >
        <div className="flex items-center gap-2" onPointerDown={stop}>
          <button aria-label="Close" onClick={onClose} className={dot} style={{ background: c("#ff5f57") }} />
          <button aria-label="Minimize" onClick={onMinimize ?? onClose} className={dot} style={{ background: c("#febc2e") }} />
          <button aria-label="Zoom" onClick={onToggleMax ?? (() => {})} className={dot} style={{ background: c("#28c840") }} />
        </div>
        <span className="ml-1 min-w-0 truncate text-[15px] font-semibold text-white/80">{name}</span>

        {zoomable && !isVideo && (
          <div className="ml-auto flex items-center gap-1.5" onPointerDown={stop}>
            <button
              aria-label="Zoom out"
              onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-lg leading-none text-white/85 transition hover:bg-white/15"
            >
              −
            </button>
            <span className="w-11 text-center text-[12px] tabular-nums text-white/55">{Math.round(scale * 100)}%</span>
            <button
              aria-label="Zoom in"
              onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-lg leading-none text-white/85 transition hover:bg-white/15"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* video / image + gallery paging */}
      <div className="relative flex min-h-0 flex-1">
      {isVideo ? (
        <div className="flex h-full w-full items-center justify-center bg-black p-3">
          {src && (
            <video
              ref={videoRef}
              src={src}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate; }}
              className="max-h-full max-w-full rounded-lg"
            />
          )}
        </div>
      ) : zoomable ? (
        <div className="app-scroll h-full w-full overflow-auto p-3">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              draggable={false}
              style={{ width: `${scale * 100}%` }}
              className="mx-auto block h-auto max-w-none rounded-lg"
            />
          )}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-3">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={name} className="max-h-full max-w-full rounded-lg object-contain" draggable={false} />
          )}
        </div>
      )}

        {/* prev / next — vertically centred on the left and right of the image */}
        {hasNav && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-black/70 active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-black/70 active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

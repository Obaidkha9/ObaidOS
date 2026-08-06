"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "loading" | "ready" | "denied" | "unsupported";

/* Photo Booth — live front camera via getUserMedia, mirrored preview,
   3-2-1 countdown, flash, and a filmstrip of captured shots. */
export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [shots, setShots] = useState<string[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // request the camera's full-HD stream (ideal, not exact) so the
          // preview + captures are sharp instead of an upscaled 640×480 default
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("denied");
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const grabFrame = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    if (!w || !h) return;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // mirror horizontally so the saved shot matches the preview
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, w, h);
    setShots((s) => [c.toDataURL("image/jpeg", 0.92), ...s].slice(0, 16));
  };

  const capture = () => {
    if (status !== "ready" || count !== null) return;
    let n = 3;
    setCount(n);
    const iv = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(iv);
        setCount(null);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 200);
        grabFrame();
      } else {
        setCount(n);
      }
    }, 650);
  };

  return (
    <div className="relative flex h-full flex-col bg-black text-white" style={{ fontFamily: "var(--font-sans)" }}>
      {/* live preview */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0a0a0b]">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* status overlay when the camera isn't live */}
        {status !== "ready" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a0a0b] px-10 text-center">
            {status === "loading" && (
              <>
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                <p className="text-sm text-white/60">Starting camera…</p>
              </>
            )}
            {status === "denied" && (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff453a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 2l20 20" />
                  <path d="M9 5h6l1.5 2H20a2 2 0 0 1 2 2v9M17.5 17.5A2 2 0 0 1 16 18H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1" />
                  <path d="M9.5 9.5a3.5 3.5 0 0 0 4.9 4.9" />
                </svg>
                <p className="text-sm font-medium text-white/85">Camera access blocked</p>
                <p className="max-w-[280px] text-xs leading-relaxed text-white/50">
                  Allow camera access for this site in your browser, then reopen Photo Booth.
                </p>
              </>
            )}
            {status === "unsupported" && (
              <p className="text-sm text-white/60">Camera isn&apos;t supported in this browser.</p>
            )}
          </div>
        )}

        {/* 3-2-1 countdown */}
        <AnimatePresence>
          {count !== null && (
            <motion.div
              key={count}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <span className="text-[140px] font-bold leading-none text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                {count}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* shutter flash */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-30 bg-white"
            />
          )}
        </AnimatePresence>
      </div>

      {/* control bar — Photo Booth red camera button + session note */}
      <div className="shrink-0 bg-[#1c1c1e] pb-3 pt-4">
        <div className="flex items-center justify-center">
          <button
            onClick={capture}
            disabled={status !== "ready" || count !== null}
            aria-label="Take a photo"
            className="flex h-14 w-24 items-center justify-center rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.45)] ring-1 ring-black/30 transition active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(180deg,#ff6259,#dd2f26)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
              <path d="M8.5 4.5l-1.3 2H4.5a2 2 0 0 0-2 2V17a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-2.7l-1.3-2z" fill="#fff" />
              <circle cx="12" cy="12.5" r="3.6" fill="#dd2f26" />
              <circle cx="12" cy="12.5" r="1.6" fill="#fff" />
            </svg>
          </button>
        </div>
        <p className="mt-2.5 px-6 text-center text-[11px] leading-relaxed text-white/35">
          Photos stay in this session only — nothing is uploaded or saved. They&apos;re cleared when the window is refreshed or closed. Tap a shot to view or save it.
        </p>
      </div>

      {/* filmstrip of captured shots — tap to view */}
      {shots.length > 0 && (
        <div className="app-scroll flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 bg-[#141414] px-4 py-3">
          {shots.map((src, i) => (
            <button
              key={i}
              onClick={() => setViewer(src)}
              aria-label={`View shot ${shots.length - i}`}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15 transition hover:ring-white/40 active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Shot ${shots.length - i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* photo viewer / lightbox */}
      <AnimatePresence>
        {viewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setViewer(null)}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/85 p-6 backdrop-blur-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              src={viewer}
              alt="Captured photo"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[74%] max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/15"
            />
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <a
                href={viewer}
                download="photobooth.jpg"
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-white/15"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M8 11l4 4 4-4M5 21h14" /></svg>
                Save to device
              </a>
              <button
                onClick={() => setViewer(null)}
                className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

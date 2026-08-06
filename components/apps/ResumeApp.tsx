"use client";

import { useState } from "react";
import SmoothScroll from "@/components/os/SmoothScroll";
import { PROFILE } from "@/lib/content";
import { asset } from "@/lib/asset";

const TITLE = "Obaid's Resume";
const FILE = "/Obaids-Resume.pdf";
// The PDF rendered to an image so it displays reliably in-app on every device
// (mobile Safari won't render a PDF inside an iframe). The real PDF above is
// still what the Download/Share buttons hand off.
const PAGE = "/obaids-resume.png";

export default function ResumeApp() {
  const [zoom, setZoom] = useState(1);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: TITLE, url: asset(FILE) });
      } else {
        await navigator.clipboard.writeText(window.location.origin + asset(FILE));
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#141414] text-white">
      {/* toolbar */}
      <div className="glass flex items-center justify-between px-4 pb-2 pt-4">
        <span className="text-sm font-semibold">{TITLE}</span>
        <div className="flex items-center gap-3">
          <button
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
            className="h-7 w-7 rounded-full bg-white/10 text-lg leading-none"
          >
            −
          </button>
          <button
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
            className="h-7 w-7 rounded-full bg-white/10 text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* page — the actual CV rendered from the PDF */}
      <SmoothScroll className="bg-[#1c1c1e]">
        <div className="flex justify-center px-4 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(PAGE)}
            alt={`${PROFILE.name} — résumé`}
            className="w-full max-w-[560px] origin-top rounded-sm bg-white shadow-2xl"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          />
        </div>
      </SmoothScroll>

      {/* bottom actions */}
      <div className="glass flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        <a
          href={asset(FILE)}
          download="Obaid's Resume.pdf"
          className="flex flex-col items-center gap-0.5 text-[#0f53fc]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
          </svg>
          <span className="text-[11px]">Download</span>
        </a>
        <button onClick={share} className="flex flex-col items-center gap-0.5 text-[#0f53fc]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V4m0 0L8 8m4-4l4 4M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
          </svg>
          <span className="text-[11px]">Share</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import SmoothScroll from "@/components/os/SmoothScroll";
import { PROFILE, EXPERIENCE, ABOUT } from "@/lib/content";

const FILE = "/CV_2026.pdf";

export default function ResumeApp() {
  const [zoom, setZoom] = useState(1);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "CV_2026.pdf", url: FILE });
      } else {
        await navigator.clipboard.writeText(window.location.origin + FILE);
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#141414] text-white">
      {/* toolbar */}
      <div className="glass flex items-center justify-between px-4 pb-2 pt-4">
        <span className="text-sm font-semibold">CV_2026.pdf</span>
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

      {/* page */}
      <SmoothScroll className="bg-[#1c1c1e]">
        <div className="flex justify-center px-4 py-6">
          <div
            className="w-full max-w-[560px] origin-top rounded-sm bg-white text-neutral-800 shadow-2xl"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div className="p-10">
              <h1 className="text-3xl font-bold text-neutral-900">{PROFILE.name}</h1>
              <p className="text-[#0f53fc]">{PROFILE.role}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {PROFILE.email} · {PROFILE.location}
              </p>

              <hr className="my-5 border-neutral-200" />

              <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-400">
                Profile
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700">
                {ABOUT.sections[0].body}
              </p>

              <h2 className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-neutral-400">
                Experience
              </h2>
              <div className="space-y-4">
                {[...EXPERIENCE].reverse().map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-neutral-900">
                        {e.role} · {e.company}
                      </span>
                      <span className="text-xs text-neutral-500">{e.period}</span>
                    </div>
                    <p className="text-sm text-neutral-600">{e.summary}</p>
                  </div>
                ))}
              </div>

              <h2 className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest text-neutral-400">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(ABOUT.sections[1].list ?? []).map((s) => (
                  <span
                    key={s}
                    className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SmoothScroll>

      {/* bottom actions */}
      <div className="glass flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        <a
          href={FILE}
          download
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

"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROFILE } from "@/lib/content";
import { useLaunch } from "@/lib/useLaunch";
import { AppArt } from "@/components/icons/AppArt";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/*  Contact Card — native macOS Sonoma/Tahoe dark contact widget.      */
/*  Flat surfaces, 20px radii, typography-first, HIG spacing.          */
/* ------------------------------------------------------------------ */

const NAME = "Obaid Yusuf Zai";
const ROLE = "UX Engineer III";
const COMPANY = "Ensylon";
const LOCATION = "Jaipur, India";
const AVAILABILITY = "Open for Full-time & Freelance";
const EXPERIENCE = "4+ Years";
const FOCUS = "Design Systems • AI Products • SaaS";

const EMAIL = "yusufzaiobaid@gmail.com";
const PHONE = "+91 9131100031";
const NAUKRI = "https://www.naukri.com";

const BLUE = "#0a84ff";
const SECONDARY = "#98989d";

/* ---- SF-Symbols-style monochrome glyphs ---- */
const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const IconCopy = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...stroke}><rect x="9" y="9" width="11" height="11" rx="2.2" /><path d="M15 5H6a2 2 0 0 0-2 2v9" /></svg>);

/* white glyphs for the unified brand tiles */
const GlyphIn = () => (<svg width="30" height="30" viewBox="3.4 2.4 17.2 16.6" fill="#fff"><path d="M6.94 8.5v9.5H4V8.5zM5.47 4.4a1.72 1.72 0 1 1 0 3.44 1.72 1.72 0 0 1 0-3.44zM20 18h-2.94v-4.9c0-1.28-.46-2.16-1.6-2.16-.88 0-1.4.59-1.63 1.16-.08.2-.1.49-.1.78V18H10.8s.04-8.63 0-9.5h2.94v1.35c.39-.6 1.09-1.46 2.65-1.46 1.93 0 3.38 1.26 3.38 3.97z" /></svg>);

/* unified macOS-squircle brand tiles (match the dock's rounded-[22.5%] + shadow).
   All tiles share the same 48px footprint so none looks larger. */
function SqTile({ label, bg, onClick, children }: { label: string; bg?: string; onClick: (e: MouseEvent<HTMLButtonElement>) => void; children: ReactNode }) {
  return (
    <div className="group relative flex flex-col items-center">
      <button
        onClick={onClick}
        aria-label={label}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[22.5%] shadow-[0_3px_9px_rgba(0,0,0,0.4)] transition duration-200 group-hover:-translate-y-1 active:scale-95"
        style={bg ? { background: bg } : undefined}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function Row({ label, value, span }: { label: string; value: ReactNode; span?: boolean }) {
  return (
    <div className={`rounded-[14px] bg-[#232326] px-4 py-3 ${span ? "col-span-2" : ""}`}>
      <p className="text-[12px]" style={{ color: SECONDARY }}>{label}</p>
      <p className="mt-0.5 text-[15px] font-medium leading-snug text-white">{value}</p>
    </div>
  );
}

function CopyRow({ label, value, href, onCopy }: { label: string; value: string; href: string; onCopy: () => void }) {
  return (
    <div className="col-span-2 flex items-center justify-between gap-3 rounded-[14px] bg-[#232326] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[12px]" style={{ color: SECONDARY }}>{label}</p>
        <a href={href} className="mt-0.5 block truncate text-[15px] font-medium" style={{ color: BLUE }}>{value}</a>
      </div>
      <button
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-full p-2 text-white/45 transition-colors duration-200 hover:bg-white/10 hover:text-white/80 active:scale-90"
      >
        <IconCopy />
      </button>
    </div>
  );
}

export default function ContactCardApp() {
  const launch = useLaunch();
  const [imgOk, setImgOk] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");
  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1700);
  };

  return (
    <div className="app-scroll flex h-full w-full items-start justify-center overflow-y-auto bg-[#141414] px-5 pb-8 pt-[max(env(safe-area-inset-top),28px)] text-white sm:items-center sm:p-5" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="w-full">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-7">
          {/* ---- left: hero image + identity + quick links ---- */}
          <div className="flex shrink-0 flex-col items-center text-center sm:w-[200px]">
            <button
              onClick={(e) => launch("preview", e.currentTarget, { context: NAME, payload: JSON.stringify({ src: asset("/profile.jpg"), name: NAME }) })}
              aria-label="View photo"
              className="h-24 w-24 overflow-hidden rounded-full bg-[#3a3a3c] ring-1 ring-white/10 transition active:scale-95"
            >
              {imgOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset("/profile.jpg")}
                  alt={NAME}
                  className="h-full w-full object-cover"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/85">OY</span>
              )}
            </button>

            <h1 className="mt-4 text-[22px] font-bold leading-tight tracking-tight">{NAME}</h1>
            <p className="mt-1 text-[15px] font-medium text-white/80">{ROLE}</p>
            <p className="mt-0.5 text-[13px]" style={{ color: SECONDARY }}>{COMPANY}</p>

            {/* quick links — unified squircle tiles, same footprint (Resume · LinkedIn · Naukri) */}
            <div className="mt-4 flex justify-center gap-3">
              <SqTile label="Resume" onClick={(e) => launch("resume", e.currentTarget, { context: "Reading Resume" })}>
                <AppArt id="resume" />
              </SqTile>
              <SqTile label="LinkedIn" bg="#0a66c2" onClick={() => open(PROFILE.linkedin)}><GlyphIn /></SqTile>
              <SqTile label="Naukri" bg="#3359e5" onClick={() => open(NAUKRI)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/icons/naukri-glyph.png")} alt="" className="h-[62%] w-auto object-contain" draggable={false} />
              </SqTile>
            </div>
          </div>

          {/* ---- right: Apple Contacts info rows ---- */}
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-2">
              <Row span label="Current Role" value={<>{ROLE} <span style={{ color: SECONDARY }}>@</span> {COMPANY}</>} />
              <Row label="Location" value={LOCATION} />
              <Row label="Experience" value={EXPERIENCE} />
              <Row label="Availability" value={AVAILABILITY} />
              <Row label="Focus" value={FOCUS} />
              <CopyRow label="Email" value={EMAIL} href={`mailto:${EMAIL}`} onCopy={() => copy(EMAIL, "Email")} />
              <CopyRow label="Phone" value={PHONE} href={`tel:${PHONE.replace(/\s/g, "")}`} onCopy={() => copy(PHONE, "Phone")} />
            </div>
          </div>
        </div>
      </div>

      {/* copy confirmation */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#2d2d33] px-4 py-2 text-[13px] font-medium text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            {copied} copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

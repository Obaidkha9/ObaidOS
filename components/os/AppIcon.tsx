"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { AppMeta } from "@/lib/apps";
import { AppArt } from "@/components/icons/AppArt";
import { useOS } from "@/lib/store";
import { asset } from "@/lib/asset";

/* Icons drawn live in-app (SVG) rather than from a PNG:
   brand logos + the Calendar-style Timeline icon (shows today's date). */
const CUSTOM = new Set(["linkedin", "behance", "gmail", "finder", "timeline", "resume"]);
/* extracted iOS-style assets that are full-bleed squares → need the squircle mask */
const SQUARE = new Set(["phone"]);

export default function AppIcon({
  app,
  label = true,
  index = 0,
}: {
  app: AppMeta;
  label?: boolean;
  index?: number;
}) {
  const tile = useRef<HTMLButtonElement>(null);
  const openApp = useOS((s) => s.openApp);
  const setContext = useOS((s) => s.setContext);
  const reduced = useOS((s) => s.reducedMotion);

  const handle = () => {
    if (app.href) {
      window.open(app.href, "_blank", "noopener,noreferrer");
      return;
    }
    const r = tile.current?.getBoundingClientRect();
    if (app.context) setContext(app.context);
    openApp(
      app.route ?? app.id,
      {
        x: r?.x ?? 0,
        y: r?.y ?? 0,
        width: r?.width ?? 60,
        height: r?.height ?? 60,
      },
      app.payload,
    );
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: reduced ? 0 : Math.min(index * 0.028, 0.4),
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="flex select-none flex-col items-center gap-1.5"
    >
      <button
        ref={tile}
        onClick={handle}
        aria-label={`Open ${app.name}`}
        className="group relative aspect-square w-full max-w-[64px] transition-transform duration-200 active:scale-90 sm:max-w-[62px]"
      >
        {CUSTOM.has(app.id) ? (
          // custom tiles matched to the macOS icons' padding + shadow
          <span className="absolute inset-[9%] overflow-hidden rounded-[22.5%] shadow-[0_8px_16px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
            <AppArt id={app.id} />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-70" />
          </span>
        ) : SQUARE.has(app.id) ? (
          // full-bleed square asset → clip to a squircle + inset so it matches the others
          <span className="absolute inset-[9%] overflow-hidden rounded-[22.5%] shadow-[0_8px_16px_rgba(0,0,0,0.28)]">
            <Image
              src={asset(`/icons/${app.id}.png`)}
              alt={app.name}
              fill
              sizes="64px"
              className="object-cover"
              draggable={false}
              priority={index < 8}
            />
          </span>
        ) : (
          // the real macOS icon (already a squircle with baked-in shadow)
          <Image
            src={asset(`/icons/${app.id}.png`)}
            alt={app.name}
            fill
            sizes="64px"
            className="object-contain"
            draggable={false}
            priority={index < 8}
          />
        )}
      </button>
      {label && (
        <span className="max-w-[68px] truncate text-[11px] font-medium text-white/90 drop-shadow">
          {app.name}
        </span>
      )}
    </motion.div>
  );
}

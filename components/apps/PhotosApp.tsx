"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import { PHOTOS, PHOTO_SECTIONS, type Photo } from "@/lib/content";
import { useOS } from "@/lib/store";
import { useLaunch } from "@/lib/useLaunch";

export default function PhotosApp({ onClose }: AppProps) {
  const isMobile = useOS((s) => s.tier === "mobile");
  const launch = useLaunch();
  const [section, setSection] = useState("Memories");
  const visible = PHOTOS.filter((p) => p.category === section);
  const gridRef = useRef<HTMLDivElement>(null);

  // Open a photo in its own draggable Preview window (closing it closes only
  // that window, not this gallery). Because the masonry fills column-by-column,
  // we read the tiles' real on-screen positions and order the set the way the
  // eye reads it — top-to-bottom, left-to-right — so the Preview window's
  // next/prev arrows walk the photos in visual reading order.
  const openPhoto = (p: Photo, el: HTMLElement | null) => {
    let ordered = visible.filter((x) => x.src);
    const container = gridRef.current;
    if (container) {
      const byId = new Map(visible.map((v) => [v.id, v] as const));
      ordered = Array.from(container.querySelectorAll<HTMLElement>("[data-photo-id]"))
        .map((n) => ({ id: n.dataset.photoId as string, r: n.getBoundingClientRect() }))
        .sort((a, b) => (Math.abs(a.r.top - b.r.top) > 16 ? a.r.top - b.r.top : a.r.left - b.r.left))
        .map((x) => byId.get(x.id))
        .filter((v): v is Photo => !!v && !!v.src);
    }
    const gallery = ordered.map((x) => ({ src: x.src, name: x.label }));
    const index = Math.max(0, ordered.findIndex((x) => x.id === p.id));
    launch("preview", el, {
      context: p.label,
      payload: JSON.stringify({ list: gallery, index, name: p.label }),
    });
  };

  return (
    <AppChrome title="" onClose={onClose} bg="#141414">
      {/* section chips — stick to the top while scrolling */}
      <div className="app-scroll sticky top-0 z-20 -mx-5 mb-4 flex gap-2 overflow-x-auto bg-[#141414] px-5 pt-3 pb-3">
        {PHOTO_SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
              section === s ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* masonry — Pinterest-style varying heights (unchanged layout) */}
      <div ref={gridRef} className="columns-2 gap-2 sm:columns-3">
        {visible.map((p: Photo, i) => {
          // On mobile, crop the Tehri portrait down to the knee (drop the lower
          // legs + shoes) by shortening the tile and anchoring the image to top.
          const cropKnee = isMobile && p.id === "mem-7";
          return (
            <motion.button
              key={p.id}
              data-photo-id={p.id}
              onClick={(e) => openPhoto(p, e.currentTarget)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.04 }}
              className="mb-2 block w-full overflow-hidden rounded-xl"
              style={{
                background: p.gradient,
                aspectRatio: cropKnee ? "1050 / 1010" : p.aspect ?? (p.span ? "3 / 5" : "3 / 4"),
              }}
            >
              {p.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" style={cropKnee ? { objectPosition: "top" } : undefined} />
              ) : (
                <span className="flex h-full items-end p-2 text-[11px] font-medium text-white/80">{p.label}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </AppChrome>
  );
}

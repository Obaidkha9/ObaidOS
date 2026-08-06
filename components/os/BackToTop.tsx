"use client";

/* Reusable "Back to top" button for case-study pages. Scrolls the nearest
   SmoothScroll container to the top (uses its Lenis instance if present). */
type LenisLike = { scrollTo: (target: number, opts?: object) => void };

export default function BackToTop({ label = "Back to top", accent = "#FF0000" }: { label?: string; accent?: string }) {
  return (
    <div className="flex justify-center py-16">
      <button
        onClick={(e) => {
          const w = e.currentTarget.closest(".app-scroll") as (HTMLElement & { __lenis?: LenisLike }) | null;
          if (w?.__lenis) w.__lenis.scrollTo(0, { duration: 1 });
          else w?.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="group flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-95"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: accent }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-y-0.5"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </span>
        {label}
      </button>
    </div>
  );
}

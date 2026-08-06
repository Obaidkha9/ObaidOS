"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useOS } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Scoped Lenis smooth-scroll for an app's scroll container.
 * Falls back to native scrolling when reduced-motion is on.
 */
export default function SmoothScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const reduced = useOS((s) => s.reducedMotion);

  useEffect(() => {
    if (reduced || !wrapper.current || !content.current) return;
    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    // expose the instance so children (e.g. "Back to top") can drive it
    (wrapper.current as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const el = wrapper.current;
    return () => {
      cancelAnimationFrame(raf);
      if (el) (el as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
    };
  }, [reduced]);

  return (
    <div ref={wrapper} className={cn("app-scroll h-full w-full", className)}>
      <div ref={content}>{children}</div>
    </div>
  );
}

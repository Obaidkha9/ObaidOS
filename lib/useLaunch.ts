"use client";

import { useOS } from "./store";

/** Open an app, growing from a DOM element's position, with optional context + deep-link. */
export function useLaunch() {
  const openApp = useOS((s) => s.openApp);
  const setContext = useOS((s) => s.setContext);
  return (
    id: string,
    el: HTMLElement | null,
    opts?: { context?: string; payload?: string },
  ) => {
    const r = el?.getBoundingClientRect();
    if (opts?.context) setContext(opts.context);
    openApp(
      id,
      {
        x: r?.x ?? 0,
        y: r?.y ?? 0,
        width: r?.width ?? 80,
        height: r?.height ?? 80,
      },
      opts?.payload,
    );
  };
}

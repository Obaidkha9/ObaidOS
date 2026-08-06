/**
 * Prefixes public-folder asset paths with the deployment base path.
 *
 * On GitHub Pages this app is served from a sub-path (e.g. `/ObaidOS`), so a
 * file in `public/foo.png` is reachable at `/ObaidOS/foo.png`. Next.js only
 * applies `basePath` automatically to `next/link` and framework assets — raw
 * `<img>/<video>` `src` values and data strings are NOT rewritten, so we
 * prefix them here.
 *
 * The prefix comes from `NEXT_PUBLIC_BASE_PATH` (inlined at build time) and is
 * kept in sync with `basePath` in `next.config.ts`. When unset — local `next
 * dev`, or a root-domain deploy — this is a no-op.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  // Only rewrite root-relative public paths; leave absolute URLs / others alone.
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

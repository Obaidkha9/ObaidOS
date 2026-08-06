/**
 * Shared window chrome palette — every app window uses these so the OS feels
 * consistent (matches the Projects / case-study window).
 *
 *  BG    — main content background
 *  NAV   — left sidebar / side panels / list / secondary strips
 *  CARD  — rows / tiles / cards inside a window
 *  BORDER— hairline dividers
 */
export const WIN = {
  BG: "#141414",
  NAV: "#1c1c1e",
  CARD: "#232326",
  BORDER: "rgba(255,255,255,0.08)",
} as const;

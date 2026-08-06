import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** iOS-style spring presets used across the OS */
export const spring = {
  app: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 } as const,
  island: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 } as const,
  soft: { type: "spring", stiffness: 260, damping: 30 } as const,
};

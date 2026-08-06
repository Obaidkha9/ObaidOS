import type { ReactNode } from "react";

/* Recreated brand-style app icons (SVG) to match the reference home screen.
   Full-bleed — the parent clips to a squircle. */

const S = ({ bg, children }: { bg: string; children?: ReactNode }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
    <rect width="100" height="100" fill={bg} />
    {children}
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  spotify: (
    <S bg="#1ed760">
      <g fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round">
        <path d="M28 40c18-5 34-3 48 5" />
        <path d="M30 54c15-4 28-2 40 4" />
        <path d="M32 66c12-3 22-1 31 3" />
      </g>
    </S>
  ),
  netflix: (
    <S bg="#000">
      <path d="M38 22h9l15 34V22h9v56h-9L47 44v34h-9z" fill="#e50914" />
    </S>
  ),
  prime: (
    <S bg="#1a98ff">
      <path d="M22 62c18 9 38 9 56 0" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M42 34l22 12-22 12z" fill="#fff" />
    </S>
  ),
  duolingo: (
    <S bg="#58cc02">
      <ellipse cx="50" cy="52" rx="24" ry="26" fill="#fff" />
      <ellipse cx="50" cy="48" rx="20" ry="21" fill="#58cc02" />
      <circle cx="42" cy="44" r="6" fill="#fff" />
      <circle cx="58" cy="44" r="6" fill="#fff" />
      <circle cx="42" cy="45" r="3" fill="#000" />
      <circle cx="58" cy="45" r="3" fill="#000" />
      <path d="M44 58h12l-6 7z" fill="#ffc200" />
    </S>
  ),
  youtube: (
    <S bg="#fff">
      <rect x="20" y="32" width="60" height="36" rx="11" fill="#ff0000" />
      <path d="M45 42l16 8-16 8z" fill="#fff" />
    </S>
  ),
  pinterest: (
    <S bg="#e60023">
      <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fontSize="52" fontWeight="800" fill="#fff" style={{ fontFamily: "Georgia,serif" }}>
        P
      </text>
    </S>
  ),
  purple: (
    <S bg="#7b3ff2">
      <text x="50" y="54" textAnchor="middle" dominantBaseline="central" fontSize="46" fontWeight="800" fill="#fff">
        M
      </text>
    </S>
  ),
  dark: (
    <S bg="#1c1c1e">
      <rect x="34" y="34" width="32" height="32" rx="8" fill="none" stroke="#fff" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="#fff" />
    </S>
  ),
  phone: (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5df675" />
          <stop offset="1" stopColor="#0cbc32" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ph)" />
      <path
        d="M32 26c-2 1-4 3-4 6 0 26 20 46 46 46 3 0 5-2 6-4l3-8c1-2 0-4-2-5l-10-4c-2-1-4 0-5 1l-4 4c-6-3-11-8-14-14l4-4c1-1 2-3 1-5l-4-10c-1-2-3-3-5-2z"
        fill="#fff"
      />
    </svg>
  ),
  safari: (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="saf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#19b7ff" />
          <stop offset="1" stopColor="#1f6dff" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#saf)" />
      <circle cx="50" cy="50" r="30" fill="#e8f4ff" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M50 50l22-22-14 30z" fill="#ff3b30" />
      <path d="M50 50l-22 22 14-30z" fill="#ddd" />
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="msg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4cf05a" />
          <stop offset="1" stopColor="#22c33e" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#msg2)" />
      <path d="M50 26C31 26 20 37 20 50c0 8 4 15 11 19-1 5-4 9-7 12 6 0 12-2 17-6 3 .7 6 1 9 1 19 0 30-11 30-26S69 26 50 26z" fill="#fff" />
    </svg>
  ),
  facetime: (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#43e05f" />
          <stop offset="1" stopColor="#1fb94a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ft)" />
      <rect x="24" y="36" width="36" height="28" rx="7" fill="#fff" />
      <path d="M64 46l14-9v26l-14-9z" fill="#fff" />
    </svg>
  ),
};

export function BrandIcon({ name }: { name: string }): ReactNode {
  return ICONS[name] ?? <S bg="#333" />;
}

export const BRAND_LINKS: Record<string, string> = {
  spotify: "https://open.spotify.com",
  netflix: "https://www.netflix.com",
  prime: "https://www.primevideo.com",
  duolingo: "https://www.duolingo.com",
  youtube: "https://www.youtube.com",
  pinterest: "https://www.pinterest.com",
};

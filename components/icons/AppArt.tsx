import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Full-bleed macOS-style app icons. Each fills its squircle tile.    */
/*  Designed to read like the real macOS dock icons.                   */
/* ------------------------------------------------------------------ */

const Fill = ({
  bg,
  children,
}: {
  bg: string;
  children?: ReactNode;
}) => (
  <div className="absolute inset-0" style={{ background: bg }}>
    {children}
  </div>
);

const Svg = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 100 100"
    className="absolute inset-0 h-full w-full"
    style={{ fontFamily: "var(--font-sans)" }}
    aria-hidden
  >
    {children}
  </svg>
);

/* --- individual icons ------------------------------------------------ */

const Finder = () => (
  <Svg>
    <defs>
      <linearGradient id="fnd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3ea2ff" />
        <stop offset="1" stopColor="#0a72e6" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#fnd)" />
    {/* left lighter half */}
    <path d="M0 0 H50 V100 H0 Z" fill="#dfefff" opacity="0.22" />
    {/* face */}
    <path d="M34 34 V52" stroke="#0b3f86" strokeWidth="6" strokeLinecap="round" />
    <path d="M66 34 V52" stroke="#0b3f86" strokeWidth="6" strokeLinecap="round" />
    <path
      d="M30 64 Q50 78 70 64"
      fill="none"
      stroke="#0b3f86"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </Svg>
);

const Notes = () => (
  <div className="absolute inset-0 bg-white">
    <div
      className="absolute inset-x-0 top-0 h-[30%]"
      style={{ background: "linear-gradient(180deg,#ffe066,#ffd21f)" }}
    />
    <div className="absolute inset-x-[18%] top-[42%] space-y-[10%]">
      {[1, 0.85, 0.6].map((w, i) => (
        <div
          key={i}
          className="h-[6px] rounded-full bg-neutral-300"
          style={{ width: `${w * 100}%` }}
        />
      ))}
    </div>
  </div>
);

const Photos = () => (
  <div className="absolute inset-0 bg-white">
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
      <g transform="translate(50 50)">
        {[
          "#ffcc00", "#ff9500", "#ff2d55", "#af52de",
          "#0f53fc", "#34c759", "#5ac8fa", "#ff3b30",
        ].map((c, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-20"
            rx="9"
            ry="20"
            fill={c}
            opacity="0.92"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
    </svg>
  </div>
);

const Camera = () => (
  <Svg>
    <defs>
      <linearGradient id="cam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a4a4f" />
        <stop offset="1" stopColor="#1c1c1e" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#cam)" />
    <circle cx="50" cy="52" r="24" fill="#111" stroke="#6b6b70" strokeWidth="3" />
    <circle cx="50" cy="52" r="14" fill="#2b2b30" />
    <circle cx="44" cy="46" r="5" fill="#8fb7ff" opacity="0.8" />
    <circle cx="74" cy="28" r="5" fill="#ffd60a" />
  </Svg>
);

const Music = () => (
  <Svg>
    <defs>
      <linearGradient id="mus" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fb5c74" />
        <stop offset="1" stopColor="#fa2e56" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#mus)" />
    <path
      d="M42 68 a9 9 0 1 1 -9 -9 c1.6 0 3.1 .4 4.5 1 V34 l30 -6 v29 a9 9 0 1 1 -9 -9 c1.6 0 3.1 .4 4.5 1 V38 L42 42 Z"
      fill="white"
    />
  </Svg>
);

/* Adobe-Acrobat-style PDF icon */
const Resume = () => (
  <div className="absolute inset-0 bg-[#ececef]">
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ fontFamily: "var(--font-sans)" }} aria-hidden>
      {/* white page with a folded top-right corner */}
      <path d="M24 12 H60 L80 32 V88 H24 Z" fill="#ffffff" stroke="#d7d7dd" strokeWidth="1.6" />
      <path d="M60 12 V32 H80 Z" fill="#d2d2d8" />
      {/* faint text lines */}
      <g stroke="#dcdce1" strokeWidth="3.4" strokeLinecap="round">
        <path d="M32 26 H52" />
        <path d="M32 34 H52" />
      </g>
      {/* red PDF badge */}
      <rect x="24" y="56" width="56" height="22" rx="3.5" fill="#e0342b" />
      <text x="52" y="68" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="800" fill="#ffffff" letterSpacing="0.5">
        PDF
      </text>
    </svg>
  </div>
);

const Calendar = ({ weekday, day }: { weekday: string; day: string }) => (
  <Svg>
    {/* iOS-style: white card, red weekday, large black day */}
    <rect width="100" height="100" fill="#ffffff" />
    <text
      x="50"
      y="26"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="19"
      fontWeight="700"
      fill="#ff3b30"
      style={{ fontFamily: "var(--font-sans)" }}
      suppressHydrationWarning
    >
      {weekday}
    </text>
    <text
      x="50"
      y="63"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="52"
      fontWeight="600"
      fill="#1c1c1e"
      style={{ fontFamily: "var(--font-sans)" }}
      suppressHydrationWarning
    >
      {day}
    </text>
  </Svg>
);

const Projects = () => (
  <Svg>
    <defs>
      <linearGradient id="prj" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7b78ff" />
        <stop offset="1" stopColor="#4b32c3" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#prj)" />
    <rect x="28" y="40" width="44" height="30" rx="5" fill="white" />
    <path
      d="M40 40 v-5 a4 4 0 0 1 4 -4 h12 a4 4 0 0 1 4 4 v5"
      fill="none"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <rect x="28" y="52" width="44" height="4" fill="#4b32c3" opacity="0.35" />
  </Svg>
);

const Mail = () => (
  <Svg>
    <defs>
      <linearGradient id="mail" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3aa0ff" />
        <stop offset="1" stopColor="#1466e0" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#mail)" />
    <rect x="20" y="30" width="60" height="42" rx="8" fill="white" />
    <path
      d="M24 36 L50 56 L76 36"
      fill="none"
      stroke="#1466e0"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Messages = () => (
  <Svg>
    <defs>
      <linearGradient id="msg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4cf05a" />
        <stop offset="1" stopColor="#22c33e" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#msg)" />
    <path
      d="M50 26 C31 26 20 37 20 50 c0 8 4 15 11 19 -1 5 -4 9 -7 12 6 0 12 -2 17 -6 3 .7 6 1 9 1 19 0 30 -11 30 -26 S69 26 50 26 Z"
      fill="white"
    />
  </Svg>
);

const LinkedIn = () => (
  <Svg>
    <defs>
      <linearGradient id="li" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2f8fe0" />
        <stop offset="1" stopColor="#0a66c2" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#li)" />
    <text
      x="50"
      y="54"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="52"
      fontWeight="700"
      fill="white"
    >
      in
    </text>
  </Svg>
);

const Behance = () => (
  <Svg>
    <defs>
      <linearGradient id="be" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a6cff" />
        <stop offset="1" stopColor="#0057ff" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#be)" />
    <text
      x="50"
      y="52"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="42"
      fontWeight="700"
      fill="white"
    >
      Bē
    </text>
  </Svg>
);

const Phone = () => (
  <Svg>
    <defs>
      <linearGradient id="dialer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5ad368" />
        <stop offset="1" stopColor="#1eb047" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#dialer)" />
    <path
      transform="translate(19 18) scale(2.7)"
      fill="#fff"
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
    />
  </Svg>
);

const Gmail = () => (
  <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
    <rect width="48" height="48" fill="#fff" />
    <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7a3 3 0 0 0 3-3V16.2z" />
    <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6a3 3 0 0 1-3-3V16.2z" />
    <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
    <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A4 4 0 0 0 7.298 8 4.298 4.298 0 0 0 3 12.298z" />
    <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A4 4 0 0 1 40.702 8 4.298 4.298 0 0 1 45 12.298z" />
  </svg>
);

const Contacts = () => (
  <Svg>
    <defs>
      <linearGradient id="ct-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e9e9ea" />
      </linearGradient>
    </defs>
    {/* light card */}
    <rect width="100" height="100" fill="url(#ct-bg)" />
    {/* right-edge index tabs: orange over blue */}
    <rect x="86" y="26" width="14" height="21" rx="3.5" fill="#ff9500" />
    <rect x="86" y="50" width="14" height="21" rx="3.5" fill="#1a8cff" />
    {/* grey person silhouette, centred */}
    <g fill="#7b7b80">
      <circle cx="46" cy="38" r="16" />
      <path d="M16 86c0-16.6 13.4-29 30-29s30 12.4 30 29z" />
    </g>
  </Svg>
);

/* --- registry -------------------------------------------------------- */

export function AppArt({ id }: { id: string }): ReactNode {
  const now = new Date();
  switch (id) {
    case "about":
      return <Notes />;
    case "experience":
      return <Finder />;
    case "finder":
      return <Finder />;
    case "photos":
      return <Photos />;
    case "camera":
      return <Camera />;
    case "music":
      return <Music />;
    case "resume":
      return <Resume />;
    case "timeline":
      return (
        <Calendar
          weekday={now.toLocaleDateString([], { weekday: "short" })}
          day={String(now.getDate())}
        />
      );
    case "projects":
      return <Projects />;
    case "mail":
      return <Mail />;
    case "contact":
      return <Messages />;
    case "linkedin":
      return <LinkedIn />;
    case "behance":
      return <Behance />;
    case "phone":
      return <Phone />;
    case "contacts":
      return <Contacts />;
    case "gmail":
      return <Gmail />;
    default:
      return <Fill bg="#0f53fc" />;
  }
}

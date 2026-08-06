import { PROFILE } from "./content";

export interface AppMeta {
  id: string;
  name: string;
  glyph: string;
  /** CSS background for the icon tile */
  bg: string;
  /** external link apps just open a URL */
  href?: string;
  /** dynamic island context label when opened */
  context?: string;
  inDock?: boolean;
  /** open a different app than this icon's id (custom dock icons) */
  route?: string;
  /** deep-link payload passed to the opened app (e.g. Finder category id) */
  payload?: string;
}

export const APPS: AppMeta[] = [
  {
    id: "about",
    name: "About Me",
    glyph: "about",
    bg: "linear-gradient(160deg,#fdfdfd,#e9e9ee)",
    context: "About Obaid",
  },
  {
    id: "experience",
    name: "Experience",
    glyph: "files",
    bg: "linear-gradient(160deg,#3aa0ff,#0f53fc)",
    context: "Browsing Experience",
  },
  {
    id: "photos",
    name: "Photos",
    glyph: "photos",
    bg: "linear-gradient(160deg,#ffffff,#f2f2f7)",
    context: "Photos",
  },
  {
    id: "camera",
    name: "Camera",
    glyph: "camera",
    bg: "linear-gradient(160deg,#3a3a3c,#1c1c1e)",
    context: "Camera",
  },
  {
    id: "music",
    name: "Music",
    glyph: "music",
    bg: "linear-gradient(160deg,#fb5c74,#fa2e56)",
    context: "Now Playing",
  },
  {
    id: "resume",
    name: "Resume",
    glyph: "resume",
    bg: "linear-gradient(160deg,#ff6a5a,#ff3b30)",
    context: "Reading Resume",
  },
  {
    id: "timeline",
    name: "Timeline",
    glyph: "timeline",
    bg: "linear-gradient(160deg,#ff9f0a,#ff7a00)",
    context: "Career Timeline",
  },
  {
    id: "projects",
    name: "Projects",
    glyph: "projects",
    bg: "linear-gradient(160deg,#5e5ce6,#3634a3)",
    context: "Projects",
  },
  /* ---- dock ---- */
  {
    id: "finder",
    name: "Finder",
    glyph: "finder",
    bg: "",
    context: "Finder",
    inDock: true,
  },
  {
    id: "contacts",
    name: "Contacts",
    glyph: "contacts",
    bg: "",
    context: "Contact",
    inDock: true,
  },
  {
    id: "tictactoe",
    name: "Tic-Tac-Toe",
    glyph: "tictactoe",
    bg: "",
    context: "Playing Tic-Tac-Toe",
    inDock: true,
  },
  {
    id: "snake",
    name: "Snake Chase",
    glyph: "snake",
    bg: "",
    context: "Playing Snake Chase",
    inDock: true,
  },
  {
    id: "flappybird",
    name: "Flappy Bird",
    glyph: "flappybird",
    bg: "",
    context: "Playing Flappy Bird",
    inDock: true,
  },
  { id: "dino", name: "Dino Run", glyph: "dino", bg: "", context: "Playing Dino Run", inDock: true },
  { id: "connectfour", name: "Connect Four", glyph: "connectfour", bg: "", context: "Playing Connect Four", inDock: true },
  { id: "pong", name: "Pong", glyph: "pong", bg: "", context: "Playing Pong", inDock: true },
  { id: "breakout", name: "Breakout", glyph: "breakout", bg: "", context: "Playing Breakout", inDock: true },
  { id: "whackamole", name: "Whack-a-Mole", glyph: "whackamole", bg: "", context: "Playing Whack-a-Mole", inDock: true },
  { id: "simon", name: "Simon", glyph: "simon", bg: "", context: "Playing Simon", inDock: true },
  {
    id: "linkedin",
    name: "LinkedIn",
    glyph: "linkedin",
    bg: "linear-gradient(160deg,#2f8fe0,#0a66c2)",
    href: PROFILE.linkedin,
    inDock: true,
  },
  {
    id: "behance",
    name: "Behance",
    glyph: "behance",
    bg: "linear-gradient(160deg,#2a6cff,#0057ff)",
    href: PROFILE.behance,
    inDock: true,
  },
  {
    id: "mail",
    name: "Mail",
    glyph: "mail",
    bg: "linear-gradient(160deg,#54b9ff,#1a8cff)",
    context: "Compose Mail",
    inDock: true,
  },
  {
    id: "contact",
    name: "Contact",
    glyph: "contact",
    bg: "linear-gradient(160deg,#30d158,#26a94a)",
    context: "Contact",
    inDock: true,
  },
  // opened only as an image-preview window; never shown on home/dock
  { id: "preview", name: "Preview", glyph: "preview", bg: "", inDock: true },
];

export const HOME_APPS = APPS.filter((a) => !a.inDock);
export const DOCK_APPS = APPS.filter((a) => a.inDock);
export const getApp = (id: string) => APPS.find((a) => a.id === id);

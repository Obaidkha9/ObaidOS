import type { Track } from "./store";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/*  All portfolio content lives here — edit freely.                    */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Obaid Yusufzai",
  role: "UX Engineer & Product Designer",
  tagline: "Designing calm, precise interfaces — and building them too.",
  location: "India",
  email: "yusufzaiobaid@gmail.com",
  linkedin: "https://www.linkedin.com/in/obaidyusufzai/",
  naukri: "https://www.naukri.com/mnjuser/profile?id=&altresid",
  behance: "https://www.behance.net/",
};

/* ---- Background music playlist ------------------------------------ */
/* Drop your MP3s in /public/music and update `src`. Gradients are used */
/* as artwork fallbacks until you add cover images.                     */
/* OBAID.FM — a curated personal collection. Album art is saved locally under
   /music/covers (fetched once from iTunes), so nothing is re-fetched at runtime;
   the gradients are fallbacks. */
export const PLAYLIST: Track[] = [
  { id: "billie-jean", title: "Billie Jean", artist: "Michael Jackson", src: "/music/billie-jean.mp3", cover: asset("/music/covers/billie-jean.jpg"), artwork: "linear-gradient(135deg,#e52d27,#b31217)" },
  { id: "uptown-funk", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", src: "/music/uptown-funk.mp3", cover: asset("/music/covers/uptown-funk.jpg"), artwork: "linear-gradient(135deg,#f7971e,#ffd200)" },
  { id: "beat-it", title: "Beat It", artist: "Michael Jackson", src: "/music/beat-it.mp3", cover: asset("/music/covers/beat-it.jpg"), artwork: "linear-gradient(135deg,#141e30,#243b55)" },
  { id: "stay", title: "Stay", artist: "The Kid LAROI & Justin Bieber", src: "/music/stay.mp3", cover: asset("/music/covers/stay.jpg"), artwork: "linear-gradient(135deg,#2fae8f,#0b3d2e)" },
  { id: "blinding-lights", title: "Blinding Lights", artist: "The Weeknd", src: "/music/blinding-lights.mp3", cover: asset("/music/covers/blinding-lights.jpg"), artwork: "linear-gradient(135deg,#ee0979,#ff6a00)" },
  { id: "starboy", title: "Starboy", artist: "The Weeknd ft. Daft Punk", src: "/music/starboy.mp3", cover: asset("/music/covers/starboy.jpg"), artwork: "linear-gradient(135deg,#e11d2a,#7a0b12)" },
  { id: "sunflower", title: "Sunflower", artist: "Post Malone & Swae Lee", src: "/music/sunflower.mp3", cover: asset("/music/covers/sunflower.jpg"), artwork: "linear-gradient(135deg,#e2352b,#1a1a1a)" },
  { id: "gods-plan", title: "God's Plan", artist: "Drake", src: "/music/gods-plan.mp3", cover: asset("/music/covers/gods-plan.jpg"), artwork: "linear-gradient(135deg,#3a3a3a,#0d0d0d)" },
];

/* ---- About (Notes app) -------------------------------------------- */
export const ABOUT = {
  title: "About Me",
  updated: "Edited just now",
  sections: [
    {
      heading: "Introduction",
      body: "I'm Obaid — a UX Engineer and Product Designer who lives in the space between design and code. I care about interfaces that feel obvious, motion that feels physical, and systems that scale. This whole portfolio is a small proof of that obsession.",
    },
    {
      heading: "Skills",
      list: [
        "Product & Interaction Design",
        "Design Systems & Tokens",
        "Prototyping (Figma, Framer)",
        "Front-end: React / Next.js / TypeScript",
        "Motion Design & Micro-interactions",
        "User Research & Usability Testing",
      ],
    },
    {
      heading: "UX Design Journey",
      body: "Started in visual design, fell for interaction design, then learned to code so nothing would get lost in handoff. Today I ship production UI and own the design system that keeps it consistent.",
    },
    {
      heading: "Tools",
      list: [
        "Figma · FigJam",
        "Framer · Principle",
        "VS Code · Cursor",
        "Storybook",
        "Notion · Linear",
      ],
    },
    {
      heading: "Education",
      body: "B.Des in Interaction Design. Continuous self-teaching in front-end engineering and motion.",
    },
    {
      heading: "Certifications",
      list: [
        "Google UX Design Professional Certificate",
        "Nielsen Norman Group — UX Foundations",
        "Interaction Design Foundation — Design Systems",
      ],
    },
  ],
};

/* ---- Experience (Files app) --------------------------------------- */
export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  start: string;
  end: string;
  color: string;
  summary: string;
  responsibilities: string[];
  projects: string[];
  achievements: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "techcream",
    company: "TechCream",
    role: "UI/UX Designer",
    period: "Jan 2022 – Sep 2023",
    start: "Aug 2022",
    end: "May 2024",
    color: "#34c759",
    summary:
      "at Techcream Solutions, designing user-centric web applications and digital products by combining UX research, interface design, and collaborative problem-solving to create intuitive and engaging user experiences.",
    responsibilities: [
      "Designed responsive websites, web applications, and user interfaces focused on usability, accessibility, and visual consistency.",
      "Conducted user testing and incorporated feedback to improve usability and overall user satisfaction.",
      "Contributed to the end-to-end design process, from concept exploration to final delivery.",
    ],
    projects: ["Carwaalah", "Ask.ai", "Agent.ai"],
    achievements: [
      "Cut design-to-dev handoff time by ~40%",
      "Established the team's first Figma library",
    ],
  },
  {
    id: "cognitive-stars",
    company: "Cognitive Stars",
    role: "UX Designer",
    period: "Jul 2024 – Sep 2025",
    start: "Jun 2024",
    end: "Aug 2025",
    color: "#0f53fc",
    summary:
      "at Cognitive Stars, delivering data-driven dashboards, brand experiences, and digital design solutions that improved usability, visual consistency, and client engagement across multiple projects.",
    responsibilities: [
      "Designed intuitive Power BI dashboards to improve data visualization and reporting experiences.",
      "Contributed to ideation and brainstorming sessions, helping shape innovative design solutions and product concepts.",
      "Led branding initiatives, including logo design, visual identity systems, and website design.",
      "Created marketing collateral, social media creatives, brochures, and promotional assets for client campaigns.",
    ],
    projects: ["Analytics Dashboard", "Logo Design", "Brochures", "Social Media Creatives"],
    achievements: [
      "Design system adopted across 3 product teams",
      "Improved task-completion rate by 27% in usability tests",
    ],
  },
  {
    id: "ensylon",
    company: "Ensylon",
    role: "UX Engineer III",
    period: "Sep 2025 – Sep 2026",
    start: "Sep 2025",
    end: "Present",
    color: "#8f00ff",
    summary:
      "at Ensylon, designing and improving enterprise HR and employee experience platforms through user-centered design, scalable design systems, and cross-functional collaboration.",
    responsibilities: [
      "Built and maintained scalable design systems, reusable components, and design documentation.",
      "Designed user flows, wireframes, high-fidelity interfaces, and interactive prototypes.",
      "Collaborated with product, engineering, and business teams to deliver user-focused solutions.",
      "Enhanced employee self-service, attendance, leave management, and workflow automation experiences.",
    ],
    projects: ["Design System", "Employee Portal", "Nexus"],
    achievements: [
      "Reduced UI defect rate through design-in-code workflow",
      "Set the motion language used across the product",
    ],
  },
];

/* ---- Projects (each opens as an app) ------------------------------ */
export interface Project {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  year: string;
  tags: string[];
  overview: string;
  problem: string;
  research: string;
  wireframes: string;
  solution: string;
  impact: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "employee-portal",
    name: "Employee Portal",
    subtitle: "Reimagining the employee experience at Ensylon",
    color: "#0F53FC",
    year: "2025",
    tags: ["Enterprise UX", "Information Architecture", "Dashboard Design"],
    overview:
      "iConnect transforms a fragmented, module-driven HR portal into a modern employee command center focused on productivity, discoverability and self-service.",
    problem:
      "Employees knew features existed but couldn't find them — deep navigation, fragmented information and hidden actions created high cognitive load.",
    research:
      "80% access attendance daily, 70% need leave actions frequently, yet 58% struggle to find features and most use only 3–4 modules.",
    wireframes:
      "Rebuilt the information architecture around tasks — Dashboard, Quick Actions, My Workspace and Resources — collapsing a sprawling menu into four surfaces.",
    solution:
      "A task-first command center with one-click quick actions, a prioritized dashboard, unified workflows and an AI assistant for discoverability.",
    impact: [
      "40% faster task completion",
      "60% fewer navigation steps",
      "4 core workflows unified into one command center",
    ],
  },
  {
    id: "focus-forge",
    name: "FocusForge",
    subtitle: "Building sustainable focus habits through gamification",
    color: "#6258f6",
    year: "2026",
    tags: ["Behavioral Design", "Gamification", "Mobile App"],
    overview:
      "FocusForge helps remote professionals build sustainable focus habits through simple sessions, visible progress, and meaningful rewards.",
    problem:
      "Remote work is flexible, but constant distractions, weak accountability, and inconsistent routines make focus fragile over time.",
    research:
      "The concept centers on three user groups—remote employees, freelancers, and founders—who share a need for motivation and accountability rather than another task manager.",
    wireframes:
      "The primary loop stays intentionally simple: open the app, view a goal, start a session, complete it, earn a reward, track progress, and return tomorrow.",
    solution:
      "A supportive focus companion combining timed sessions, XP progression, badges, streaks, custom milestones, and progress analytics.",
    impact: [
      "Turns focus into a repeatable daily habit",
      "Makes progress visible through goals and milestones",
      "Balances accountability with positive reinforcement",
    ],
  },
  {
    id: "ask-ai",
    name: "ASK AI",
    subtitle: "Conversational intelligence",
    color: "#8f00ff",
    year: "2024",
    tags: ["Conversational UI", "Prototyping"],
    overview:
      "An AI assistant embedded across a B2B suite. Focused on trust, transparency, and graceful failure.",
    problem:
      "Users didn't trust AI answers and couldn't tell when the assistant was unsure.",
    research:
      "Tested confidence-signalling patterns and citation surfaces with 20 users.",
    wireframes:
      "Explored streaming states, source chips, and correction affordances.",
    solution:
      "A calm chat surface with inline citations, editable prompts, and honest 'I'm not sure' states.",
    impact: ["Trust score +42%", "Daily active usage doubled"],
  },
  {
    id: "carwaalah",
    name: "Carwaalah",
    subtitle: "Car marketplace, reimagined",
    color: "#ff9500",
    year: "2025",
    tags: ["Marketplace", "Mobile"],
    overview:
      "A mobile-first car marketplace. Designed browsing, comparison, and a frictionless enquiry flow.",
    problem:
      "Buyers abandoned listings because comparison and financing were confusing.",
    research: "Funnel analysis + 8 moderated sessions on the enquiry flow.",
    wireframes: "Card-based comparison and a 3-step enquiry prototype.",
    solution:
      "Side-by-side comparison, transparent pricing, and a guided enquiry with instant callback.",
    impact: ["Enquiry conversion +38%", "Bounce on listings −22%"],
  },
  {
    id: "youtube-redesign",
    name: "YouTube Redesign",
    subtitle: "A concept study",
    color: "#ff3b30",
    year: "2023",
    tags: ["Concept", "Interaction"],
    overview:
      "A self-initiated concept exploring a calmer, more intentional YouTube watch + discovery experience.",
    problem:
      "Endless-feed fatigue and buried controls hurt intentional viewing.",
    research: "Diary study with 6 heavy users on watch habits.",
    wireframes: "Reworked the watch page and a 'sessions' discovery model.",
    solution:
      "Focused watch mode, session-based recommendations, and reclaimed control surfaces.",
    impact: ["Concept featured in design community", "8k+ views on case study"],
  },
  {
    id: "design-system",
    name: "Design System",
    subtitle: "Tokens → components → product",
    color: "#00c7be",
    year: "2025",
    tags: ["Design System", "Tokens", "Docs"],
    overview:
      "A production design system: primitive + semantic tokens, themeable components, and living docs.",
    problem: "Inconsistent UI and slow delivery across teams.",
    research: "Audited 300+ screens to find the real component surface area.",
    wireframes: "Token architecture and theming model defined first.",
    solution:
      "Two-tier tokens, Storybook docs, and code-first components adopted org-wide.",
    impact: [
      "Adopted by 3 teams",
      "UI consistency defects down sharply",
      "Faster feature delivery",
    ],
  },
];

/* ---- Photos / Camera feed ----------------------------------------- */
export interface Photo {
  id: string;
  category: string;
  gradient: string;
  label: string;
  src?: string; // real image
  aspect?: string; // natural aspect ratio for the masonry tile
  span?: boolean; // tall in masonry
}

const GRADS = [
  "linear-gradient(135deg,#0f53fc,#00c6ff)",
  "linear-gradient(135deg,#8f00ff,#0f53fc)",
  "linear-gradient(135deg,#ff512f,#dd2476)",
  "linear-gradient(135deg,#11998e,#38ef7d)",
  "linear-gradient(135deg,#f7971e,#ffd200)",
  "linear-gradient(135deg,#2b5876,#4e4376)",
  "linear-gradient(135deg,#ee0979,#ff6a00)",
  "linear-gradient(135deg,#141e30,#243b55)",
];

export const PHOTO_CATEGORIES = [
  "Work Setup",
  "UX Process",
  "Wireframes",
  "Design Systems",
  "Personal",
  "Travel",
];

export const PHOTOS: Photo[] = [
  // Scattered order with user-requested swaps (mem-22↔14, mem-3↔6, mem-17↔7)
  // and mem-21 removed.
  { id: "mem-22", category: "Memories", src: asset("/photos/mem-22.jpg"), aspect: "1400/933", gradient: GRADS[6], label: "Dec 2025" },
  { id: "mem-1", category: "Memories", src: asset("/photos/mem-1.webp"), aspect: "933/1400", gradient: GRADS[1], label: "Memory" },
  { id: "mem-9", category: "Memories", src: asset("/photos/mem-9.webp"), aspect: "1400/1050", gradient: GRADS[1], label: "Dec 2024" },
  { id: "mem-6", category: "Memories", src: asset("/photos/mem-6.webp"), aspect: "1400/1050", gradient: GRADS[6], label: "Oct 2024" },
  { id: "mem-12", category: "Memories", src: asset("/photos/mem-12.webp"), aspect: "1400/1050", gradient: GRADS[4], label: "Jan 2025" },
  { id: "mem-15", category: "Memories", src: asset("/photos/mem-15.webp"), aspect: "1050/1400", gradient: GRADS[7], label: "Mar 2025" },
  { id: "mem-5", category: "Memories", src: asset("/photos/mem-5.webp"), aspect: "1400/1050", gradient: GRADS[5], label: "Sep 2024" },
  { id: "mem-8", category: "Memories", src: asset("/photos/mem-8.webp"), aspect: "1400/1050", gradient: GRADS[0], label: "Nov 2024" },
  { id: "mem-10", category: "Memories", src: asset("/photos/mem-10.webp"), aspect: "1400/1050", gradient: GRADS[2], label: "Dec 2024" },
  { id: "mem-17", category: "Memories", src: asset("/photos/mem-17.webp"), aspect: "1050/1400", gradient: GRADS[1], label: "Mar 2025" },
  { id: "mem-13", category: "Memories", src: asset("/photos/mem-13.webp"), aspect: "1400/1050", gradient: GRADS[5], label: "Jan 2025" },
  { id: "mem-16", category: "Memories", src: asset("/photos/mem-16.webp"), aspect: "1400/1050", gradient: GRADS[0], label: "Mar 2025" },
  { id: "mem-19", category: "Memories", src: asset("/photos/mem-19.webp"), aspect: "1400/1050", gradient: GRADS[3], label: "May 2025" },
  { id: "mem-11", category: "Memories", src: asset("/photos/mem-11.webp"), aspect: "1050/1400", gradient: GRADS[3], label: "Dec 2024" },
  { id: "mem-2", category: "Memories", src: asset("/photos/mem-2.webp"), aspect: "1400/933", gradient: GRADS[2], label: "Memory" },
  { id: "mem-18", category: "Memories", src: asset("/photos/mem-18.webp"), aspect: "1400/1050", gradient: GRADS[2], label: "Mar 2025" },
  { id: "mem-3", category: "Memories", src: asset("/photos/mem-3.webp"), aspect: "1400/1050", gradient: GRADS[3], label: "May 2025" },
  { id: "mem-20", category: "Memories", src: asset("/photos/mem-20.webp"), aspect: "1050/1400", gradient: GRADS[4], label: "May 2025" },
  { id: "mem-4", category: "Memories", src: asset("/photos/mem-4.webp"), aspect: "1400/1050", gradient: GRADS[4], label: "Memory" },
  { id: "mem-14", category: "Memories", src: asset("/photos/mem-14.webp"), aspect: "1400/1050", gradient: GRADS[6], label: "Mar 2025" },
  { id: "mem-7", category: "Memories", src: asset("/photos/mem-7.webp"), aspect: "1050/1400", gradient: GRADS[7], label: "Oct 2024" },
  { id: "arsenal-1", category: "Arsenal", src: asset("/photos/arsenal-1.webp"), aspect: "736/981", gradient: GRADS[2], label: "Champions 25/26 kit" },
  { id: "arsenal-8", category: "Arsenal", src: asset("/photos/arsenal-8.webp"), aspect: "1500/693", gradient: GRADS[6], label: "Champions of England" },
  { id: "arsenal-5", category: "Arsenal", src: asset("/photos/arsenal-5.webp"), aspect: "735/919", gradient: GRADS[7], label: "It All Worked Out" },
  { id: "arsenal-4", category: "Arsenal", src: asset("/photos/arsenal-4.webp"), aspect: "735/490", gradient: GRADS[6], label: "Lifting the title" },
  { id: "arsenal-7", category: "Arsenal", src: asset("/photos/arsenal-7.webp"), aspect: "736/1105", gradient: GRADS[3], label: "Gabriel Magalhães" },
  { id: "arsenal-3", category: "Arsenal", src: asset("/photos/arsenal-3.webp"), aspect: "735/787", gradient: GRADS[4], label: "We all follow the Arsenal" },
  { id: "arsenal-6", category: "Arsenal", src: asset("/photos/arsenal-6.webp"), aspect: "735/900", gradient: GRADS[2], label: "Trophy parade" },
  { id: "arsenal-2", category: "Arsenal", src: asset("/photos/arsenal-2.webp"), aspect: "735/469", gradient: GRADS[6], label: "Victory bus" },
  { id: "arsenal-heritage", category: "Arsenal", src: asset("/arsenal-heritage.webp"), aspect: "1672/941", gradient: GRADS[6], label: "Arsenal Heritage" },
];

export const PHOTO_SECTIONS = ["Memories", "Arsenal"];

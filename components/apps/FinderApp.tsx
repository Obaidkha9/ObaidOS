"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "./AppChrome";
import { ABOUT, EXPERIENCE, PROJECTS, PROFILE } from "@/lib/content";
import { useLaunch } from "@/lib/useLaunch";
import { useOS } from "@/lib/store";
import { spring } from "@/lib/utils";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/*  macOS-Tahoe Finder — two contexts (About / Projects), each with    */
/*  its own sidebar. The deep-link `payload` picks the section + root.  */
/* ------------------------------------------------------------------ */

type Kind = "folder" | "file" | "image" | "link";
type View = "grid" | "list" | "gallery";
type Section = "about" | "projects";

interface Node {
  id: string;
  name: string;
  kind: Kind;
  ext?: string; // file extension for icon (md, json, txt, fig, pdf, url, app…)
  subtitle?: string; // Finder folder subtitle (e.g. role · dates)
  modified?: string;
  color?: string; // folder tint / image gradient
  href?: string; // external link
  mail?: { to: string; subject: string; body: string }; // compose: native app on touch, Gmail web on desktop
  view?: View; // preferred view when this folder is opened
  icon?: string; // sidebar icon key (projects section)
  src?: string; // real image (e.g. project cover.png)
  caseStudy?: string; // project id — opens the full case-study modal on click
  children?: Node[];
  preview?: ReactNode; // Quick-Look content for files
  rate?: number; // video playback rate for the preview window (1 = normal)
}

const ACCENT = "#ff9f0a";

/* per-project cover images used for each folder's cover.png */
const PROJECT_COVER: Record<string, string> = {
  "employee-portal": asset("/employee-portal.webp"),
  "ask-ai": asset("/askai.webp"),
  carwaalah: asset("/carwaalah-card.jpg"),
  "youtube-redesign": asset("/youtube.webp"),
  "design-system": asset("/designsystem.webp"),
  "focus-forge": asset("/focus-forge.webp"),
};

/* ---------- Quick-Look document renderers ------------------------- */
function Doc({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[13.5px] leading-relaxed text-white/85">{children}</div>;
}
function H({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}
function Bullets({ items, cols = 1 }: { items: string[]; cols?: 1 | 2 }) {
  return (
    <ul className={cols === 2 ? "grid grid-cols-2 gap-x-8 gap-y-1.5" : "space-y-1.5"}>
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span style={{ color: ACCENT }}>•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- build the two Finder trees from portfolio content ----- */
function useTree(): Record<Section, Node[]> {
  return useMemo(() => {
    const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;
    const projFolder = (p: (typeof PROJECTS)[number], extra: Node[] = []): Node => ({
      id: `proj-${p.id}`,
      name: p.name,
      kind: "folder",
      color: p.color,
      subtitle: `${p.tags[0] ?? "Design"} · ${p.year}`,
      children: [
        {
          id: `${p.id}-overview`,
          name: "Case Study.md",
          kind: "file",
          ext: "md",
          modified: p.year,
          caseStudy: p.id,
        },
        ...extra,
        {
          id: `${p.id}-cover`,
          name: "cover.png",
          kind: "image",
          color: `linear-gradient(160deg,${p.color},#0b0b12)`,
          src: PROJECT_COVER[p.id],
        },
      ],
    });

    /* ================= ABOUT section ================= */
    const aboutFiles: Node[] = [
      {
        id: "readme",
        name: "README.md",
        kind: "file",
        ext: "md",
        modified: "Today, 9:41 AM",
        preview: (
          <Doc>
            <H># {PROFILE.name}</H>
            <p>{ABOUT.sections[0].body}</p>
            <p className="text-white/60">{PROFILE.tagline}</p>
          </Doc>
        ),
      },
      {
        id: "currently",
        name: "profile.ts",
        kind: "file",
        ext: "ts",
        modified: "Today, 9:41 AM",
        preview: (
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#d7dae0]">
            <span style={{ color: "#c678dd" }}>export const</span>{" "}
            <span style={{ color: "#56b6c2" }}>profile</span> = {"{"}{"\n"}
            {"  "}role: <span style={{ color: "#98c379" }}>{'"UX Engineer"'}</span>,{"\n"}
            {"  "}specialty: <span style={{ color: "#98c379" }}>{'"Product Design"'}</span>,{"\n"}
            {"  "}experience: <span style={{ color: "#98c379" }}>{'"4+ Years"'}</span>,{"\n"}
            {"  "}location: <span style={{ color: "#98c379" }}>{'"Jaipur, India"'}</span>,{"\n"}
            {"  "}availableForWork: <span style={{ color: "#d19a66" }}>true</span>,{"\n"}
            {"}"} <span style={{ color: "#c678dd" }}>as const</span>;
          </pre>
        ),
      },
      { id: "about-setup", name: "My Setup.png", kind: "file", ext: "png", src: asset("/interest-8.jpg") },
      { id: "about-video", name: "Wanderer.mp4", kind: "file", ext: "mp4", modified: "Today", src: asset("/wanderer.mp4"), rate: 0.8 },
    ];

    const expFolders: Node[] = [...EXPERIENCE].reverse().map((e) => ({
      id: `exp-${e.id}`,
      name: e.company,
      kind: "folder" as const,
      color: e.color,
      subtitle: `${e.role} · ${e.start} – ${e.end}`,
      children: [
        {
          id: `${e.id}-role`,
          name: "role.txt",
          kind: "file",
          ext: "txt",
          modified: e.end,
          preview: (
            <Doc>
              <H>{e.role}</H>
              <p className="text-white/60">{e.company} · {e.period}</p>
              <p>{e.summary}</p>
              <H>Responsibilities</H>
              <Bullets items={e.responsibilities} />
            </Doc>
          ),
        },
        {
          id: `${e.id}-projects`,
          name: "projects.txt",
          kind: "file",
          ext: "txt",
          modified: e.end,
          preview: <Doc><H>Projects</H><Bullets items={e.projects} /></Doc>,
        },
      ],
    }));

    const internships: Node[] = [
      {
        id: "intern-readme",
        name: "Internship.md",
        kind: "file",
        ext: "md",
        modified: "2022",
        preview: (
          <Doc>
            <H>Internship</H>
            <p className="text-white/60">TechCream · Jan 2022 – March 2022</p>
            <Bullets
              items={[
                "Contributed to the successful completion of a project during a 3-month internship.",
                "Assisted in ideation and concept development for design solutions.",
                "Conducted research to inform design decisions and improve user experience.",
                "Collaborated with cross-functional teams to deliver business-focused features.",
              ]}
            />
          </Doc>
        ),
      },
    ];

    const skillsFiles: Node[] = [
      {
        id: "skills-txt",
        name: "skills.txt",
        kind: "file",
        ext: "txt",
        modified: "Today",
        preview: (
          <Doc>
            <ul className="space-y-2.5">
              {[
                ["UX", "User Research, User Interviews, Persona Creation, User Journey Mapping, Information Architecture, Usability Testing, Interaction Design, Accessibility (WCAG), Design Thinking"],
                ["UI", "Wireframing, Prototyping, Visual Design, Responsive Design, Mobile App Design, Dashboard Design, Enterprise Applications"],
                ["Design System", "Component Libraries, Design Tokens, Design Documentation, Design Governance, Scalable UI Systems"],
                ["Front-End Knowledge", "HTML5, CSS3, Tailwind CSS, Bootstrap, Responsive Layouts"],
              ].map(([label, items]) => (
                <li key={label} className="flex gap-2">
                  <span style={{ color: ACCENT }}>•</span>
                  <span><span className="font-semibold text-white">{label}:</span> {items}</span>
                </li>
              ))}
            </ul>
          </Doc>
        ),
      },
      {
        id: "tools-fig",
        name: "tools.fig",
        kind: "file",
        ext: "fig",
        modified: "Today",
        preview: (
          <Doc>
            <H>Tools</H>
            <Bullets cols={2} items={["Figma", "Claude", "Framer", "Webflow", "Adobe XD", "Axure RP", "Photoshop", "Illustrator", "Canva", "VS Code"]} />
          </Doc>
        ),
      },
    ];

    const certs: Node[] = [
      { id: "cert-uiux", name: "UI-UX & Figma — Udemy.png", src: asset("/cert-uiux.webp") },
      { id: "cert-htmlcss", name: "HTML5 & CSS3 — Udemy.png", src: asset("/cert-htmlcss.webp") },
      { id: "cert-adobexd", name: "Adobe XD Masterclass — Udemy.png", src: asset("/cert-adobexd.webp") },
      { id: "cert-webflow", name: "Figma to Webflow — Udemy.png", src: asset("/cert-webflow.webp") },
      { id: "cert-wordpress", name: "WordPress Developer — Udemy.png", src: asset("/cert-wordpress.webp") },
    ].map((c) => ({ ...c, kind: "file" as const, ext: "png" }));

    const interests: Node[] = [
      { id: "in-vid-1", name: "Watching Cards (Tehri).mp4", kind: "file", ext: "mp4", src: asset("/interest-1.mp4") },
      { id: "in-vid-2", name: "Origami.mp4", kind: "file", ext: "mp4", src: asset("/interest-2.mp4") },
      { id: "in-vid-3", name: "Shooting.mp4", kind: "file", ext: "mp4", src: asset("/interest-3.mp4") },
      { id: "in-vid-4", name: "Snooker.mp4", kind: "file", ext: "mp4", src: asset("/interest-4.mp4") },
      { id: "in-vid-7", name: "Window Shopping.mp4", kind: "file", ext: "mp4", src: asset("/interest-7.mp4") },
    ];

    const contact: Node[] = [
      {
        id: "ct-mail",
        name: "Mail.app",
        kind: "link",
        ext: "app",
        // Touch devices → default mail app (already signed in) via mailto:;
        // desktop → Gmail web compose in the logged-in session. See open().
        mail: {
          to: PROFILE.email,
          subject: "Let's connect — via Obaid OS",
          body: "Hi Obaid,\n\nI came across your portfolio (Obaid OS) and I'd love to connect.\n\n",
        },
      },
      { id: "ct-li", name: "LinkedIn.url", kind: "link", ext: "url", href: PROFILE.linkedin },
      { id: "ct-naukri", name: "Naukri.url", kind: "link", ext: "url", href: "https://www.naukri.com" },
    ];

    const about: Node[] = [
      { id: "about", name: "About Me", kind: "folder", color: "#ff9f0a", icon: "person", children: aboutFiles },
      { id: "experience", name: "Professional Experience", kind: "folder", color: "#ff9f0a", icon: "briefcase", children: expFolders },
      { id: "internships", name: "Internship", kind: "folder", color: "#ff9f0a", icon: "intern", children: internships },
      { id: "skills", name: "Skills", kind: "folder", color: "#ff9f0a", icon: "skills", children: skillsFiles },
      { id: "certificates", name: "Certifications", kind: "folder", color: "#ff9f0a", icon: "certificate", children: certs },
      { id: "interests", name: "Interests", kind: "folder", color: "#ff9f0a", icon: "interests", children: interests },
      { id: "contact", name: "Contact", kind: "folder", color: "#ff9f0a", icon: "contact", children: contact },
    ];

    /* ================= PROJECTS section ================= */
    const Sub = ({ children }: { children: ReactNode }) => (
      <p className="mt-1 font-semibold text-white">{children}</p>
    );
    const Mono = ({ children }: { children: ReactNode }) => (
      <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[12.5px] leading-relaxed text-white/80 ring-1 ring-white/10">{children}</pre>
    );
    const dsFiles: Node[] = [
      {
        id: "ds-docs",
        name: "documentation.pdf",
        kind: "file",
        ext: "pdf",
        modified: "2 weeks ago",
        preview: (
          <Doc>
            <H>Button Component Documentation</H>
            <p>Buttons allow users to trigger actions, submit forms, and navigate workflows. They communicate hierarchy and guide users toward primary tasks.</p>
            <Sub>The component library currently includes</Sub>
            <Bullets items={["Primary Button", "Secondary Button", "Tertiary Button", "Default State", "Selected State", "Disabled State"]} />
            <Sub>Your system currently supports</Sub>
            <Bullets items={["Primary buttons", "Secondary buttons", "Tertiary buttons", "Multiple interaction states"]} />

            <H>🧭 When to Use</H>
            <Sub>Use Primary Buttons For</Sub>
            <Bullets items={["Main call-to-actions", "Form submissions", "Critical workflow actions", "High-emphasis interactions"]} />
            <p className="text-white/55">Examples: Save · Continue · Submit · Confirm</p>
            <Sub>Use Secondary Buttons For</Sub>
            <Bullets items={["Supporting actions", "Alternative flows", "Less prominent actions"]} />
            <p className="text-white/55">Examples: Cancel · Back · Skip</p>
            <Sub>Use Tertiary Buttons For</Sub>
            <Bullets items={["Low emphasis actions", "Utility interactions", "Minimal interfaces"]} />
            <p className="text-white/55">Examples: Learn More · View Details · Optional actions</p>

            <H>🚫 Avoid Using Buttons For</H>
            <Bullets items={["Navigation links", "Static content", "Multiple competing primary actions", "Overcrowded action groups"]} />

            <H>🧩 Anatomy</H>
            <Sub>Component Structure</Sub>
            <Mono>{`Button Container
├── Leading Icon (Optional)
├── Label
├── Trailing Icon (Optional)
└── State Layer`}</Mono>
            <Bullets items={["Container — Main clickable surface", "Label — Action text", "Leading Icon — Optional contextual icon", "Trailing Icon — Optional directional / action icon", "State Layer — Hover / pressed interaction feedback"]} />

            <H>📏 Structure Rules</H>
            <Sub>Padding</Sub>
            <Bullets items={["Horizontal → 16–20px", "Vertical → 10–14px"]} />
            <Sub>Icon Spacing</Sub>
            <Bullets items={["8px gap between icon and label"]} />
            <Sub>Border Radius</Sub>
            <Bullets items={["Radius → 12–16px (rounded buttons)"]} />

            <H>🎨 Variants</H>
            <Sub>1. Primary Button</Sub>
            <p>High-emphasis action button — most important action in a section.</p>
            <Bullets items={["Filled background", "Strong contrast", "Highest visual priority"]} />
            <Sub>2. Secondary Button</Sub>
            <p>Medium-emphasis action button — alternative / supporting actions.</p>
            <Bullets items={["Lower visual weight", "Outline or lighter surface"]} />
            <Sub>3. Tertiary Button</Sub>
            <p>Low-emphasis action button — utility and inline interactions.</p>
            <Bullets items={["Minimal styling", "Text-focused appearance"]} />

            <H>⚡ States</H>
            <Bullets items={["Default — Initial interactive state", "Selected — Active / pressed state", "Disabled — Non-interactive state"]} />
            <Sub>Recommended Additional States</Sub>
            <Bullets items={["Hover — Pointer feedback", "Focus — Keyboard accessibility", "Active — Pressed interaction", "Loading — Processing state"]} />

            <H>♿ Accessibility</H>
            <Sub>Contrast</Sub>
            <Bullets items={["Text contrast ≥ 4.5:1", "Disabled state remains readable"]} />
            <Sub>Touch Targets</Sub>
            <Bullets items={["Minimum clickable area: 44 × 44 px"]} />
            <Sub>Focus Visibility</Sub>
            <Bullets items={["Visible focus ring", "Clear keyboard navigation indicators", "Brand-blue outline, 2px focus stroke"]} />
            <Sub>Development</Sub>
            <Bullets items={["Keyboard support: Tab, Enter, Space", 'ARIA: aria-disabled="true" when needed']} />
            <Mono>{`<button>Continue</button>`}</Mono>

            <H>📱 Responsive Behavior</H>
            <Bullets items={["Desktop — Fixed or content-based width", "Tablet — Adaptive spacing", "Mobile — Full-width buttons when needed; increased touch area"]} />

            <H>📏 Spacing Guidelines</H>
            <Bullets items={["Between buttons → 8px–12px horizontal spacing", "Correct: [Primary] [Secondary]", "Avoid: [Primary] [Primary]"]} />

            <H>✅ Best Practices</H>
            <Sub>Do</Sub>
            <Bullets items={["Use one primary action per section", "Maintain consistent spacing", "Keep labels concise", "Use clear action-oriented text", "Maintain visual hierarchy"]} />
            <Sub>Don’t</Sub>
            <Bullets items={["Use multiple primary buttons together", "Use vague labels like “Click Here”", "Use disabled buttons without explanation", "Overuse tertiary buttons for important actions", "Reduce contrast excessively"]} />

            <H>🎯 Label Guidelines</H>
            <Bullets items={["Use verb-first labels and clear action language", "Good: Save Changes · Continue · Submit · Create Account", "Avoid: Okay · Click · Proceed Now Please"]} />

            <H>🌗 Theming</H>
            <p>Brand color <span className="font-mono text-white">#0F53FC</span> — recommended usage:</p>
            <Bullets items={["Primary backgrounds", "Focus rings", "Selected states", "Hover overlays"]} />
            <Sub>Suggested Token Mapping</Sub>
            <Bullets items={["Surface/Primary → Primary button background", "Surface/Secondary → Secondary surface", "Text/OnPrimary → Primary label", "Border/Default → Secondary borders", "State/Hover → Hover overlays"]} />

            <H>💻 Developer Notes</H>
            <Mono>{`<Button
  variant="primary"
  state="default"
  size="md"
  disabled={false}
/>`}</Mono>
            <Bullets items={["Variant → Primary · Secondary · Tertiary", "State → Default · Hover · Focus · Active · Disabled · Loading", "Size → Small · Medium · Large"]} />

            <H>🧱 Figma Documentation Layout</H>
            <Bullets items={["Hero → Preview Playground → Anatomy → Variants → States → Accessibility → Best Practices → Do / Don’t → Tokens → Developer Notes"]} />
            <Sub>Suggested Visual Layout</Sub>
            <Bullets items={["80px between sections", "Content width 960–1100px", "12 columns · 24px gutter", "Cards: 16px radius, subtle border, soft shadow"]} />

            <H>🔥 Recommended Future Improvements</H>
            <Bullets items={["Hover states", "Focus states", "Loading states", "Icon-only buttons", "Split buttons", "Destructive buttons", "Dark mode variants", "Size variants", "Icon alignment rules", "Motion guidelines"]} />
          </Doc>
        ),
      },
      { id: "ds-variables", name: "variables.png", kind: "file", ext: "png", modified: "This week", src: asset("/ds-variables.jpg") },
    ];
    const assignmentFiles: Node[] = [
      { id: "asg-campo", name: "Campo — Landing Page.png", src: asset("/assign-campo.webp") },
      { id: "asg-carwaalah", name: "Carwaalah.png", src: asset("/assign-carwaalah.webp") },
      { id: "asg-chatbot", name: "Chatbot.ai.png", src: asset("/assign-chatbot.webp") },
      { id: "asg-easify", name: "Easify.png", src: asset("/assign-easify.webp") },
      { id: "asg-elearning", name: "eLearning — Dashboard.png", src: asset("/assign-elearning.webp") },
      { id: "asg-taskease", name: "Taskease.png", src: asset("/assign-taskease.webp") },
      { id: "asg-thermofisher", name: "ThermoFisher.png", src: asset("/assign-thermofisher.webp") },
      { id: "asg-xmoonshot", name: "Xmoonshot.png", src: asset("/assign-xmoonshot.webp") },
      { id: "asgn-3", name: "Hotel Booking App.png", src: asset("/asgn-3.jpg") },
      { id: "asgn-2", name: "Astrology App — Wireframes.png", src: asset("/asgn-2.jpg") },
      { id: "asgn-5", name: "LinkLeaf — Customizer.png", src: asset("/asgn-5.jpg") },
      { id: "asgn-6", name: "Relume — AI Websites.png", src: asset("/asgn-6.jpg") },
      { id: "asgn-7", name: "LinkLeaf — Mobile Screens.png", src: asset("/asgn-7.jpg") },
    ].map((c) => ({ ...c, kind: "file" as const, ext: "png" }));

    // Artworks — poster / graphic design pieces (same file-tile → preview flow)
    const artworkFiles: Node[] = [
      { id: "art-1", name: "Tottenham — Son.png", src: asset("/art-1.jpg") },
      { id: "art-2", name: "Perfection.png", src: asset("/art-2.jpg") },
      { id: "art-3", name: "Mohamed Salah.png", src: asset("/art-3.jpg") },
      { id: "art-4", name: "Dragon Ball Z.png", src: asset("/art-4.jpg") },
      { id: "art-5", name: "Be Bold.png", src: asset("/art-5.jpg") },
      { id: "art-6", name: "Her Gaze.png", src: asset("/art-6.jpg") },
      { id: "art-7", name: "Gohan.png", src: asset("/art-7.jpg") },
      { id: "art-8", name: "Woggles — Winter Special.png", src: asset("/art-8.jpg") },
      { id: "art-9", name: "The Garden of Secrets.png", src: asset("/art-9.jpg") },
    ].map((c) => ({ ...c, kind: "file" as const, ext: "png" }));

    // the "agent AI" mockup — borrowed from the Assignments set
    const agentAi = assignmentFiles.find((f) => f.id === "asg-chatbot")!;

    const projects: Node[] = [
      { id: "projects", name: "Featured Projects", kind: "folder", color: "#0a84ff", icon: "featured", children: ["design-system", "focus-forge", "employee-portal", "youtube-redesign", "ask-ai", "carwaalah"].map((pid) => projFolder(byId(pid), pid === "design-system" ? dsFiles : [])) },
      { id: "artworks", name: "Artworks", kind: "folder", color: "#ff375f", icon: "artwork", children: artworkFiles },
      { id: "assignments", name: "Assignments", kind: "folder", color: "#ff9f0a", icon: "assignments", children: assignmentFiles },
      { id: "ai-products", name: "AI Products", kind: "folder", color: "#bf5af2", icon: "ai", children: [projFolder(byId("ask-ai")), agentAi] },
      { id: "design-systems", name: "Design Systems", kind: "folder", color: "#30d158", icon: "layers", children: [projFolder(byId("design-system"), dsFiles)] },
    ];

    return { about, projects };
  }, []);
}

/* ---------- icons -------------------------------------------------- */
/* macOS-style folder — the system light-blue, two-tone with a front flap */
/* the real macOS folder icon, extracted from the system */
function FolderIcon({ size = 46 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/folder.webp")} alt="" width={size} height={size} className="object-contain" draggable={false} style={{ width: size, height: size }} />
  );
}
function DocIcon({ ext = "", size = 44 }: { ext?: string; size?: number }) {
  const tint: Record<string, string> = { md: "#0a84ff", txt: "#30d158", json: "#ffcc00", ts: "#3178c6", fig: "#a259ff", pdf: "#ff453a", png: "#ff9f0a", mp4: "#ff375f", url: "#0a84ff", app: "#0a84ff" };
  const c = tint[ext] ?? "#8e8e93";
  return (
    <svg width={size} height={size} viewBox="0 0 44 56" aria-hidden>
      <path d="M6 4a3 3 0 0 1 3-3h20l9 9v42a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#fbfbfd" />
      <path d="M29 1l9 9h-6a3 3 0 0 1-3-3z" fill="#d0d0d5" />
      <rect x="6" y="40" width="32" height="14" rx="3" fill={c} />
      <text x="22" y="49.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>
        {ext.toUpperCase().slice(0, 4)}
      </text>
    </svg>
  );
}
function NodeIcon({ node, size = 46 }: { node: Node; size?: number }) {
  if (node.kind === "folder") return <FolderIcon size={size} />;
  if (node.kind === "image")
    return node.src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={node.src} alt="" loading="lazy" className="rounded-md object-cover ring-1 ring-white/10" style={{ width: size, height: size * 0.78 }} />
    ) : (
      <div className="rounded-md ring-1 ring-white/10" style={{ width: size, height: size * 0.78, background: node.color }} />
    );
  return <DocIcon ext={node.ext} size={size} />;
}

/* SF-Symbols-style monochrome line icons for the sidebar */
const SIDE_PATHS: Record<string, ReactNode> = {
  folder: (<path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />),
  // About-section distinct glyphs
  person: (<><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" /></>),
  briefcase: (<><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><path d="M3 12.5h18" /></>),
  intern: (<><path d="M12 4L2 9l10 5 10-5z" /><path d="M6 11.2V15c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8v-3.8" /><path d="M21 9v4" /></>),
  skills: (<><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4z" /><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>),
  certificate: (<><circle cx="12" cy="9.5" r="5.5" /><path d="M8.6 14l-1.6 6 5-2.8 5 2.8-1.6-6" /><path d="M9.7 9.5l1.8 1.8 3-3.4" /></>),
  interests: (<path d="M12 20s-6.8-4.2-6.8-9A3.8 3.8 0 0 1 12 8.2 3.8 3.8 0 0 1 18.8 11c0 4.8-6.8 9-6.8 9z" />),
  contact: (<><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M4 7.5l8 5.5 8-5.5" /></>),
  // Projects-section distinct glyphs
  featured: (<><rect x="4" y="4" width="7" height="7" rx="1.4" /><rect x="13" y="4" width="7" height="7" rx="1.4" /><rect x="4" y="13" width="7" height="7" rx="1.4" /><rect x="13" y="13" width="7" height="7" rx="1.4" /></>),
  assignments: (<><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><path d="M3 12.5h18" /></>),
  ai: (<><rect x="4.5" y="8" width="15" height="11" rx="3" /><path d="M12 8V4.6" /><circle cx="12" cy="3.4" r="1.2" /><circle cx="9.3" cy="13.5" r="1.15" fill="currentColor" /><circle cx="14.7" cy="13.5" r="1.15" fill="currentColor" /><path d="M2.6 12v3M21.4 12v3" /></>),
  layers: (<><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>),
  mobile: (<><rect x="7" y="3" width="10" height="18" rx="2.6" /><path d="M10.5 18.3h3" /></>),
  artwork: (<><circle cx="12" cy="12" r="9" /><circle cx="8.5" cy="9.5" r="1.1" fill="currentColor" /><circle cx="15.5" cy="9.5" r="1.1" fill="currentColor" /><circle cx="9" cy="15" r="1.1" fill="currentColor" /><path d="M12 21a3 3 0 0 0 3-3c0-1.4-1.2-1.7-1.2-2.7 0-.8.7-1.3 1.6-1.3H18a3 3 0 0 0 3-3" /></>),
};
function SideIcon({ icon, active }: { icon: string; active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-white" : "text-white/55"}
      aria-hidden
    >
      {SIDE_PATHS[icon] ?? SIDE_PATHS.folder}
    </svg>
  );
}

/* ---------- toolbar bits ------------------------------------------ */
function TrafficLights({ focused, onClose, onMin, onMax }: { focused: boolean; onClose: () => void; onMin: () => void; onMax: () => void }) {
  const dot = "flex h-3 w-3 items-center justify-center rounded-full ring-1 ring-black/20 active:brightness-90";
  const c = (col: string) => (focused ? col : "#4b4b4d");
  return (
    <div className="group/lights flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
      <button aria-label="Close" onClick={onClose} className={dot} style={{ background: c("#ff5f57") }} />
      <button aria-label="Minimize" onClick={onMin} className={dot} style={{ background: c("#febc2e") }} />
      <button aria-label="Zoom" onClick={onMax} className={dot} style={{ background: c("#28c840") }} />
    </div>
  );
}
const TBtn = ({ children, onClick, disabled, label }: { children: ReactNode; onClick?: () => void; disabled?: boolean; label: string }) => (
  <button
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    onPointerDown={(e) => e.stopPropagation()}
    className="flex h-7 w-7 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 disabled:opacity-30"
  >
    {children}
  </button>
);

export default function FinderApp({
  onClose,
  payload,
  onMinimize,
  onToggleMax,
  startDrag,
  focused = true,
}: AppProps) {
  const trees = useTree();
  const launch = useLaunch();
  const isMobile = useOS((s) => s.tier === "mobile");
  // On phones the sidebar is a slide-over drawer instead of a fixed column.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // resolve a deep-link payload → { section, root index }
  const locate = (pl: string | null | undefined) => {
    if (pl) {
      const pi = trees.projects.findIndex((r) => r.id === pl);
      if (pi >= 0) return { section: "projects" as Section, idx: pi };
      const ai = trees.about.findIndex((r) => r.id === pl);
      if (ai >= 0) return { section: "about" as Section, idx: ai };
    }
    return { section: "about" as Section, idx: 0 };
  };

  const init = locate(payload);
  const [section, setSection] = useState<Section>(init.section);
  const [rootIdx, setRootIdx] = useState(init.idx);
  const [history, setHistory] = useState<Node[][]>(() => [[trees[init.section][init.idx]]]);
  const [hi, setHi] = useState(0);
  const [view, setView] = useState<View>("grid");
  const [look, setLook] = useState<Node | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const roots = trees[section];

  // re-sync when the deep-link payload changes (switching About ↔ Projects)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const { section: sec, idx } = locate(payload);
    setSection(sec);
    setRootIdx(idx);
    setHistory([[trees[sec][idx]]]);
    setHi(0);
    setSelected(null);
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  // Esc closes the Quick-Look overlay
  useEffect(() => {
    if (!look) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLook(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [look]);

  // each folder opens in its preferred view; the toolbar toggle then controls it
  useEffect(() => {
    const cur = history[hi]?.[history[hi].length - 1];
    if (cur) setView(cur.view ?? "grid");
  }, [hi, history]);

  const share = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1900);
  };

  const path = history[hi];
  const current = path[path.length - 1];
  const effView = view;

  const go = (nextPath: Node[]) => {
    const trimmed = history.slice(0, hi + 1);
    setHistory([...trimmed, nextPath]);
    setHi(trimmed.length);
    setSelected(null);
    setQuery("");
  };
  const openRoot = (i: number) => {
    setRootIdx(i);
    go([roots[i]]);
    setSidebarOpen(false); // close the mobile drawer after picking a section
  };
  const open = (node: Node, el?: HTMLElement | null) => {
    if (node.kind === "folder") go([...path, node]);
    else if (node.caseStudy) {
      // Case Study.md → open the Projects app on this case study (same window as the featured card)
      const name = PROJECTS.find((p) => p.id === node.caseStudy)?.name ?? "Case Study";
      launch("projects", el ?? null, { context: `Viewing ${name}`, payload: node.caseStudy });
    } else if (node.src) {
      // image → open a real, draggable preview window (a few large mockups get zoom controls)
      const zoom =
        ["asg-astro", "asg-campo", "asg-chatbot", "ds-variables"].includes(node.id) ||
        node.id.startsWith("asgn-"); // the detailed UI mockups / screenshots are zoomable
      launch("preview", el ?? null, { context: node.name, payload: JSON.stringify({ src: node.src, name: node.name, zoom, rate: node.rate }) });
    } else if (node.mail) {
      // Touch devices open their signed-in default mail app (mailto:); desktops
      // open Gmail web compose in the already-logged-in session — no login step.
      const { to, subject, body } = node.mail;
      const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
      if (touch) {
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else {
        const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmail, "_blank", "noopener,noreferrer");
      }
    } else if (node.kind === "link") window.open(node.href, "_blank", "noopener,noreferrer");
    else setLook(node); // text file → Quick Look
  };
  const back = () => hi > 0 && (setHi(hi - 1), setSelected(null));
  const forward = () => hi < history.length - 1 && (setHi(hi + 1), setSelected(null));

  const items = (current.children ?? []).filter((n) =>
    query ? n.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  const sidebarNav = (
    <nav className="space-y-px">
      {roots.map((r, i) => {
        const active = rootIdx === i && path.length === 1 && current.id === r.id;
        return (
          <button
            key={r.id}
            onClick={() => openRoot(i)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] transition ${active ? "text-white" : "text-white/90 hover:bg-white/5"}`}
            style={active ? { background: ACCENT } : undefined}
          >
            <span className="shrink-0"><SideIcon icon={r.icon ?? "folder"} active={active} /></span>
            <span className="truncate">{r.name}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="relative flex h-full w-full flex-col bg-[#141414] text-white" style={{ fontFamily: "var(--font-sans)" }}>
      {/* unified toolbar — drag handle */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={onToggleMax}
        className="flex h-[52px] shrink-0 cursor-default select-none items-center gap-3 border-b px-4"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "#1c1c1e" }}
      >
        <TrafficLights focused={focused} onClose={onClose} onMin={onMinimize ?? onClose} onMax={onToggleMax ?? (() => {})} />

        {isMobile && (
          <TBtn label="Toggle sidebar" onClick={() => setSidebarOpen((v) => !v)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </TBtn>
        )}

        <div className="ml-2 flex items-center gap-1">
          <TBtn label="Back" onClick={back} disabled={hi === 0}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </TBtn>
          <TBtn label="Forward" onClick={forward} disabled={hi >= history.length - 1}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </TBtn>
        </div>

        {/* breadcrumb title */}
        <div className="ml-1 min-w-0 flex items-center gap-1.5 text-[15px] font-semibold">
          {path.map((n, i) => (
            <span key={n.id} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <span className="text-white/30">›</span>}
              <button
                onClick={() => { setHi(hi); go(path.slice(0, i + 1)); }}
                onPointerDown={(e) => e.stopPropagation()}
                className={`truncate ${i === path.length - 1 ? "text-white" : "text-white/55 hover:text-white/80"}`}
              >
                {n.name}
              </button>
            </span>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          {/* view segmented control */}
          <div className="flex items-center rounded-md bg-white/8 p-0.5">
            {([
              ["grid", <path key="g" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />],
              ["list", <path key="l" d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" stroke="currentColor" />],
              ["gallery", <path key="a" d="M4 5h16v11H4zM8 19h8" strokeWidth="2" stroke="currentColor" fill="none" />],
            ] as const).map(([v, icon]) => (
              <button
                key={v}
                aria-label={`${v} view`}
                onClick={() => setView(v)}
                className={`flex h-7 w-8 items-center justify-center rounded-[5px] ${effView === v ? "bg-white/15 text-white" : "text-white/55 hover:text-white/80"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={v === "grid" ? "currentColor" : "none"}>{icon}</svg>
              </button>
            ))}
          </div>

          {/* share — copies the portfolio link (icon-only on mobile to save room) */}
          <button
            aria-label="Copy portfolio link"
            onClick={share}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white/8 px-2.5 text-white/50 transition hover:text-white/80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></svg>
            {!isMobile && <span className="text-[13px] font-normal text-white/40">Share</span>}
          </button>

          {/* search — hidden on mobile (folders are short; frees toolbar space) */}
          {!isMobile && (
            <div className="flex h-8 items-center gap-1.5 rounded-md bg-white/8 px-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-24 bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* body */}
      <div className="relative flex min-h-0 flex-1">
        {/* sidebar — fixed column on desktop; slide-over drawer on mobile */}
        {isMobile ? (
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="absolute inset-0 z-30 bg-black/50"
                />
                <motion.aside
                  key="drawer"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={spring.soft}
                  className="absolute inset-y-0 left-0 z-40 w-[250px] max-w-[80%] overflow-y-auto border-r px-2.5 py-3"
                  style={{ borderColor: "rgba(255,255,255,0.08)", background: "#1c1c1e" }}
                >
                  {sidebarNav}
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        ) : (
          <aside className="w-[230px] shrink-0 overflow-y-auto border-r px-2.5 py-3" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#1c1c1e" }}>
            {sidebarNav}
          </aside>
        )}

        {/* content */}
        <main className="min-h-0 flex-1 overflow-y-auto" style={{ background: "#141414" }}>
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-white/35">
              {query ? "No matches" : "Empty folder"}
            </div>
          ) : effView === "grid" ? (
            <div className={`grid ${isMobile ? "grid-cols-3 gap-x-2 gap-y-5 p-4" : "grid-cols-5 gap-x-3 gap-y-7 p-6"}`}>
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => (isMobile ? open(n, undefined) : setSelected(n.id))}
                  onDoubleClick={(e) => open(n, e.currentTarget)}
                  className={`group flex flex-col items-center gap-2 rounded-lg p-2 ${selected === n.id ? "bg-white/10" : "hover:bg-white/[0.04]"}`}
                >
                  <NodeIcon node={n} size={isMobile ? 54 : 78} />
                  <span className={`${isMobile ? "max-w-[96px]" : "max-w-[128px]"} truncate rounded px-1.5 text-[13px] leading-tight ${selected === n.id ? "bg-[#ff9f0a] text-white" : "text-white/85"}`}>{n.name}</span>
                </button>
              ))}
            </div>
          ) : effView === "list" ? (
            <div className="px-3 py-2">
              <div className={`grid ${isMobile ? "grid-cols-[1fr]" : "grid-cols-[1fr_140px_90px]"} gap-2 border-b px-3 pb-1.5 text-[11px] font-medium text-white/40`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <span>Name</span>
                {!isMobile && <><span>Date Modified</span><span>Kind</span></>}
              </div>
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => (isMobile ? open(n, undefined) : setSelected(n.id))}
                  onDoubleClick={(e) => open(n, e.currentTarget)}
                  className={`grid w-full ${isMobile ? "grid-cols-[1fr]" : "grid-cols-[1fr_140px_90px]"} items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] ${selected === n.id ? "bg-[#ff9f0a] text-white" : "text-white/85 hover:bg-white/5"}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5"><NodeIcon node={n} size={20} /><span className="truncate">{n.name}</span></span>
                  {!isMobile && <>
                    <span className={selected === n.id ? "text-white/80" : "text-white/45"}>{n.modified ?? "—"}</span>
                    <span className={selected === n.id ? "text-white/80" : "text-white/45"}>{n.kind === "folder" ? "Folder" : n.kind === "image" ? "Image" : (n.ext ?? "Doc").toUpperCase()}</span>
                  </>}
                </button>
              ))}
            </div>
          ) : (
            /* gallery */
            <Gallery items={items} onOpen={open} isMobile={isMobile} folderPreviews />
          )}
        </main>
      </div>

      {/* Quick Look modal */}
      <AnimatePresence>
        {look && <QuickLook node={look} onClose={() => setLook(null)} />}
      </AnimatePresence>

      {/* copy-link toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#2d2d33]/95 px-4 py-2 text-[13px] font-medium text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            Portfolio link copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FolderGalleryPreview({ folder }: { folder: Node }) {
  const children = folder.children ?? [];
  const previews = children.slice(0, 4);
  const firstImage = children.find((child) => child.src);

  // Keep the folder's first items in order, but ensure its cover artwork is
  // represented when a longer folder would otherwise push it out of view.
  if (firstImage && !previews.includes(firstImage)) {
    previews[Math.min(3, previews.length)] = firstImage;
  }

  return (
    <div
      className={`grid h-[78%] w-[78%] max-w-[440px] grid-cols-2 gap-3 ${previews.length > 2 ? "grid-rows-2" : "grid-rows-1"}`}
    >
      {previews.map((child) => (
        <div
          key={child.id}
          className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15"
        >
          {child.src && !/\.(mp4|webm|mov|m4v)$/i.test(child.src) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={child.src} alt={child.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 px-2 text-center">
              <NodeIcon node={child} size={48} />
              <span className="max-w-full truncate text-[11px] font-medium text-white/70">{child.name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FileGalleryPreview({ file }: { file: Node }) {
  return (
    <div className="flex h-[84%] w-[82%] max-w-[440px] flex-col overflow-hidden rounded-xl bg-[#1c1c1e] shadow-[0_16px_44px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <NodeIcon node={file} size={20} />
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-white/80">{file.name}</span>
        <span className="text-[10px] uppercase text-white/35">{file.ext ?? file.kind}</span>
      </div>
      {file.preview ? (
        <div className="min-h-0 flex-1 overflow-hidden p-5 text-left">
          <div className="origin-top-left scale-[0.82] [width:122%]">{file.preview}</div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
          <NodeIcon node={file} size={82} />
          <div>
            <p className="text-[13px] font-semibold text-white/80">{file.name}</p>
            <p className="mt-1 text-[11px] text-white/40">
              {(file.ext ?? file.kind).toUpperCase()}{file.modified ? ` · ${file.modified}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Gallery({
  items,
  onOpen,
  isMobile = false,
  folderPreviews = false,
}: {
  items: Node[];
  onOpen: (n: Node) => void;
  isMobile?: boolean;
  folderPreviews?: boolean;
}) {
  const [sel, setSel] = useState(0);
  const hero = items[Math.min(sel, items.length - 1)];
  return (
    <div className={`flex h-full min-h-0 ${isMobile ? "flex-col" : ""}`}>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
        <div
          className="flex max-h-[70%] w-full max-w-[520px] flex-1 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10"
          style={{ background: hero.kind === "image" && !hero.src ? hero.color : "#2a2a2c" }}
          onClick={() => isMobile && onOpen(hero)}
          onDoubleClick={() => onOpen(hero)}
        >
          {hero.src ?
            (/\.(mp4|webm|mov|m4v)$/i.test(hero.src) ? (
              <video src={hero.src} controls playsInline className="max-h-full max-w-full rounded-lg" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.src} alt="" className="max-h-full max-w-full object-contain" />
            )) : folderPreviews && hero.kind === "folder" ? (
              <FolderGalleryPreview folder={hero} />
            ) : hero.kind === "file" || hero.kind === "link" ? (
              <FileGalleryPreview file={hero} />
            ) : null}
        </div>
        <p className="text-[13px] font-medium text-white/85">{hero.name}</p>
      </div>
      {/* filmstrip — side rail on desktop, horizontal strip on mobile */}
      <div
        className={
          isMobile
            ? "flex shrink-0 gap-2 overflow-x-auto border-t p-2"
            : "w-[220px] shrink-0 overflow-y-auto border-l p-2"
        }
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {items.map((n, i) => (
          <button
            key={n.id}
            onClick={() => setSel(i)}
            onDoubleClick={() => onOpen(n)}
            className={`flex items-center gap-2.5 rounded-md p-1.5 text-left text-[12px] ${isMobile ? "w-[120px] shrink-0" : "w-full"} ${i === sel ? "bg-[#ff9f0a] text-white" : "text-white/85 hover:bg-white/5"}`}
          >
            <NodeIcon node={n} size={26} />
            <span className="truncate">{n.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickLook({ node, onClose }: { node: Node; onClose: () => void }) {
  const isImage = !!node.src; // images get a larger window
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      className={`absolute inset-0 z-40 flex items-center justify-center bg-black/50 ${isImage ? "p-2" : "p-8"}`}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 460, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden rounded-xl bg-[#242426] shadow-[0_20px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/10 ${isImage ? "h-full max-w-[980px]" : "max-h-full max-w-[560px]"}`}
      >
        <div className="flex h-10 shrink-0 items-center gap-3 border-b px-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button onClick={onClose} aria-label="Close" className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/20" />
          <span className="truncate text-[13px] font-semibold text-white/80">{node.name}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {node.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={node.src} alt={node.name} className="w-full rounded-lg object-contain ring-1 ring-white/10" />
          ) : node.kind === "image" ? (
            <div className="aspect-[4/3] w-full rounded-lg ring-1 ring-white/10" style={{ background: node.color }} />
          ) : node.preview ? (
            node.preview
          ) : (
            <p className="text-sm text-white/45">No preview available for {node.name}.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

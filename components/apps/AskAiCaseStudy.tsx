"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate } from "framer-motion";
import SmoothScroll from "@/components/os/SmoothScroll";
import BackToTop from "@/components/os/BackToTop";

/* ------------------------------------------------------------------ */
/*  Ask.ai — Turning Curiosity Into a Habit.                          */
/*  Premium AI-product case study. Golden / amber theme, 85% visual.       */
/* ------------------------------------------------------------------ */

const BG = "#141416";
const SURF = "#1c1c1e";
const CARD = "#232326";
const PRI = "#F5B50A";
const ACC = "#FFD166";
const SUB = "#9a9aa2";
const BORD = "rgba(255,255,255,0.08)";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- primitives ---------- */
function Reveal({ children, y = 26, delay = 0, className = "" }: { children: ReactNode; y?: number; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.5, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{Math.round(v)}{suffix}</span>;
}

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="text-[13px] font-bold tracking-[0.25em]" style={{ color: ACC }}>{n}</span>
      <span className="h-px w-8" style={{ background: PRI }} />
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: SUB }}>{label}</span>
    </div>
  );
}

const Section = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <section className={`px-6 py-16 sm:px-12 sm:py-24 lg:px-20 ${className}`} style={style}>{children}</section>
);

/* ---------- mock helpers ---------- */
function Dot() {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />;
}
function Trend({ up = true }: { up?: boolean }) {
  const pts = up ? "0,34 16,28 30,30 45,20 60,22 75,12 90,15 105,6 120,8" : "0,8 16,12 30,10 45,18 60,16 75,24 90,22 105,30 120,32";
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={up ? PRI : "#ff6b6b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
/* skeleton line used inside mock screens */
function Sk({ w = "100%", h = 8 }: { w?: string; h?: number }) {
  return <span className="block rounded-full" style={{ width: w, height: h, background: "rgba(255,255,255,0.07)" }} />;
}
function Screen({ title, children, phone = false }: { title: string; children: ReactNode; phone?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl ring-1 ${phone ? "" : ""}`} style={{ background: CARD, borderColor: BORD }}>
      <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: BORD }}>
        <span className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-black" style={{ background: PRI, color: BG }}>A</span>
        <span className="text-[11px] font-semibold text-white/80">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

/* ---------- data ---------- */
const OVERVIEW = [
  { t: "Make Asking Easy", d: "Simplify the question input experience for everyone." },
  { t: "Encourage Curiosity", d: "Surface examples and topics that spark exploration." },
  { t: "Smart & Useful Answers", d: "Accurate, contextual, easy-to-understand responses." },
  { t: "Habit-Forming Experience", d: "Create a flow that brings users back every day." },
];

const RESEARCH = [
  { v: "12+", l: "User Interviews", d: "active and inactive users" },
  { v: "40", l: "Survey Responses", d: "behaviors & pain points" },
  { v: "3", l: "Usability Tests", d: "across key user flows" },
  { v: "4", l: "Competitor Reviews", d: "leading AI platforms" },
];
const INSIGHTS = [
  "Users want accurate answers — and transparency.",
  "Many users don't know what to ask.",
  "Answers are hard to revisit or save.",
  "No learning habit exists after the first query.",
];

const CHALLENGES = [
  { t: "High Cognitive Load", d: "Too much information and complex UI." },
  { t: "Low Trust in AI", d: "Users unsure if answers are accurate." },
  { t: "Low Retention", d: "No clear reason to come back." },
  { t: "Poor Discoverability", d: "Hard to know what's possible." },
];

const DECISIONS = [
  { t: "Ask Anything, Anytime", d: "Prominent input to reduce friction." },
  { t: "Answers in Layers", d: "Short summary first, detail on demand." },
  { t: "Source-backed Responses", d: "Citations to improve credibility." },
  { t: "Collections", d: "Bookmark answers, build knowledge." },
  { t: "Learning Streaks", d: "Daily motivation that forms habit." },
  { t: "Feedback Loop", d: "Users rate answers, the AI improves." },
];

const ENGINE = ["Questions", "Interest Detection", "Topic Clustering", "Learning Profile", "Personalized Suggestions", "Habit Loop"];

const RESULTS = [
  { v: 42, p: "+", s: "%", l: "Daily Active Users", up: true },
  { v: 37, p: "+", s: "%", l: "Query Completion Rate", up: true },
  { v: 28, p: "−", s: "%", l: "Drop-off Rate", up: false },
  { v: 58, p: "+", s: "%", l: "User Retention (D7)", up: true },
];


const A11Y = [
  { t: "AA Contrast", d: "Meets WCAG 2.1 AA." },
  { t: "Keyboard Navigation", d: "Fully navigable by keyboard." },
  { t: "Readable Text", d: "Optimized line height & sizes." },
  { t: "Focus States", d: "Clear focus for interactive elements." },
  { t: "Reduced Motion", d: "Respects motion preferences." },
  { t: "Screen Reader Support", d: "Semantic structure and ARIA." },
];

const TESTIMONIALS = [
  { q: "Ask.ai has become my daily learning companion. The answers are accurate and easy to understand.", n: "Sneha R.", r: "Student" },
  { q: "It saves me hours of research every week. The sources and summaries are perfect.", n: "Arjun K.", r: "Researcher" },
  { q: "The habit tracking keeps me motivated to learn something new daily.", n: "Meera P.", r: "Marketing Manager" },
];

const TIMELINE = [
  { w: "Week 1", t: "Discover", items: ["Market research", "User interviews", "Competitor analysis"] },
  { w: "Week 2", t: "Define", items: ["Personas", "Journey mapping", "Opportunity areas"] },
  { w: "Week 3", t: "Design", items: ["Wireframes", "UI exploration", "Iteration"] },
  { w: "Week 4", t: "Deliver", items: ["Hi-fi design", "Usability testing", "Handoff"] },
];

const LEARNINGS = [
  { t: "Curiosity Is Universal", d: "Designing for curiosity opens the door to continuous learning." },
  { t: "Trust Drives Adoption", d: "Clear answers, sources and transparency build trust." },
  { t: "Small Habits Create Retention", d: "Daily engagement features encourage long-term retention." },
  { t: "Context Matters", d: "Understanding intent yields more helpful answers." },
  { t: "Simplicity Scales", d: "A clean, simple experience is easier to adopt." },
  { t: "Iterate With Purpose", d: "Testing early and often refines the right solution." },
];


/* ================================================================== */
export default function AskAiCaseStudy({ onBack: _onBack }: { onBack: () => void }) {
  return (
    <motion.div
      layoutId="proj-ask-ai"
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ background: BG, color: "#fff", fontFamily: "var(--font-sans)" }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <SmoothScroll>
        {/* ============ 01 HERO ============ */}
        <section className="relative flex min-h-[86vh] flex-col justify-center px-6 py-24 sm:px-12 lg:px-20">
          <div className="relative max-w-4xl">
            <Reveal>
              <h1 className="text-[42px] font-extrabold leading-[1.03] tracking-tight sm:text-[62px] lg:text-[78px]">
                Ask<span style={{ color: "#fff" }}>.ai</span> — Turning Curiosity Into a <span style={{ color: PRI }}>Habit</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed" style={{ color: SUB }}>
                An AI-powered learning companion that transforms one-off questions into a daily learning habit — building curiosity, trust and retention.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
                {[["Role", "UX Designer"], ["Duration", "6 Weeks"], ["Platform", "Web + Mobile"], ["Focus", "Conversational AI"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                    <p className="mt-1.5 text-[16px] font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 PROJECT OVERVIEW ============ */}
        <Section>
          <Reveal><Kicker n="02" label="Project Overview & Objectives" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW.map((o, i) => (
              <Reveal key={o.t} delay={i * 0.07}>
                <div className="h-full rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-black" style={{ background: "rgba(245,181,10,0.14)", color: ACC }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-5 text-[17px] font-bold">{o.t}</p>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: SUB }}>{o.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 03 PROBLEM ============ */}
        <Section>
          <Reveal><Kicker n="03" label="Problem Statement" /></Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="flex flex-col gap-2.5">
                {["Ask Question", "Get Answer", "Leave Product"].map((s, i) => (
                  <div key={s} className="flex flex-col items-center">
                    <div className="flex w-full items-center justify-between rounded-xl px-5 py-3.5" style={{ background: CARD, border: `1px solid ${i === 2 ? "rgba(255,80,80,0.3)" : BORD}` }}>
                      <span className="text-[15px] font-semibold">{s}</span>
                      {i === 2 && <span className="text-[11px] font-bold" style={{ color: "#ff6b6b" }}>drop-off</span>}
                    </div>
                    {i < 2 && <span className="py-1 text-[13px]" style={{ color: SUB }}>↓</span>}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl p-8 sm:p-10" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <span className="text-5xl font-black" style={{ color: PRI }}>&ldquo;</span>
                <p className="text-[24px] font-bold leading-snug sm:text-[30px]">I only use AI when I need something urgently. There&apos;s no reason to return.</p>
                <p className="mt-5 text-[13px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>— Research participant</p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 04 RESEARCH ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="04" label="UX Research Insights" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH.map((r, i) => (
              <Reveal key={r.l} delay={i * 0.06}>
                <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <p className="text-[32px] font-black leading-none" style={{ color: ACC }}>{r.v}</p>
                  <p className="mt-3 text-[14px] font-semibold">{r.l}</p>
                  <p className="mt-1 text-[12px]" style={{ color: SUB }}>{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div className="h-full rounded-3xl p-7" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: ACC }}>Key Insights</p>
                <ul className="space-y-3">
                  {INSIGHTS.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-[14px]"><span className="mt-0.5" style={{ color: PRI }}>✓</span><span style={{ color: "#e7f5ee" }}>{s}</span></li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {/* persona */}
              <div className="h-full rounded-3xl p-7" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-[18px] font-black" style={{ background: PRI, color: BG }}>A</span>
                  <div>
                    <p className="text-[20px] font-bold">Arjun, 24</p>
                    <p className="text-[13px]" style={{ color: SUB }}>Student &amp; Creator</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: ACC }}>Goals</p>
                    <ul className="space-y-1.5 text-[13px]">{["Learn faster", "Save useful info", "Build knowledge"].map((g) => <li key={g} className="flex gap-2"><span style={{ color: PRI }}>·</span>{g}</li>)}</ul>
                  </div>
                  <div>
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#ff8f8f" }}>Frustrations</p>
                    <ul className="space-y-1.5 text-[13px]" style={{ color: SUB }}>{["Info overload", "No retention", "Weak trust"].map((g) => <li key={g} className="flex gap-2"><span style={{ color: "#ff8f8f" }}>·</span>{g}</li>)}</ul>
                  </div>
                </div>
                <div className="mt-5 rounded-xl px-4 py-3 text-[13px] italic" style={{ background: "rgba(245,181,10,0.08)", color: "#e7f5ee" }}>&ldquo;I just want quick, clear answers I can use and trust.&rdquo;</div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 05 DESIGN CHALLENGES ============ */}
        <Section>
          <Reveal><Kicker n="05" label="Design Challenges" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHALLENGES.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.07}>
                <motion.div whileHover={{ y: -6 }} className="h-full rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="text-[13px]" style={{ color: "#ff8f8f" }}>▲ challenge</span>
                  <p className="mt-2 text-[17px] font-bold">{c.t}</p>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: SUB }}>{c.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 06 KEY UX DECISIONS ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="06" label="Key UI / UX Decisions" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.t} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-black" style={{ background: "rgba(245,181,10,0.14)", color: ACC }}>{i + 1}</span>
                    <p className="text-[15px] font-bold">{d.t}</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed" style={{ color: SUB }}>{d.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-6">
            <div className="rounded-3xl p-7" style={{ background: "rgba(245,181,10,0.07)", border: `1px solid ${BORD}` }}>
              <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: ACC }}>What&apos;s Different?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Conversational + search combined experience", "Personalized discovery based on behavior", "Learning-path suggestions to build habit", "Focus on trust, clarity and long-term value"].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-[14px] text-white"><span style={{ color: PRI }}>✓</span>{t}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ============ 07 PRODUCT END TO END ============ */}
        <Section>
          <Reveal><Kicker n="07" label="The Product, End to End" /></Reveal>
          <Reveal delay={0.05}><p className="mb-10 max-w-2xl text-[18px]" style={{ color: SUB }}>From asking a question to building a habit — a seamless journey.</p></Reveal>
          <div className="space-y-6">
            {[
              { n: "1", t: "Ask", d: "Types or speaks any question.", cards: ["Ask anything…", "What is photosynthesis?", "Thinking…", "Photosynthesis is the process…"] },
              { n: "2", t: "Understand", d: "Clear, structured answers with sources.", cards: ["Answer + Sources", "Key Points", "Related topics", "Saved to Biology Notes"] },
              { n: "3", t: "Retain & Revisit", d: "Save, organize and revisit anytime.", cards: ["Collections", "History", "Daily habit 🔥", "Streak · 12 Days"] },
            ].map((row, ri) => (
              <Reveal key={row.t} delay={ri * 0.08}>
                <div className="grid gap-4 lg:grid-cols-[190px_1fr] lg:items-center">
                  <div>
                    <span className="text-[13px] font-bold" style={{ color: ACC }}>{row.n}. {row.t}</span>
                    <p className="mt-1 text-[13px]" style={{ color: SUB }}>{row.d}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {row.cards.map((c, i) => (
                      <div key={c} className="flex items-center gap-2">
                        <div className={`flex min-w-[120px] items-center rounded-xl px-3 py-3 text-[12px] font-medium ${i === 2 && ri === 2 ? "" : ""}`} style={{ background: i === 2 && ri === 2 ? "rgba(255,159,10,0.16)" : CARD, border: `1px solid ${BORD}`, color: i === 2 && ri === 2 ? "#ffd166" : "#e7f5ee" }}>
                          {c}
                        </div>
                        {i < row.cards.length - 1 && <span style={{ color: SUB }}>→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 08 IMPACT ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="08" label="Impact & Expected Outcomes" /></Reveal>
          <Reveal delay={0.05}><p className="mb-8 text-[15px]" style={{ color: SUB }}>Measured impact after launch (3 months).</p></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESULTS.map((m, i) => (
              <Reveal key={m.l} delay={i * 0.07}>
                <div className="rounded-3xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <p className="text-[11px]" style={{ color: SUB }}>{m.l}</p>
                  <p className="mt-1 text-[38px] font-black leading-none" style={{ color: m.up ? ACC : "#ff8f8f" }}><Counter to={m.v} prefix={m.p} suffix={m.s} /></p>
                  <div className="mt-3"><Trend up={m.up} /></div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 09 FINAL SOLUTION ============ */}
        <Section className="relative overflow-hidden">
          <Reveal><Kicker n="09" label="Final Solution & Key Takeaways" /></Reveal>
          <div className="grid gap-4">
            {[
              "The new experience turns first-time curiosity into long-term engagement.",
              "Clear answers, trust signals and personalization drive habit formation.",
              "Simplicity, transparency and consistency are key to user retention.",
              "Continuous feedback helps the product get smarter every day.",
            ].map((t, i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="mt-0.5 text-[16px]" style={{ color: PRI }}>◎</span>
                  <span className="text-[15px]" style={{ color: "#e7f5ee" }}>{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 10 PERSONALIZATION ENGINE ============ */}
        <Section>
          <Reveal><Kicker n="10" label="Personalization Engine" /></Reveal>
          <div className="flex flex-col items-center gap-0">
            {ENGINE.map((node, i) => (
              <Reveal key={node} delay={i * 0.07} className="flex w-full max-w-md flex-col items-center">
                <div className="w-full rounded-2xl px-6 py-4 text-center text-[16px] font-semibold" style={{ background: i === ENGINE.length - 1 ? PRI : SURF, border: `1px solid ${BORD}`, color: i === ENGINE.length - 1 ? BG : "#fff" }}>
                  {node}
                </div>
                {i < ENGINE.length - 1 && <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} className="h-6 w-px origin-top" style={{ background: PRI }} />}
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 11 FINAL UI SHOWCASE ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="11" label="Final UI Showcase" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {["/askai-ui-1.jpg", "/askai-ui-2.jpg", "/askai-ui-3.jpg", "/askai-ui-4.jpg", "/askai-ui-5.jpg"].map((src, i) => (
              <Reveal key={src} delay={(i % 2) * 0.06} className={i === 0 ? "sm:col-span-2" : ""}>
                <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ background: CARD }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Ask.ai final UI ${i + 1}`} loading="lazy" className="block h-auto w-full" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 12 DESIGN SYSTEM ============ */}
        <Section>
          <Reveal><Kicker n="12" label="Design System" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Colors</p>
                <div className="flex flex-wrap gap-3">
                  {[["Yellow", "#FFD400"], ["Ink", "#141414"], ["Surface", "#F2F2F2"], ["White", "#FFFFFF"], ["Muted", "#9AA0A6"]].map(([n, c]) => (
                    <div key={n} className="flex flex-col items-center gap-1.5">
                      <span className="h-11 w-11 rounded-xl" style={{ background: c as string, border: `1px solid ${BORD}` }} />
                      <span className="text-[10px]" style={{ color: SUB }}>{n}</span>
                      <span className="text-[9px] tabular-nums" style={{ color: "#5f5f66" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Typography · Poppins</p>
                <p className="text-[30px] font-black leading-none" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>Aa</p>
                <p className="mt-3 text-[22px] font-bold" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>Section Title</p>
                <p className="mt-1 text-[15px]" style={{ color: SUB, fontFamily: "'Poppins', var(--font-sans)" }}>Body — geometric, friendly, legible.</p>
                <p className="mt-2 text-[12px]" style={{ color: SUB }}>Regular · Medium · SemiBold · Bold</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Components</p>
                {/* rendered on the product's light surface for fidelity */}
                <div className="space-y-3 rounded-2xl bg-white p-4" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>
                  <span className="block rounded-xl px-4 py-2.5 text-center text-[13px] font-semibold text-black" style={{ background: "#FFD400" }}>Ask ChatGPT ▾</span>
                  <div className="flex items-center gap-2.5 text-[13px] text-neutral-800">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2" style={{ borderColor: "#FFD400" }}><span className="h-2 w-2 rounded-full" style={{ background: "#FFD400" }} /></span>
                    Direct Bank Transfer
                  </div>
                  <div className="rounded-lg border border-neutral-200 px-3 py-2 text-[12px] text-neutral-400">Ask me anything…</div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 13 ACCESSIBILITY ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="13" label="Accessibility" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {A11Y.map((a, i) => (
              <Reveal key={a.t} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[14px]" style={{ background: "rgba(245,181,10,0.14)", color: ACC }}>✓</span>
                  <p className="mt-4 text-[15px] font-bold">{a.t}</p>
                  <p className="mt-1.5 text-[13px]" style={{ color: SUB }}>{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 14 TESTIMONIALS ============ */}
        <Section>
          <Reveal><Kicker n="14" label="User Testimonials" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="flex-1 text-[15px] leading-relaxed text-white">&ldquo;{t.q}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold" style={{ background: PRI, color: BG }}>{t.n[0]}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-white">{t.n}</p>
                      <p className="text-[12px]" style={{ color: SUB }}>{t.r}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 16 TIMELINE ============ */}
        <Section>
          <Reveal><Kicker n="16" label="Design Process & Timeline" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((w, i) => (
              <Reveal key={w.w} delay={i * 0.08}>
                <div className="h-full rounded-2xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: SUB }}>{w.w}</p>
                  <p className="mt-1 text-[20px] font-bold" style={{ color: ACC }}>{w.t}</p>
                  <ul className="mt-4 space-y-1.5">{w.items.map((it) => <li key={it} className="flex items-center gap-2 text-[13px]" style={{ color: "#e7f5ee" }}><span style={{ color: PRI }}>·</span>{it}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-4">
            <div className="flex items-center gap-3 rounded-2xl px-6 py-4" style={{ background: "rgba(245,181,10,0.1)", border: `1px solid ${BORD}` }}>
              <span className="text-[20px]">🚀</span>
              <p className="text-[15px] font-bold" style={{ color: ACC }}>Outcome — Launch Ready</p>
            </div>
          </Reveal>
        </Section>

        {/* ============ 17 LEARNINGS ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="17" label="Key Learnings & Reflections" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNINGS.map((l, i) => (
              <Reveal key={l.t} delay={(i % 3) * 0.06}>
                <div className="flex h-full flex-col rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[15px] font-black" style={{ background: "rgba(245,181,10,0.14)", color: ACC }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-4 text-[16px] font-bold">{l.t}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: SUB }}>{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <BackToTop accent={PRI} />
      </SmoothScroll>
    </motion.div>
  );
}

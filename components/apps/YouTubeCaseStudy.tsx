"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate } from "framer-motion";
import SmoothScroll from "@/components/os/SmoothScroll";
import BackToTop from "@/components/os/BackToTop";

/* ------------------------------------------------------------------ */
/*  Reimagining the YouTube Home Experience — premium case study page. */
/*  Dark, editorial, motion-driven. Tokens per the design brief.        */
/* ------------------------------------------------------------------ */

const BG = "#141416";
const SURF = "#1c1c1e";
const BORD = "rgba(255,255,255,0.08)";
const RED = "#FF3B30";
const RED2 = "#FF6B60";
const SUB = "#9a9aa2";
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
    <div className="mb-6 flex items-center gap-3">
      <span className="text-[13px] font-bold tracking-[0.25em]" style={{ color: RED2 }}>{n}</span>
      <span className="h-px w-8" style={{ background: RED }} />
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: SUB }}>{label}</span>
    </div>
  );
}

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`px-6 py-16 sm:px-12 sm:py-24 lg:px-20 ${className}`}>{children}</section>
);

/* ---------- data ---------- */
const PAIN = [
  ["Too many recommendations", 86],
  ["Content overload", 79],
  ["Poor category discovery", 72],
  ["Repeated suggestions", 68],
  ["Weak personalization", 61],
] as const;

const FUNNEL = [
  ["Homepage Visit", 100],
  ["Browse", 84],
  ["Scroll", 53],
  ["Click", 37],
  ["Watch", 29],
] as const;

const BEFORE_AFTER = [
  { t: "Homepage", before: ["Cluttered", "Endless feed", "Weak hierarchy"], after: ["Personalized modules", "Better scanning", "Clear organization"], impact: "+35% discovery speed" },
  { t: "Recommendations", before: ["Generic feed"], after: ["Interest-based feed"], impact: "+28% watch intent" },
  { t: "Navigation", before: ["Overloaded sidebar"], after: ["Focused navigation"], impact: "-42% decision fatigue" },
  { t: "Categories", before: ["Static categories"], after: ["Dynamic interests"], impact: "+31% exploration" },
];

const ENGINE = ["Watch History", "Interest Detection", "AI Clustering", "Content Understanding", "Personalized Feed"];
const FLOW = ["Home", "Browse", "Scroll", "Select", "Watch", "Engage", "Personalized"];

const RESULTS = [
  { v: 35, s: "%", p: "+", l: "Discovery Speed" },
  { v: 28, s: "%", p: "+", l: "Watch Intent" },
  { v: 24, s: "%", p: "+", l: "Homepage Engagement" },
  { v: 42, s: "%", p: "-", l: "Decision Fatigue" },
  { v: 31, s: "%", p: "+", l: "Content Exploration" },
];

const TESTIMONIALS = [
  { q: "The new home actually feels like it knows what I want to watch.", n: "Aarav M.", r: "Daily viewer" },
  { q: "I stopped scrolling endlessly — everything is grouped and clear.", n: "Sofia R.", r: "Creator" },
  { q: "Finding a category takes seconds now, not minutes.", n: "Daniel K.", r: "Casual user" },
];

const LEARNINGS = ["Personalization wins", "Less is more", "Content context matters", "Hierarchy drives discovery", "Data + empathy", "Iterate constantly"];

export default function YouTubeCaseStudy(_props: { onBack: () => void }) {
  return (
    <motion.div
      layoutId="proj-youtube-redesign"
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
                Reimagining the <span style={{ color: RED }}>YouTube</span> Home Experience
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed" style={{ color: SUB }}>
                Making content discovery smarter, faster and more personal.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
                {[["Role", "UX Designer"], ["Timeline", "4 Weeks"], ["Platform", "Desktop"], ["Focus", "Discovery"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                    <p className="mt-1.5 text-[16px] font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 PROBLEM SNAPSHOT ============ */}
        <Section>
          <Reveal><Kicker n="02" label="Problem Snapshot" /></Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              {PAIN.map(([label, pct], i) => (
                <Reveal key={label} delay={i * 0.06}>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="font-medium text-white">{label}</span>
                    <span className="font-bold" style={{ color: RED2 }}>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE, delay: i * 0.06 }}
                      className="h-full rounded-full"
                      style={{ background: RED }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-3xl p-8 sm:p-10" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <span className="text-5xl font-black" style={{ color: RED }}>&ldquo;</span>
                <p className="text-[26px] font-bold leading-snug sm:text-[32px]">
                  I spend more time choosing what to watch than actually watching.
                </p>
                <p className="mt-5 text-[13px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>— Research participant</p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 03 HEATMAP ============ */}
        <Section className="relative">
          <Reveal><Kicker n="03" label="User Behavior Heatmap" /></Reveal>
          <Reveal delay={0.05}>
            <div className="relative overflow-hidden rounded-3xl ring-1" style={{ borderColor: BORD }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/yt-heatmap.webp" alt="YouTube home heatmap" className="block w-full" />
              {/* heat mapping overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  mixBlendMode: "screen",
                  background: [
                    "radial-gradient(circle at 26% 40%, rgba(255,30,0,0.6), transparent 20%)",
                    "radial-gradient(circle at 55% 38%, rgba(255,120,0,0.55), transparent 19%)",
                    "radial-gradient(circle at 83% 40%, rgba(255,60,0,0.5), transparent 18%)",
                    "radial-gradient(circle at 26% 78%, rgba(255,170,0,0.45), transparent 18%)",
                    "radial-gradient(circle at 55% 78%, rgba(255,90,0,0.45), transparent 17%)",
                    "radial-gradient(circle at 83% 78%, rgba(255,140,0,0.4), transparent 16%)",
                    "radial-gradient(circle at 8% 45%, rgba(0,120,255,0.35), transparent 14%)",
                    "radial-gradient(circle at 48% 9%, rgba(255,220,0,0.3), transparent 14%)",
                  ].join(","),
                }}
              />
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[["40%", "Ignored Recommendations"], ["31%", "Sidebar Ignored"], ["27%", "Category Chips Ignored"]].map(([v, l], i) => (
              <Reveal key={l} delay={i * 0.08}>
                <div className="rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-3xl font-extrabold" style={{ color: RED2 }}>{v}</p>
                  <p className="mt-1 text-[14px]" style={{ color: SUB }}>{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 04 DISCOVERY FUNNEL ============ */}
        <Section>
          <Reveal><Kicker n="04" label="Discovery Funnel" /></Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-3">
              {FUNNEL.map(([label, pct], i) => (
                <Reveal key={label} delay={i * 0.07}>
                  <div className="flex items-center gap-4">
                    <span className="w-32 shrink-0 text-[14px] font-medium text-white">{label}</span>
                    <div className="relative h-11 flex-1 overflow-hidden rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: EASE, delay: i * 0.07 }}
                        className="flex h-full items-center justify-end rounded-xl pr-3 text-[13px] font-bold text-white"
                        style={{ background: RED }}
                      >
                        {pct}%
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15}>
              <div className="rounded-3xl p-8" style={{ background: "rgba(255,0,0,0.08)", border: `1px solid ${BORD}` }}>
                <p className="text-[13px] font-semibold uppercase tracking-widest" style={{ color: RED2 }}>Insight</p>
                <p className="mt-3 text-[22px] font-bold leading-snug">
                  <span style={{ color: RED2 }}>71%</span> of visitors drop off before ever watching — discovery, not content, is the bottleneck.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 05 OPPORTUNITY MATRIX ============ */}
        <Section>
          <Reveal><Kicker n="05" label="Opportunity Matrix" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "High Impact · Low Effort", items: ["Better Categories", "Smart Sections", "Content Grouping", "Improved Hierarchy"], hot: true },
              { t: "High Impact · High Effort", items: ["Recommendation Engine", "Personalized Feed", "Dynamic Homepage"], hot: false },
            ].map((q, i) => (
              <Reveal key={q.t} delay={i * 0.08}>
                <div className="h-full rounded-3xl p-7 transition" style={{ background: SURF, border: `1px solid ${q.hot ? RED : BORD}` }}>
                  <p className="text-[13px] font-bold uppercase tracking-widest" style={{ color: q.hot ? RED2 : SUB }}>{q.t}</p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {q.items.map((it) => (
                      <span key={it} className="rounded-xl px-3.5 py-2 text-[14px] font-medium" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORD}` }}>{it}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 08 PERSONALIZATION ENGINE ============ */}
        <Section>
          <Reveal><Kicker n="08" label="Personalization Engine" /></Reveal>
          <div className="flex flex-col items-center gap-0">
            {ENGINE.map((node, i) => (
              <Reveal key={node} delay={i * 0.08} className="flex w-full max-w-md flex-col items-center">
                <div className="w-full rounded-2xl px-6 py-4 text-center text-[16px] font-semibold" style={{ background: i === ENGINE.length - 1 ? RED : SURF, border: `1px solid ${BORD}` }}>
                  {node}
                </div>
                {i < ENGINE.length - 1 && (
                  <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="h-7 w-px origin-top" style={{ background: RED2 }} />
                )}
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 07 BEFORE VS AFTER ============ */}
        <Section>
          <Reveal><Kicker n="07" label="Before vs After" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {BEFORE_AFTER.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.06}>
                <div className="h-full overflow-hidden rounded-3xl" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <div className="border-b px-6 py-4 text-[18px] font-bold" style={{ borderColor: BORD }}>{c.t}</div>
                  <div className="grid grid-cols-2 divide-x" style={{ borderColor: BORD }}>
                    <div className="p-5" style={{ borderColor: BORD }}>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Before</p>
                      <ul className="space-y-2">
                        {c.before.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-[13px]" style={{ color: SUB }}><span style={{ color: "#5a6072" }}>✕</span>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5" style={{ borderColor: BORD, background: "rgba(255,0,0,0.05)" }}>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: RED2 }}>After</p>
                      <ul className="space-y-2">
                        {c.after.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-[13px] text-white"><span style={{ color: RED2 }}>✓</span>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-6 py-3 text-[13px] font-bold" style={{ background: "rgba(255,255,255,0.03)", color: RED2 }}>↗ {c.impact}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 09 RECOMMENDATION DASHBOARD ============ */}
        <Section>
          <Reveal><Kicker n="09" label="Recommendation Dashboard" /></Reveal>
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-3xl ring-1" style={{ borderColor: BORD }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/yt-dashboard.webp" alt="Personalized recommendation dashboard" className="block w-full" />
            </div>
          </Reveal>
        </Section>

        {/* ============ 10 USER FLOW ============ */}
        <Section>
          <Reveal><Kicker n="10" label="User Flow" /></Reveal>
          <div className="flex flex-wrap items-center gap-3">
            {FLOW.map((step, i) => (
              <Reveal key={step} delay={i * 0.05} className="flex items-center gap-3">
                <span className="rounded-full px-4 py-2.5 text-[14px] font-semibold" style={{ background: i === FLOW.length - 1 ? RED : SURF, border: `1px solid ${BORD}` }}>{step}</span>
                {i < FLOW.length - 1 && <span style={{ color: RED2 }}>→</span>}
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 14 IMPACT & RESULTS ============ */}
        <Section>
          <Reveal><Kicker n="14" label="Impact & Results" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESULTS.map((m, i) => (
              <Reveal key={m.l} delay={i * 0.07}>
                <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[46px] font-black leading-none" style={{ color: RED2 }}>
                    <Counter to={m.v} prefix={m.p} suffix={m.s} />
                  </p>
                  <p className="mt-3 text-[15px]" style={{ color: SUB }}>{m.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 15 TESTIMONIALS ============ */}
        <Section>
          <Reveal><Kicker n="15" label="User Testimonials" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="flex-1 text-[16px] leading-relaxed text-white">&ldquo;{t.q}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold" style={{ background: RED }}>{t.n[0]}</span>
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

        {/* ============ 18 LEARNINGS ============ */}
        <Section>
          <Reveal><Kicker n="18" label="Learnings" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNINGS.map((l, i) => (
              <Reveal key={l} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[15px] font-black" style={{ background: "rgba(255,0,0,0.14)", color: RED2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-semibold text-white">{l}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <BackToTop accent={RED} />
      </SmoothScroll>
    </motion.div>
  );
}

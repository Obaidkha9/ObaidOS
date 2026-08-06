"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate } from "framer-motion";
import SmoothScroll from "@/components/os/SmoothScroll";
import BackToTop from "@/components/os/BackToTop";

/* ------------------------------------------------------------------ */
/*  Carwaalah — faster, simpler, more trustworthy car rentals.        */
/*  Minimal, flat case study — matches the OS theme (no gradients).    */
/* ------------------------------------------------------------------ */

const BG = "#141416";
const SURF = "#1c1c1e";
const CARD = "#232326";
const GOLD = "#FFC83D";
const SUB = "#9a9aa2";
const BORD = "rgba(255,255,255,0.08)";
const RED = "#ff6b6b";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- primitives ---------- */
function Reveal({ children, y = 24, delay = 0, className = "" }: { children: ReactNode; y?: number; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: 0.6, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}
function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}
function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="text-[13px] font-semibold tracking-[0.22em]" style={{ color: GOLD }}>{n}</span>
      <span className="h-px w-7" style={{ background: BORD }} />
      <span className="text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: SUB }}>{label}</span>
    </div>
  );
}
const Section = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <section className={`px-6 py-16 sm:px-12 sm:py-24 lg:px-20 ${className}`} style={style}>{children}</section>
);
const card = { background: CARD, border: `1px solid ${BORD}` } as const;
const surf = { background: SURF, border: `1px solid ${BORD}` } as const;
function Dot() { return <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.16)" }} />; }
function Sk({ w = "100%", h = 8 }: { w?: string; h?: number }) { return <span className="block rounded-full" style={{ width: w, height: h, background: "rgba(255,255,255,0.07)" }} />; }
function Car({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 64 26" className={small ? "h-6 w-14" : "h-9 w-20"} fill="none">
      <path d="M4 18h56M8 18c-2 0-3-1-3-3l1-4c.3-1.4 1-2 3-2h6l4-4c1-1 2-1.4 4-1.4h14c2 0 3 .6 4 2l3 3.4h6c2 0 3 1 3 3v3c0 1.4-1 3-3 3" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="3.4" fill={BG} stroke="#fff" strokeWidth="1.4" />
      <circle cx="46" cy="18" r="3.4" fill={BG} stroke="#fff" strokeWidth="1.4" />
    </svg>
  );
}

/* ---------- data ---------- */
const SNAP1 = [["Role", "UX Designer"], ["Timeline", "6 Weeks"], ["Team", "3 Members"], ["Platform", "Responsive Web"]];
const SNAP2 = [["12", "User Interviews"], ["40", "Survey Responses"], ["8", "Competitor Audits"], ["3", "Usability Tests"]];
const FUNNEL = [["Landing Page", 100], ["Browse Cars", 82], ["Vehicle Detail", 64], ["Checkout", 41], ["Payment", 28]] as const;
const PAIN = [["Hidden Charges", 89], ["Too Many Steps", 74], ["Trust Issues", 69], ["Comparison Issues", 61]] as const;
const JOURNEY = [["Search", "🙂"], ["Browse", "🙂"], ["Compare", "😐"], ["Checkout", "😞"], ["Pay", "🙂"]] as const;

const MATRIX = [
  { t: "High Impact · Low Effort", hot: true, items: ["Smart Filters", "Transparent Pricing", "Sticky CTA", "Vehicle Comparison"] },
  { t: "High Impact · High Effort", hot: false, items: ["Booking Flow Redesign", "Dynamic Checkout"] },
  { t: "Low Impact · Low Effort", hot: false, items: ["Social Proof Badges", "FAQ Improvements"] },
  { t: "Low Impact · High Effort", hot: false, items: ["Loyalty Program", "In-app Support"] },
];
const EVOLUTION = ["Sketches", "Wireframes", "Mid Fidelity", "High Fidelity"];

const DECISIONS = [
  { n: "01", t: "Smart Filters", before: ["Too many filters", "Hard comparison"], after: ["Relevant filters", "Better cards"], out: "Users find relevant cars 2× faster." },
  { n: "02", t: "Transparent Pricing", before: ["Hidden pricing", "Surprise fees"], after: ["Full breakdown", "No surprises"], out: "Increased trust, reduced surprises." },
  { n: "03", t: "Vehicle Comparison", before: ["No compare", "Open 5 tabs"], after: ["Side-by-side", "Clear specs"], out: "Easier comparison, better decisions." },
  { n: "04", t: "Unified Checkout", before: ["5 steps", "Repeated info"], after: ["2 steps", "Auto-filled"], out: "Reduced steps from 5 to 2." },
];

const COMP_ROWS = ["Wide Vehicle Range", "Transparent Pricing", "Instant Booking", "Compare Vehicles", "Flexible Pick-up", "Live Availability", "In-app Support"];
const COMP_DATA: Record<string, boolean[]> = {
  // Zoomcar, Revv, MyChoize, Carwaalah
  "Wide Vehicle Range": [true, false, true, true],
  "Transparent Pricing": [true, false, false, true],
  "Instant Booking": [true, true, false, true],
  "Compare Vehicles": [false, false, false, true],
  "Flexible Pick-up": [true, false, true, true],
  "Live Availability": [true, false, false, true],
  "In-app Support": [false, false, false, true],
};

const FLOW = ["Landing", "Search", "Results", "Vehicle Detail", "Checkout", "Payment", "Confirmation"];
const IA = [
  { t: "Search", items: ["Location", "Date & Time", "Filters"] },
  { t: "Listing", items: ["Results", "Sort", "Compare"] },
  { t: "Vehicle Detail", items: ["Overview", "Specs", "Reviews"] },
  { t: "Bookings", items: ["Upcoming", "Past", "Invoices"] },
  { t: "Profile", items: ["Personal Info", "Documents", "Payments"] },
];
const SHOWCASE = ["Homepage", "Listing / Results", "Vehicle Detail", "Compare", "Checkout", "Confirmation"];
const A11Y = [
  { t: "AA Contrast", d: "All screens meet WCAG 2.1 AA." },
  { t: "Keyboard Navigation", d: "Fully navigable with clear focus." },
  { t: "Readable Typography", d: "Optimized sizes & line heights." },
  { t: "Touch Friendly", d: "Min 44px targets for all controls." },
];
const IMPACT = [
  { l: "Booking Completion", from: "48%", to: 79, s: "%", note: "+31% increase", up: true },
  { l: "Average Booking Time", from: "4m 20s", to: 2.05, s: "m", dec: 2, note: "52% faster", up: true, raw: "2m 05s" },
  { l: "Checkout Drop-off", from: "41%", to: 17, s: "%", note: "−58% drop", up: false },
  { l: "User Satisfaction", from: "62", to: 89, s: "", note: "+27 points", up: true },
];
const LEARNINGS = [
  { t: "Transparency builds trust", d: "Clear pricing and info build confident bookings." },
  { t: "Compare reduces fatigue", d: "Side-by-side comparison removes decision fatigue." },
  { t: "Simplicity converts", d: "Reducing steps and choices leads to more bookings." },
  { t: "Data drives design", d: "User insights + analytics lead to meaningful solutions." },
];

/* ================================================================== */
export default function CarwaalahCaseStudy({ onBack: _onBack }: { onBack: () => void }) {
  return (
    <motion.div
      layoutId="proj-carwaalah"
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
                <span style={{ color: GOLD }}>Carwaalah</span> — Making Car Rentals Simpler
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed" style={{ color: SUB }}>
                A complete redesign of the vehicle discovery and booking experience — making car rentals faster, simpler and more trustworthy.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4">
                {[["Role", "UX Designer"], ["Duration", "6 Weeks"], ["Platform", "Web"], ["Focus", "Booking Flow"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                    <p className="mt-1.5 text-[16px] font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 PROJECT SNAPSHOT ============ */}
        <Section>
          <Reveal><Kicker n="02" label="Project Snapshot" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-4">
            {SNAP1.map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.05}>
                <div className="rounded-2xl p-6" style={surf}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                  <p className="mt-2 text-[18px] font-bold">{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {SNAP2.map(([v, l], i) => (
              <Reveal key={l} delay={i * 0.05}>
                <div className="rounded-2xl p-6" style={card}>
                  <p className="text-[38px] font-black leading-none" style={{ color: GOLD }}>{v}</p>
                  <p className="mt-2 text-[13px]" style={{ color: SUB }}>{l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 03 PROBLEM FUNNEL ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="03" label="The Problem" /></Reveal>
          <Reveal delay={0.05}><h2 className="mb-10 max-w-2xl text-[30px] font-extrabold leading-tight sm:text-[42px]">Users were dropping off before completing a booking.</h2></Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-2.5">
              {FUNNEL.map(([label, pct], i) => (
                <Reveal key={label} delay={i * 0.07}>
                  <div className="flex items-center gap-4">
                    <span className="w-28 shrink-0 text-[13px] font-medium">{label}</span>
                    <div className="relative h-10 flex-1 overflow-hidden rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE, delay: i * 0.07 }} className="flex h-full items-center justify-end rounded-lg pr-3 text-[12px] font-bold" style={{ background: GOLD, color: "#1a1400" }}>{pct}%</motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-8 text-center" style={card}>
                <p className="text-[46px] font-black leading-none" style={{ color: RED }}>↓ <Counter to={72} suffix="%" /></p>
                <p className="mt-3 text-[15px]" style={{ color: SUB }}>of users drop off before payment.</p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 04 RESEARCH DASHBOARD ============ */}
        <Section>
          <Reveal><Kicker n="04" label="Research Insights" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-4">
            {/* pain points */}
            <Reveal className="lg:col-span-2">
              <div className="h-full rounded-2xl p-7" style={surf}>
                <p className="mb-5 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Top Pain Points</p>
                <div className="space-y-4">
                  {PAIN.map(([label, pct], i) => (
                    <div key={label}>
                      <div className="mb-1.5 flex justify-between text-[13px]"><span className="font-medium">{label}</span><span className="font-bold" style={{ color: GOLD }}>{pct}%</span></div>
                      <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE, delay: i * 0.06 }} className="h-full rounded-full" style={{ background: GOLD }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            {/* quote */}
            <Reveal delay={0.06}>
              <div className="flex h-full flex-col justify-center rounded-2xl p-7" style={card}>
                <span className="text-4xl font-black" style={{ color: GOLD }}>&ldquo;</span>
                <p className="text-[18px] font-bold leading-snug">I wanted to compare cars without opening five tabs.</p>
                <p className="mt-4 text-[12px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>— Interview participant</p>
              </div>
            </Reveal>
            {/* persona */}
            <Reveal delay={0.12}>
              <div className="h-full rounded-2xl p-7" style={card}>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-[16px] font-black" style={{ background: GOLD, color: "#1a1400" }}>R</span>
                  <div>
                    <p className="text-[16px] font-bold">Rahul Sharma, 28</p>
                    <p className="text-[12px]" style={{ color: SUB }}>Software Engineer</p>
                  </div>
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>Goals</p>
                <ul className="mt-2 space-y-1.5 text-[13px]">{["Fast booking", "Price transparency"].map((g) => <li key={g} className="flex gap-2"><span style={{ color: GOLD }}>·</span>{g}</li>)}</ul>
                <p className="mt-4 text-[12px]" style={{ color: SUB }}>Weekend traveler · values speed and transparency.</p>
              </div>
            </Reveal>
          </div>
          {/* journey map */}
          <Reveal delay={0.1} className="mt-4">
            <div className="rounded-2xl p-7" style={surf}>
              <p className="mb-6 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Journey Map</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                {JOURNEY.map(([stage, emo], i) => (
                  <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[26px]">{emo}</span>
                    <span className="text-[13px] font-semibold">{stage}</span>
                    {(i === 2 || i === 3) && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(255,107,107,0.12)", color: RED }}>pain point</span>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ============ 05 OPPORTUNITY MATRIX ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="05" label="Opportunity Matrix" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {MATRIX.map((q, i) => (
              <Reveal key={q.t} delay={i * 0.06}>
                <div className="h-full rounded-2xl p-7" style={{ background: CARD, border: `1px solid ${q.hot ? GOLD : BORD}` }}>
                  <p className="text-[13px] font-bold uppercase tracking-widest" style={{ color: q.hot ? GOLD : SUB }}>{q.t}</p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {q.items.map((it) => <span key={it} className="rounded-xl px-3.5 py-2 text-[14px] font-medium" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORD}` }}>{it}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 06 DESIGN EVOLUTION ============ */}
        <Section>
          <Reveal><Kicker n="06" label="Design Evolution" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { src: "/cw-evo-wireframe.jpg", label: "Wireframe" },
              { src: "/cw-evo-hifi.jpg", label: "High-Fidelity" },
              { src: "/cw-evo-final.jpg", label: "Final Design" },
            ].map((s, i) => (
              <Reveal key={s.src} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6 }}>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={card}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.label} loading="lazy" className="block h-auto w-full" />
                  </div>
                  <p className="mt-3 text-center text-[13px] font-semibold" style={{ color: SUB }}>{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 07 KEY DESIGN DECISIONS ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="07" label="Key Design Decisions" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-2">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.t} delay={(i % 2) * 0.08}>
                <div className="h-full overflow-hidden rounded-2xl" style={card}>
                  <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: BORD }}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-black" style={{ background: "rgba(255,200,61,0.14)", color: GOLD }}>{d.n}</span>
                    <span className="text-[16px] font-bold">{d.t}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-6">
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Before</p>
                      <ul className="space-y-1.5">{d.before.map((b) => <li key={b} className="flex items-center gap-1.5 text-[12px]" style={{ color: SUB }}><span style={{ color: RED }}>✕</span>{b}</li>)}</ul>
                    </div>
                    <span className="text-[18px]" style={{ color: SUB }}>→</span>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>After</p>
                      <ul className="space-y-1.5">{d.after.map((a) => <li key={a} className="flex items-center gap-1.5 text-[12px] text-white"><span style={{ color: GOLD }}>✓</span>{a}</li>)}</ul>
                    </div>
                  </div>
                  <div className="border-t px-6 py-3 text-[13px]" style={{ borderColor: BORD }}><span className="font-bold" style={{ color: GOLD }}>Outcome:</span> <span style={{ color: SUB }}>{d.out}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 08 COMPETITIVE ANALYSIS ============ */}
        <Section>
          <Reveal><Kicker n="08" label="Competitive Analysis" /></Reveal>
          <Reveal delay={0.05}>
            <div className="overflow-x-auto rounded-2xl" style={surf}>
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-[12px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Features</th>
                    {["Zoomcar", "Revv", "MyChoize"].map((c) => <th key={c} className="px-4 py-4 text-center text-[13px] font-semibold" style={{ color: SUB }}>{c}</th>)}
                    <th className="px-4 py-4 text-center text-[13px] font-black" style={{ color: GOLD, background: "rgba(255,200,61,0.06)" }}>Carwaalah</th>
                  </tr>
                </thead>
                <tbody>
                  {COMP_ROWS.map((row) => (
                    <tr key={row} className="border-t" style={{ borderColor: BORD }}>
                      <td className="px-5 py-3.5 text-[13px] font-medium">{row}</td>
                      {COMP_DATA[row].map((yes, ci) => (
                        <td key={ci} className="px-4 py-3.5 text-center text-[15px]" style={ci === 3 ? { background: "rgba(255,200,61,0.06)" } : undefined}>
                          <span style={{ color: yes ? (ci === 3 ? GOLD : "#4ade80") : RED }}>{yes ? "✓" : "✕"}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Section>

        {/* ============ 09 USER FLOW ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="09" label="User Flow" /></Reveal>
          <Reveal delay={0.05}><p className="mb-10 text-[16px]" style={{ color: SUB }}>Simplified end-to-end booking experience.</p></Reveal>
          <div className="flex flex-wrap items-center gap-3">
            {FLOW.map((step, i) => (
              <Reveal key={step} delay={i * 0.05} className="flex items-center gap-3">
                <span className="rounded-xl px-4 py-3 text-[14px] font-semibold" style={i === FLOW.length - 1 ? { background: GOLD, color: "#1a1400" } : { ...card, color: "#fff" }}>{step}</span>
                {i < FLOW.length - 1 && <span style={{ color: SUB }}>→</span>}
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 10 INFORMATION ARCHITECTURE ============ */}
        <Section>
          <Reveal><Kicker n="10" label="Information Architecture" /></Reveal>
          <div className="flex flex-col items-center">
            <Reveal><div className="rounded-xl px-6 py-3 text-[15px] font-bold" style={{ background: GOLD, color: "#1a1400" }}>Home</div></Reveal>
            <Reveal delay={0.06}><div className="my-4 h-6 w-px" style={{ background: BORD }} /></Reveal>
            <div className="grid w-full gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {IA.map((n, i) => (
                <Reveal key={n.t} delay={i * 0.05}>
                  <div className="h-full rounded-2xl p-5" style={surf}>
                    <p className="text-[14px] font-bold" style={{ color: GOLD }}>{n.t}</p>
                    <ul className="mt-3 space-y-1.5">{n.items.map((it) => <li key={it} className="flex items-center gap-2 text-[12px]" style={{ color: SUB }}><span className="h-1 w-1 rounded-full" style={{ background: GOLD }} />{it}</li>)}</ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ============ 11 FINAL UI SHOWCASE ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="11" label="Final UI Showcase" /></Reveal>
          <Reveal delay={0.05}>
            <p className="mb-8 max-w-xl text-[16px]" style={{ color: SUB }}>The complete Carwaalah landing page.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cw-final.jpg" alt="Carwaalah — final landing page" loading="lazy" className="block h-auto w-full" />
            </div>
          </Reveal>
        </Section>

        {/* ============ 12 DESIGN SYSTEM ============ */}
        <Section>
          <Reveal><Kicker n="12" label="Design System" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="rounded-2xl p-7" style={surf}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Colors</p>
                <div className="flex flex-wrap gap-3">
                  {[["Yellow", "#FFD60A"], ["Ink", "#17181C"], ["Black", "#0D0D0D"], ["White", "#FFFFFF"], ["Accent", "#2563EB"], ["Muted", "#8A8A8A"]].map(([n, c]) => (
                    <div key={n} className="flex flex-col items-center gap-1.5">
                      <span className="h-11 w-11 rounded-xl" style={{ background: c, border: `1px solid ${BORD}` }} />
                      <span className="text-[10px]" style={{ color: SUB }}>{n}</span>
                      <span className="text-[9px] tabular-nums" style={{ color: "#5f5f66" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="rounded-2xl p-7" style={surf}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Typography · Poppins</p>
                <p className="text-[30px] font-black leading-none" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>Aa</p>
                <p className="mt-3 text-[22px] font-bold" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>Fast And Easy Way</p>
                <p className="mt-1 text-[15px]" style={{ color: SUB, fontFamily: "'Poppins', var(--font-sans)" }}>Body — clean, bold, confident.</p>
                <p className="mt-2 text-[12px]" style={{ color: SUB }}>Regular · Medium · SemiBold · Bold</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-2xl p-7" style={surf}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Components</p>
                {/* rendered on the product's light surface for fidelity */}
                <div className="space-y-3 rounded-2xl bg-white p-4" style={{ fontFamily: "'Poppins', var(--font-sans)" }}>
                  <span className="inline-block rounded-lg px-5 py-2.5 text-[13px] font-semibold text-black" style={{ background: "#FFD60A" }}>Book Now</span>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 p-2.5">
                    <div className="flex gap-2 text-[11px] font-medium text-neutral-500">
                      <span>⛽ 80L</span><span>· Manual</span><span>· 6 People</span>
                    </div>
                    <span className="rounded-md px-2.5 py-1 text-[11px] font-bold text-black" style={{ background: "#FFD60A" }}>₹800/day</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-semibold text-neutral-700">SUV</span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-semibold text-neutral-700">Hatchback</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 13 ACCESSIBILITY ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="13" label="Accessibility" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {A11Y.map((a, i) => (
              <Reveal key={a.t} delay={i * 0.06}>
                <div className="h-full rounded-2xl p-6" style={card}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[14px]" style={{ background: "rgba(255,200,61,0.14)", color: GOLD }}>✓</span>
                  <p className="mt-4 text-[15px] font-bold">{a.t}</p>
                  <p className="mt-1.5 text-[13px]" style={{ color: SUB }}>{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 14 IMPACT ============ */}
        <Section>
          <Reveal><Kicker n="14" label="Metrics & Impact" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((m, i) => (
              <Reveal key={m.l} delay={i * 0.07}>
                <div className="rounded-2xl p-6" style={surf}>
                  <p className="text-[12px]" style={{ color: SUB }}>{m.l}</p>
                  <p className="mt-2 flex items-baseline gap-2 text-[15px]" style={{ color: SUB }}>
                    <span className="line-through">{m.from}</span>
                    <span style={{ color: GOLD }}>→</span>
                    <span className="text-[28px] font-black text-white">{m.raw ?? <Counter to={m.to} suffix={m.s} decimals={m.dec ?? 0} />}</span>
                  </p>
                  <p className="mt-2 text-[12px] font-bold" style={{ color: m.up ? GOLD : RED }}>{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 15 LEARNINGS ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="15" label="What I Learned" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEARNINGS.map((l, i) => (
              <Reveal key={l.t} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl p-6" style={card}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-[15px] font-black" style={{ background: "rgba(255,200,61,0.14)", color: GOLD }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-4 text-[16px] font-bold">{l.t}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: SUB }}>{l.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <BackToTop accent={GOLD} />
      </SmoothScroll>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, animate } from "framer-motion";
import SmoothScroll from "@/components/os/SmoothScroll";
import BackToTop from "@/components/os/BackToTop";
import { asset } from "@/lib/asset";

/* ------------------------------------------------------------------ */
/*  iConnect — Reimagining the Employee Experience Platform.           */
/*  Premium, enterprise-SaaS storytelling case study. 85% visual.      */
/* ------------------------------------------------------------------ */

const BG = "#141416";
const SURF = "#1c1c1e";
const CARD = "#232326";
const PRI = "#0F53FC";
const SEC = "#6f9bff";
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
      <span className="text-[13px] font-bold tracking-[0.25em]" style={{ color: SEC }}>{n}</span>
      <span className="h-px w-8" style={{ background: PRI }} />
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: SUB }}>{label}</span>
    </div>
  );
}

const Section = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <section className={`px-6 py-16 sm:px-12 sm:py-24 lg:px-20 ${className}`} style={style}>{children}</section>
);

/* ---------- mock UI helpers ---------- */
function Dot() {
  return <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />;
}

function BrowserFrame({ url, tabs, active, children }: { url: string; tabs?: string[]; active?: number; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1" style={{ background: SURF, borderColor: BORD }}>
      <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: BORD, background: "rgba(255,255,255,0.02)" }}>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <div className="ml-2 flex-1 truncate rounded-md px-3 py-1.5 text-[11px]" style={{ background: "rgba(255,255,255,0.05)", color: SUB }}>{url}</div>
      </div>
      {tabs && (
        <div className="flex gap-1 border-b px-3 pt-2" style={{ borderColor: BORD }}>
          {tabs.map((t, i) => (
            <span key={t} className="rounded-t-lg px-3.5 py-2 text-[12px] font-semibold" style={{ color: i === active ? "#fff" : SUB, background: i === active ? CARD : "transparent", borderBottom: i === active ? `2px solid ${PRI}` : "2px solid transparent" }}>{t}</span>
          ))}
        </div>
      )}
      <div style={{ background: CARD }}>{children}</div>
    </div>
  );
}

/* Before / after image comparison — drag the handle to wipe between two
   screenshots (used to compare the legacy portal with the redesign). */
function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After" }: { before: string; after: string; beforeLabel?: string; afterLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative w-full cursor-ew-resize select-none overflow-hidden rounded-2xl ring-1 ring-white/10"
      style={{ aspectRatio: "16 / 9", touchAction: "none" }}
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => { if (dragging.current) move(e.clientX); }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      {/* after (new) fills the frame */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top" />
      {/* before (old) clipped to the divider */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={before} alt={beforeLabel} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      {/* labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">{afterLabel}</span>
      {/* divider + handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="h-full w-0.5 bg-white/90" />
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-4 6 4 6M15 6l4 6-4 6" /></svg>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ color = SEC }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-full" preserveAspectRatio="none">
      <polyline points="0,32 15,26 30,30 45,18 60,22 75,10 90,15 105,6 120,9" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- data ---------- */
const FRICTION = ["Login", "Find Module", "Open Section", "Find Action", "Submit Request"];


const RESEARCH = [
  { v: 80, l: "Users Access Attendance Daily" },
  { v: 70, l: "Need Leave Actions Frequently" },
  { v: 65, l: "Use Only 3–4 Features" },
  { v: 58, l: "Struggle Finding Features" },
];

const PERSONAS = [
  { role: "Software Engineer", init: "SE", goals: ["Leave Requests", "Attendance", "Payslips"], pains: ["Hidden Features", "Too Many Menus"] },
  { role: "Project Manager", init: "PM", goals: ["Team Availability", "Approvals", "Requests"], pains: ["Navigation Complexity", "Lack of Visibility"] },
];

const IA_BEFORE = ["Dashboard", "Attendance", "Leave", "Remote Work", "On Duty", "Employee Information", "Financial Details", "Documents", "Policies", "Service Requests"];
const IA_AFTER = ["Dashboard", "Quick Actions", "My Workspace", "Resources"];

const DASH_OLD = ["Too Many Cards", "No Prioritization", "Informational Only"];
const DASH_NEW = ["Quick Actions", "Leave Balance", "Attendance Snapshot", "Team Availability", "Pending Requests"];

const QUICK = [
  { t: "Apply Leave", old: "4–5 Steps", nu: "1 Click" },
  { t: "Remote Work", old: "4 Steps", nu: "1 Click" },
  { t: "On Duty", old: "5 Steps", nu: "1 Click" },
  { t: "Conveyance", old: "5 Steps", nu: "1 Click" },
];

const JOURNEY_BEFORE = ["Login", "Search Feature", "Open Module", "Find Action", "Submit"];
const JOURNEY_AFTER = ["Login", "Quick Action", "Submit"];

const AI_FLOW = ["Ask AI", "Find Feature", "Understand Policy", "Complete Action"];
const AI_PROMPTS = ["How do I apply leave?", "Show my attendance", "Download my payslip", "Check remote work policy", "Submit conveyance"];

const LIVE = "https://obaidkha9.github.io/Employee-Portal/#/";
/* legacy iConnect portal screens (extracted from the old product docs) */
const EP_LEGACY: { src: string; label: string }[] = [
  { src: asset("/ep-legacy-dashboard.jpg"), label: "Home · My Dashboard" },
  { src: asset("/ep-legacy-information.jpg"), label: "My Information" },
  { src: asset("/ep-legacy-documents.jpg"), label: "My Documents" },
  { src: asset("/ep-legacy-attendance.jpg"), label: "Attendance" },
  { src: asset("/ep-legacy-leave.jpg"), label: "Leave" },
];
/* real screens captured from the live product */
const EP_SHOTS: { src: string; label: string }[] = [
  { src: asset("/ep-dashboard.jpg"), label: "Dashboard" },
  { src: asset("/ep-attendance.jpg"), label: "My Attendance" },
  { src: asset("/ep-service-requests.jpg"), label: "Service Requests" },
  { src: asset("/ep-financial.jpg"), label: "Financial Details" },
  { src: asset("/ep-salary.jpg"), label: "Salary Slips" },
  { src: asset("/ep-reimbursements.jpg"), label: "Reimbursements" },
  { src: asset("/ep-approvals.jpg"), label: "My Approvals" },
  { src: asset("/ep-conveyance.jpg"), label: "Conveyance Allowance" },
];

const IMPACT = [
  { v: 40, s: "%", l: "Faster Navigation" },
  { v: 60, s: "%", l: "Reduced Clicks" },
  { v: 4, s: "", l: "Unified Workflows" },
  { v: 1, s: "", l: "Employee Command Center" },
];

const LEARNINGS = [
  "Employees think in tasks",
  "Actions matter more than information",
  "Reduce navigation depth",
  "Surface high-frequency actions",
  "Enterprise UX should feel consumer-grade",
  "AI improves discoverability",
];

/* ================================================================== */
export default function EmployeePortalCaseStudy({ onBack: _onBack }: { onBack: () => void }) {
  return (
    <motion.div
      layoutId="proj-employee-portal"
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
                Reimagining Employee Experience <span style={{ color: SEC }}>at Ensylon</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed" style={{ color: SUB }}>
                Transforming a fragmented HR portal into a modern employee command center focused on productivity, discoverability and self-service.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
                {[["Role", "UX Engineer"], ["Timeline", "8 Weeks"], ["Platform", "Web"], ["Industry", "HR Tech"], ["Focus", "Employee Experience"], ["Discipline", "IA · Workflows"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                    <p className="mt-1.5 text-[16px] font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 02 LIVE PRODUCT ============ */}
        <Section>
          <Reveal><Kicker n="02" label="Live Product" /></Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl text-[34px] font-extrabold leading-tight sm:text-[48px]">A redesign actively used by employees across the organization.</h2>
          </Reveal>
          <Reveal delay={0.12} className="mt-12">
            <BrowserFrame url="obaidkha9.github.io/Employee-Portal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/ep-dashboard.jpg")} alt="Employee Portal — live dashboard" loading="lazy" className="block h-auto w-full" />
            </BrowserFrame>
          </Reveal>
          <Reveal delay={0.05} className="mt-8">
            <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition active:scale-95" style={{ background: PRI }}>
              Visit Live Product →
            </a>
          </Reveal>
        </Section>

        {/* ============ 03 THE CHALLENGE ============ */}
        <Section>
          <Reveal><Kicker n="03" label="The Challenge" /></Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="rounded-3xl p-8 sm:p-10" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <span className="text-5xl font-black" style={{ color: PRI }}>&ldquo;</span>
                <p className="text-[26px] font-bold leading-snug sm:text-[32px]">I know the feature exists, but I don't know where to find it.</p>
                <p className="mt-6 text-[13px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>— Employee, discovery interview</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-2.5">
                {FRICTION.map((step, i) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className="flex w-full items-center justify-between rounded-xl px-5 py-3.5" style={{ background: CARD, border: `1px solid ${i > 0 && i < FRICTION.length ? "rgba(255,80,80,0.25)" : BORD}` }}>
                      <span className="text-[15px] font-semibold">{step}</span>
                      {i > 0 && <span className="text-[11px] font-bold" style={{ color: "#ff6b6b" }}>friction</span>}
                    </div>
                    {i < FRICTION.length - 1 && <span className="py-1 text-[13px]" style={{ color: SUB }}>↓</span>}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 04 LEGACY PLATFORM ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="04" label="Legacy Platform" /></Reveal>
          <Reveal delay={0.05}>
            <p className="mb-8 max-w-2xl text-[18px] leading-relaxed" style={{ color: SUB }}>
              The original iConnect portal — dense tab-in-tab navigation, information-only screens, and actions buried several clicks deep.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {EP_LEGACY.map((s, i) => (
              <Reveal key={s.src} delay={(i % 2) * 0.06} className={i === 0 ? "sm:col-span-2" : ""}>
                <motion.div whileHover={{ y: -6 }}>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ background: CARD }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={`Legacy — ${s.label}`} loading="lazy" className="block h-auto w-full" />
                  </div>
                  <p className="mt-3 text-[14px] font-semibold" style={{ color: SUB }}>{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 05 RESEARCH DASHBOARD ============ */}
        <Section>
          <Reveal><Kicker n="05" label="Research Dashboard" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH.map((r, i) => (
              <Reveal key={r.l} delay={i * 0.07}>
                <div className="flex flex-col rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <div className="relative mx-auto mb-4 h-24 w-24">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <motion.circle
                        cx="18" cy="18" r="15.9" fill="none" stroke={SEC} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray="100" initial={{ strokeDashoffset: 100 }} whileInView={{ strokeDashoffset: 100 - r.v }} viewport={{ once: true }} transition={{ duration: 1.3, ease: EASE, delay: i * 0.07 }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[22px] font-black"><Counter to={r.v} suffix="%" /></span>
                  </div>
                  <p className="text-center text-[13px] leading-tight" style={{ color: SUB }}>{r.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 06 EMPLOYEE PERSONAS ============ */}
        <Section>
          <Reveal><Kicker n="06" label="Employee Personas" /></Reveal>
          <div className="grid gap-5 lg:grid-cols-2">
            {PERSONAS.map((p, i) => (
              <Reveal key={p.role} delay={i * 0.1}>
                <div className="h-full rounded-3xl p-8" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-[18px] font-black" style={{ background: PRI }}>{p.init}</span>
                    <div>
                      <p className="text-[22px] font-bold">{p.role}</p>
                      <p className="text-[13px]" style={{ color: SUB }}>Primary persona</p>
                    </div>
                  </div>
                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: SEC }}>Goals</p>
                      <ul className="space-y-2">
                        {p.goals.map((g) => <li key={g} className="flex items-center gap-2 text-[14px]"><span style={{ color: SEC }}>✓</span>{g}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#ff6b6b" }}>Pain Points</p>
                      <ul className="space-y-2">
                        {p.pains.map((g) => <li key={g} className="flex items-center gap-2 text-[14px]" style={{ color: SUB }}><span style={{ color: "#ff6b6b" }}>✕</span>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 07 INFORMATION ARCHITECTURE ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="07" label="Information Architecture" /></Reveal>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <Reveal>
              <div className="rounded-3xl p-7" style={{ background: CARD, border: "1px solid rgba(255,80,80,0.2)" }}>
                <p className="mb-4 text-[12px] font-bold uppercase tracking-widest" style={{ color: "#ff6b6b" }}>Before · 10+ top-level items</p>
                <div className="flex flex-wrap gap-2">
                  {IA_BEFORE.map((n) => <span key={n} className="rounded-lg px-3 py-2 text-[12px]" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORD}`, color: SUB }}>{n}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="flex justify-center">
              <span className="text-[26px]" style={{ color: SEC }}>→</span>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-3xl p-7" style={{ background: CARD, border: "1px solid rgba(15,83,252,0.4)" }}>
                <p className="mb-4 text-[12px] font-bold uppercase tracking-widest" style={{ color: SEC }}>After · 4 focused surfaces</p>
                <div className="flex flex-col gap-2.5">
                  {IA_AFTER.map((n) => (
                    <div key={n} className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold" style={{ background: "rgba(15,83,252,0.12)", border: `1px solid ${BORD}` }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEC }} />{n}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 08 DASHBOARD TRANSFORMATION ============ */}
        <Section>
          <Reveal><Kicker n="08" label="Dashboard Transformation" /></Reveal>
          <Reveal delay={0.05}>
            <p className="mb-6 max-w-xl text-[15px]" style={{ color: SUB }}>Drag the handle to compare the legacy portal with the redesign.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter before={asset("/ep-old-dashboard.jpg")} after={asset("/ep-new-dashboard.jpg")} beforeLabel="Legacy" afterLabel="Redesigned" />
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl p-6" style={{ background: SURF, border: "1px solid rgba(255,80,80,0.2)" }}>
                <p className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: "#ff6b6b" }}>Legacy</p>
                <ul className="space-y-2">
                  {DASH_OLD.map((a) => <li key={a} className="flex items-center gap-2 text-[13px]" style={{ color: SUB }}><span style={{ color: "#ff6b6b" }}>✕</span>{a}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-6" style={{ background: SURF, border: "1px solid rgba(15,83,252,0.4)" }}>
                <p className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: SEC }}>Redesigned</p>
                <ul className="grid grid-cols-2 gap-y-2">
                  {DASH_NEW.map((a) => <li key={a} className="flex items-center gap-2 text-[13px] text-white"><span style={{ color: SEC }}>✓</span>{a}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 09 QUICK ACTIONS STRATEGY ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="09" label="Quick Actions Strategy" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map((q, i) => (
              <Reveal key={q.t} delay={i * 0.07}>
                <motion.div whileHover={{ y: -6 }} className="h-full rounded-3xl p-6" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <p className="text-[18px] font-bold">{q.t}</p>
                  <div className="mt-5 space-y-2">
                    <div className="rounded-lg px-3 py-2 text-[12px]" style={{ background: "rgba(255,80,80,0.08)", color: SUB }}>Old · {q.old}</div>
                    <p className="text-center text-[13px]" style={{ color: SEC }}>↓</p>
                    <div className="rounded-lg px-3 py-2 text-[13px] font-bold" style={{ background: "rgba(15,83,252,0.16)", color: "#fff" }}>New · {q.nu}</div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 10 EMPLOYEE JOURNEY ============ */}
        <Section>
          <Reveal><Kicker n="10" label="Employee Journey" /></Reveal>
          <div className="space-y-10">
            {[{ label: "Before", steps: JOURNEY_BEFORE, tone: "#ff6b6b" }, { label: "After", steps: JOURNEY_AFTER, tone: SEC }].map((row, r) => (
              <Reveal key={row.label} delay={r * 0.1}>
                <p className="mb-4 text-[12px] font-bold uppercase tracking-widest" style={{ color: row.tone }}>{row.label} · {row.steps.length} steps</p>
                <div className="flex flex-wrap items-center gap-3">
                  {row.steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <span className="rounded-full px-4 py-2.5 text-[14px] font-semibold" style={{ background: i === row.steps.length - 1 ? row.tone : CARD, border: `1px solid ${BORD}`, color: i === row.steps.length - 1 ? "#fff" : "#fff" }}>{s}</span>
                      {i < row.steps.length - 1 && <span style={{ color: SUB }}>→</span>}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 11 AI ASSISTANT VISION ============ */}
        <Section className="relative overflow-hidden">
          <Reveal><Kicker n="11" label="AI Assistant Vision" /></Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[44px]">AI-powered employee assistance</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal delay={0.08}>
              {/* chatbot UI */}
              <div className="rounded-3xl p-5 ring-1" style={{ background: SURF, borderColor: BORD }}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-black" style={{ background: PRI }}>AI</span>
                  <span className="text-[14px] font-bold">iConnect Assistant</span>
                </div>
                <div className="space-y-3">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px]" style={{ background: PRI }}>How do I apply leave?</div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-[13px]" style={{ background: CARD, border: `1px solid ${BORD}`, color: SUB }}>
                    You have <b className="text-white">12 days</b> available. Tap <b style={{ color: SEC }}>Apply Leave</b> below to submit in one step.
                    <div className="mt-3"><span className="inline-block rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: PRI }}>Apply Leave →</span></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <span className="text-[13px]" style={{ color: SUB }}>Ask anything about your workspace…</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mb-6 flex flex-col gap-2.5">
                {AI_FLOW.map((f, i) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: "rgba(15,83,252,0.16)", color: SEC }}>{i + 1}</span>
                    <span className="text-[16px] font-semibold">{f}</span>
                  </div>
                ))}
              </div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Sample prompts</p>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((p) => <span key={p} className="rounded-full px-3.5 py-2 text-[13px]" style={{ background: CARD, border: `1px solid ${BORD}`, color: SUB }}>{p}</span>)}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 12 FINAL UI SHOWCASE ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="12" label="Final UI Showcase" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {EP_SHOTS.map((s, i) => (
              <Reveal key={s.src} delay={(i % 2) * 0.06}>
                <motion.div whileHover={{ y: -6 }}>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10" style={{ background: CARD }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.src} alt={s.label} loading="lazy" className="block h-auto w-full" />
                  </div>
                  <p className="mt-3 text-[14px] font-semibold">{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 13 DESIGN SYSTEM ============ */}
        <Section>
          <Reveal><Kicker n="13" label="Design System" /></Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Colors</p>
                <div className="flex flex-wrap gap-3">
                  {[["Primary", "#1D4ED8"], ["Ink", "#0F172A"], ["Surface", "#F5F6F8"], ["Success", "#16A34A"], ["Warning", "#F59E0B"], ["Muted", "#64748B"]].map(([n, c]) => (
                    <div key={n} className="flex flex-col items-center gap-1.5">
                      <span className="h-12 w-12 rounded-xl" style={{ background: c, border: `1px solid ${BORD}` }} />
                      <span className="text-[10px]" style={{ color: SUB }}>{n}</span>
                      <span className="text-[9px] tabular-nums" style={{ color: "#5f5f66" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Typography · Inter</p>
                <p className="text-[30px] font-black leading-none" style={{ fontFamily: "'Inter', var(--font-sans)" }}>Aa</p>
                <p className="mt-3 text-[22px] font-bold" style={{ fontFamily: "'Inter', var(--font-sans)" }}>Good Morning, Ravi 👋</p>
                <p className="mt-1 text-[15px]" style={{ color: SUB, fontFamily: "'Inter', var(--font-sans)" }}>Body — clean, neutral, enterprise.</p>
                <p className="mt-2 text-[12px]" style={{ color: SUB }}>Regular · Medium · SemiBold · Bold</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-widest" style={{ color: SUB }}>Components</p>
                {/* rendered on the product's light surface for fidelity */}
                <div className="space-y-3 rounded-2xl bg-white p-4" style={{ fontFamily: "'Inter', var(--font-sans)" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white" style={{ background: "#1D4ED8" }}>+ Raise New Request</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: "rgba(22,163,74,0.14)", color: "#15803D" }}>Approved</span>
                    <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: "rgba(245,158,11,0.16)", color: "#B45309" }}>Pending</span>
                    <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: "rgba(29,78,216,0.12)", color: "#1D4ED8" }}>Announcement</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#1D4ED8" }}>View Details →</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ============ 14 IMPACT ============ */}
        <Section style={{ background: SURF }}>
          <Reveal><Kicker n="14" label="Impact" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((m, i) => (
              <Reveal key={m.l} delay={i * 0.07}>
                <div className="rounded-3xl p-8" style={{ background: CARD, border: `1px solid ${BORD}` }}>
                  <p className="text-[52px] font-black leading-none" style={{ color: SEC }}><Counter to={m.v} suffix={m.s} /></p>
                  <p className="mt-3 text-[15px]" style={{ color: SUB }}>{m.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ============ 15 LEARNINGS ============ */}
        <Section>
          <Reveal><Kicker n="15" label="Learnings" /></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNINGS.map((l, i) => (
              <Reveal key={l} delay={i * 0.05}>
                <div className="flex h-full items-center gap-4 rounded-2xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[15px] font-black" style={{ background: "rgba(15,83,252,0.16)", color: SEC }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-semibold text-white">{l}</span>
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

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import SmoothScroll from "@/components/os/SmoothScroll";
import BackToTop from "@/components/os/BackToTop";
import { asset } from "@/lib/asset";

const BG = "#141416";
const SURF = "#1c1c1e";
const BORD = "rgba(255,255,255,0.08)";
const PURPLE = "#6258f6";
const PURPLE_2 = "#8b82ff";
const GOLD = "#f2b84b";
const SUB = "#9a9aa2";
const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-[13px] font-bold tracking-[0.25em]" style={{ color: PURPLE_2 }}>{n}</span>
      <span className="h-px w-8" style={{ background: PURPLE }} />
      <span className="text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: SUB }}>{label}</span>
    </div>
  );
}

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`px-6 py-16 sm:px-12 sm:py-24 lg:px-20 ${className}`}>{children}</section>
);

const PAINS = [
  "Constant distractions",
  "Lack of accountability",
  "Difficulty maintaining routines",
  "Burnout",
  "Inconsistent productivity",
];

const USERS = [
  {
    initials: "RE",
    title: "The Remote Employee",
    goals: ["Stay focused during work hours", "Reduce distractions", "Improve productivity visibility"],
    frustrations: ["Frequent interruptions", "Endless meetings", "Context switching"],
  },
  {
    initials: "FL",
    title: "The Freelancer",
    goals: ["Maintain discipline", "Increase billable hours", "Build client trust"],
    frustrations: ["Procrastination", "No manager oversight", "Irregular schedule"],
  },
  {
    initials: "FO",
    title: "The Founder",
    goals: ["Develop consistent routines", "Improve personal productivity", "Protect deep work"],
    frustrations: ["Multiple responsibilities", "Difficulty prioritizing", "Burnout risk"],
  },
];

const FLOW = ["Open app", "View goal", "Start session", "Complete", "Earn reward", "Track progress", "Return tomorrow"];

const AREAS = [
  ["Home", "Daily overview"],
  ["Focus", "Session management"],
  ["Progress", "Analytics & trends"],
  ["Rewards", "Badges & streaks"],
  ["Profile", "Goals & preferences"],
];

const SYSTEMS = [
  {
    label: "XP progression",
    icon: "⚡",
    copy: "Every completed focus session earns XP that drives visible level progression.",
  },
  {
    label: "Badge system",
    icon: "🏅",
    copy: "Achievements create motivation and act as milestones throughout the habit-building journey.",
  },
  {
    label: "Custom milestones",
    icon: "🎯",
    copy: "Users create their own targets, timelines, and rewards instead of inheriting rigid benchmarks.",
  },
];

const BADGES = [
  ["First Session", "Complete your first focus session"],
  ["7-Day Streak", "Stay focused for seven days"],
  ["100 Focus Hours", "Accumulate one hundred focus hours"],
  ["Deep Work Master", "Complete fifteen 90-minute sessions"],
];

const USER_METRICS = ["Daily focus hours", "Session completion rate", "Streak length", "Goal completion"];
const BUSINESS_METRICS = ["Daily active users", "Weekly retention", "Monthly retention", "Average sessions per user", "Milestone completion rate"];

const FUTURE = [
  ["Team accountability", "Shared focus rooms to build collective momentum"],
  ["AI focus coach", "Personalized insights driven by session data"],
  ["Adaptive milestones", "Goals that adjust to real performance"],
  ["Companion evolution", "A mascot that grows as users progress"],
];

const FINAL_SCREENS = [
  ["Splash screen", "/focus-forge-01-splash.webp"],
  ["Daily focus goal", "/focus-forge-02-daily-goal.webp"],
  ["Session length", "/focus-forge-03-session-length.webp"],
  ["Home dashboard", "/focus-forge-04-home.webp"],
  ["Focus session setup", "/focus-forge-05-focus-session.webp"],
  ["Active focus session", "/focus-forge-06-active-session.webp"],
  ["Session complete", "/focus-forge-07-session-complete.webp"],
  ["Progress and analytics", "/focus-forge-08-progress.webp"],
  ["Rewards hub", "/focus-forge-09-rewards.webp"],
  ["Profile", "/focus-forge-10-profile.webp"],
] as const;

function FinalScreensGrid({ columns, className }: { columns: number; className: string }) {
  const grouped = Array.from(
    { length: columns },
    () => [] as (typeof FINAL_SCREENS)[number][],
  );
  FINAL_SCREENS.forEach((screen, i) => grouped[i % columns].push(screen));

  return (
    <div className={`${className} mt-10 items-start gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {grouped.map((column, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-col gap-2">
          {column.map(([label, src], rowIndex) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: ((rowIndex * columns + columnIndex) % 8) * 0.04 }}
              className="w-full overflow-hidden rounded-xl bg-[#090910] ring-1 ring-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(src)} alt={label} loading="lazy" className="block h-auto w-full transition duration-500 hover:scale-[1.02]" />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function FocusForgeCaseStudy(_props: { onBack: () => void }) {
  return (
    <motion.div
      layoutId="proj-focus-forge"
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ background: BG, color: "#fff", fontFamily: "var(--font-sans)" }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
    >
      <SmoothScroll>
        <section className="relative flex min-h-[86vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
          <div className="relative z-10 max-w-4xl">
            <Reveal>
              <h1 className="text-[42px] font-extrabold leading-[1.03] tracking-tight sm:text-[62px] lg:text-[78px]">
                <span style={{ color: PURPLE }}>FocusForge</span> - Habit building experience
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed" style={{ color: SUB }}>
                Building sustainable focus habits for remote professionals through gamification and behavioral design.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {[["Role", "Product Designer"], ["Duration", "3 weeks"], ["Platform", "iOS & Android"], ["Type", "Mobile app"]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>{k}</p>
                    <p className="mt-1.5 text-[15px] font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Section>
          <Reveal><Kicker n="01" label="The challenge" /></Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <h2 className="text-[34px] font-bold leading-tight sm:text-[46px]">Remote work is <em style={{ color: PURPLE_2 }}>flexible</em>, but focus is fragile.</h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed" style={{ color: SUB }}>
                Most productivity apps focus on task management. Very few focus on habit formation.
              </p>
              <div className="mt-7 space-y-2.5">
                {PAINS.map((pain, i) => (
                  <motion.div key={pain} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: PURPLE }} />
                    <span className="text-[14px] font-medium">{pain}</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-4">
                <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SUB }}>The wrong question</p>
                  <p className="mt-3 text-[24px] font-bold text-white/40 line-through">How do we track work?</p>
                </div>
                <div className="rounded-3xl p-7" style={{ background: "rgba(98,88,246,0.12)", border: `1px solid ${PURPLE}` }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>The right question</p>
                  <p className="mt-3 text-[26px] font-bold leading-snug">How do we help users stay focused consistently over time?</p>
                </div>
                <div className="rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>Problem statement</p>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: SUB }}>Remote professionals struggle to maintain focus and build sustainable work habits without external accountability or visible progress.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section>
          <Reveal><Kicker n="02" label="Understanding users" /></Reveal>
          <Reveal><h2 className="text-[34px] font-bold sm:text-[46px]">Three distinct user groups</h2></Reveal>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: SUB }}>Each has a different context, but the same underlying problem: the absence of accountability.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {USERS.map((user, i) => (
              <Reveal key={user.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl p-6" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-[12px] font-black" style={{ background: "rgba(98,88,246,0.16)", color: PURPLE_2 }}>{user.initials}</span>
                    <h3 className="text-[18px] font-bold">{user.title}</h3>
                  </div>
                  <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>Goals</p>
                  {user.goals.map((item) => <p key={item} className="mt-2 text-[13px] text-white/80">• {item}</p>)}
                  <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#ff8b8b" }}>Frustrations</p>
                  {user.frustrations.map((item) => <p key={item} className="mt-2 text-[13px]" style={{ color: SUB }}>• {item}</p>)}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12}>
            <div className="mt-6 rounded-3xl p-7 sm:flex sm:items-center sm:gap-6" style={{ background: "rgba(242,184,75,0.07)", border: "1px solid rgba(242,184,75,0.22)" }}>
              <span className="text-3xl">💡</span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: GOLD }}>Key insight</p>
                <p className="mt-2 text-[18px] font-semibold">Users do not lack productivity tools. Users lack <span style={{ color: GOLD }}>motivation and accountability.</span></p>
                <p className="mt-1 text-[14px]" style={{ color: SUB }}>Most apps provide features; few create daily habits.</p>
              </div>
            </div>
          </Reveal>
        </Section>

        <Section>
          <Reveal><Kicker n="03" label="User flow" /></Reveal>
          <Reveal><h2 className="text-[34px] font-bold sm:text-[46px]">The primary loop—intentionally simple</h2></Reveal>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: SUB }}>Seven steps form the core habit engine. Every design decision serves this loop.</p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {FLOW.map((step, i) => (
              <Reveal key={step} delay={i * 0.05}>
                <div className="relative flex h-full min-h-28 flex-col items-center justify-center rounded-2xl p-4 text-center" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl text-[12px] font-black" style={{ background: "rgba(98,88,246,0.16)", color: PURPLE_2 }}>{i + 1}</span>
                  <span className="text-[12px] font-semibold">{step}</span>
                  {i < FLOW.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-white/25 lg:block">→</span>}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}><h3 className="mt-16 text-[13px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>Information architecture</h3></Reveal>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {AREAS.map(([name, detail], i) => (
              <Reveal key={name} delay={i * 0.05}>
                <div className="rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="text-[11px] font-bold" style={{ color: PURPLE_2 }}>0{i + 1}</span>
                  <p className="mt-3 text-[16px] font-bold">{name}</p>
                  <p className="mt-1 text-[12px]" style={{ color: SUB }}>{detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section>
          <Reveal><Kicker n="04" label="Engagement systems" /></Reveal>
          <Reveal><h2 className="text-[34px] font-bold sm:text-[46px]">Designed for long-term return</h2></Reveal>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: SUB }}>Three interlocking retention systems compound over time.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {SYSTEMS.map((system, i) => (
              <Reveal key={system.label} delay={i * 0.08}>
                <div className="h-full rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <span className="text-3xl">{system.icon}</span>
                  <h3 className="mt-5 text-[21px] font-bold">{system.label}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed" style={{ color: SUB }}>{system.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {BADGES.map(([name, detail], i) => (
              <Reveal key={name} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: "rgba(98,88,246,0.08)", border: `1px solid ${BORD}` }}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl" style={{ background: "rgba(98,88,246,0.16)" }}>{["🏆", "🔥", "💎", "🌌"][i]}</span>
                  <div><p className="text-[15px] font-bold">{name}</p><p className="mt-1 text-[12px]" style={{ color: SUB }}>{detail}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section>
          <Reveal><Kicker n="05" label="Companion design" /></Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <h2 className="text-[34px] font-bold leading-tight sm:text-[46px]">Why I chose a <em style={{ color: PURPLE_2 }}>mascot</em></h2>
              <p className="mt-5 text-[16px] leading-relaxed" style={{ color: SUB }}>Many productivity apps feel transactional. FocusForge needed to feel supportive. The mascot acts as a productivity companion—creating emotional engagement without distracting from the core purpose.</p>
            </Reveal>
            <div className="space-y-3">
              {[
                ["Before focus", "Ready for your first session today?"],
                ["After focus", "Great work! +50 XP earned"],
                ["Streak achievement", "13 days in a row. Keep going!"],
              ].map(([state, copy], i) => (
                <Reveal key={state} delay={i * 0.08}>
                  <div className="flex items-center gap-4 rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ background: "rgba(98,88,246,0.16)" }}>🐻</span>
                    <div><p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: i === 1 ? GOLD : PURPLE_2 }}>{state}</p><p className="mt-1 text-[15px] font-semibold">“{copy}”</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <Reveal><Kicker n="06" label="Success metrics" /></Reveal>
          <Reveal><h2 className="text-[34px] font-bold sm:text-[46px]">Success metrics defined upfront</h2></Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {[["User metrics", USER_METRICS], ["Business metrics", BUSINESS_METRICS]].map(([title, metrics], i) => (
              <Reveal key={title as string} delay={i * 0.08}>
                <div className="h-full rounded-3xl p-7" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>{title as string}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(metrics as string[]).map((metric) => <div key={metric} className="flex items-center gap-3 text-[14px]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: PURPLE }} />{metric}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal><h3 className="mt-16 text-[13px] font-semibold uppercase tracking-widest" style={{ color: PURPLE_2 }}>Beyond MVP</h3></Reveal>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FUTURE.map(([title, copy], i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="rounded-2xl p-5" style={{ background: SURF, border: `1px solid ${BORD}` }}>
                  <p className="text-[15px] font-bold">{title}</p><p className="mt-1 text-[12px]" style={{ color: SUB }}>{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section>
          <Reveal><Kicker n="07" label="Final screens" /></Reveal>
          <Reveal>
            <h2 className="text-[34px] font-bold sm:text-[46px]">FocusForge in action</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: SUB }}>The complete mobile experience—from onboarding and daily goals to deep work, progress, rewards, and profile settings.</p>
          </Reveal>
          <FinalScreensGrid columns={2} className="grid sm:hidden" />
          <FinalScreensGrid columns={3} className="hidden sm:grid lg:hidden" />
          <FinalScreensGrid columns={4} className="hidden lg:grid" />
        </Section>

        <Section>
          <Reveal><Kicker n="08" label="Outcome" /></Reveal>
          <Reveal>
            <h2 className="max-w-4xl text-[38px] font-bold leading-tight sm:text-[56px]">Productivity as a <span style={{ color: PURPLE_2 }}>habit-building</span> experience</h2>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed" style={{ color: SUB }}>FocusForge transforms how remote professionals relate to their work—not by adding more tasks, but by making consistent focus feel meaningful and rewarding.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Focus tracking", "Behavioral psychology", "Gamification", "Personal milestones"].map((tag) => <span key={tag} className="rounded-full px-4 py-2 text-[12px] font-semibold" style={{ background: "rgba(98,88,246,0.12)", color: PURPLE_2, border: `1px solid ${BORD}` }}>{tag}</span>)}
            </div>
          </Reveal>
        </Section>

        <BackToTop accent={PURPLE} />
      </SmoothScroll>
    </motion.div>
  );
}

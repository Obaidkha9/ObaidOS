"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppChrome, { type AppProps } from "./AppChrome";
import { PROFILE } from "@/lib/content";

export default function MailApp({ onClose }: AppProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // fire a real mailto as the transport, then play the send animation
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    );
    const subject = encodeURIComponent(`Portfolio hello from ${form.name || "a visitor"}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  const field =
    "w-full rounded-xl bg-white/[0.06] px-4 py-3 text-[15px] outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-[#0f53fc]";

  const links = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "LinkedIn", value: "in/obaid", href: PROFILE.linkedin },
    { label: "Behance", value: "@obaid", href: PROFILE.behance },
  ];

  return (
    <AppChrome title="Mail" onClose={onClose} bg="#141414">
      <p className="mb-5 text-sm text-white/50">
        New Message · to {PROFILE.name}
      </p>

      <div className="relative">
        <AnimatePresence>
          {!sent ? (
            <motion.form
              key="compose"
              onSubmit={submit}
              animate={
                sending
                  ? { y: -420, opacity: 0, scale: 0.9, filter: "blur(4px)" }
                  : { y: 0, opacity: 1, scale: 1 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="space-y-3"
            >
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={field}
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
              />
              <textarea
                required
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${field} resize-none`}
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f53fc] py-3.5 font-semibold text-white active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3l18 9-18 9 4-9z" />
                </svg>
                Send
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#30d158]"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold">Message sent</h3>
              <p className="max-w-xs text-sm text-white/50">
                Thanks for reaching out — I&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-2 text-[#0f53fc]"
              >
                Compose another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* other channels */}
      <div className="mt-8">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          Other ways to reach me
        </h3>
        <div className="overflow-hidden rounded-2xl bg-white/[0.05]">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderTop: i ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <span className="text-[15px] font-medium">{l.label}</span>
              <span className="text-sm text-white/45">{l.value} ›</span>
            </a>
          ))}
        </div>
      </div>
    </AppChrome>
  );
}

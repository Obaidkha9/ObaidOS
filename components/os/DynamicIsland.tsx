"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOS } from "@/lib/store";
import { spring, formatTime, cn } from "@/lib/utils";

function Bars({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#0f53fc]"
          animate={
            playing
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={{
            duration: 0.9,
            repeat: playing ? Infinity : 0,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}

const IconBtn = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    aria-label={label}
    onClick={onClick}
    className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform active:scale-90 hover:bg-white/10"
  >
    {children}
  </button>
);

export default function DynamicIsland() {
  const mode = useOS((s) => s.islandMode);
  const expanded = useOS((s) => s.islandExpanded);
  const toggleExpanded = useOS((s) => s.toggleIslandExpanded);
  const contextLabel = useOS((s) => s.contextLabel);

  const playlist = useOS((s) => s.playlist);
  const trackIndex = useOS((s) => s.trackIndex);
  const isPlaying = useOS((s) => s.isPlaying);
  const currentTime = useOS((s) => s.currentTime);
  const duration = useOS((s) => s.duration);
  const toggle = useOS((s) => s.toggle);
  const next = useOS((s) => s.next);
  const prev = useOS((s) => s.prev);

  const track = playlist[trackIndex];
  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  const showExpanded = expanded;
  const view = showExpanded ? "expanded" : mode === "context" ? "context" : "compact";

  return (
    <div data-island className="pointer-events-none fixed left-0 right-0 top-2 z-50 hidden justify-center px-2" style={{ top: "calc(var(--safe-top) + 8px)" }}>
      <motion.div
        layout
        transition={spring.island}
        onClick={() => toggleExpanded()}
        role="button"
        tabIndex={0}
        aria-label="Dynamic Island — now playing, tap to expand"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded();
          }
        }}
        className={cn(
          "pointer-events-auto cursor-pointer overflow-hidden bg-black text-white shadow-2xl ring-1 ring-white/5",
          showExpanded ? "rounded-[34px]" : "rounded-full",
        )}
        style={{
          width: showExpanded ? "min(360px,92vw)" : view === "context" ? 210 : 148,
          height: showExpanded ? 168 : 37,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {view === "compact" && (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-full items-center justify-between px-3.5"
            >
              <div
                className="h-5 w-5 shrink-0 rounded-md"
                style={{ background: track?.artwork ?? "#0f53fc" }}
              />
              <span className="mx-2 flex-1 truncate text-[11px] font-medium text-white/70">
                {track ? track.title : "Now Playing"}
              </span>
              <Bars playing={isPlaying} />
            </motion.div>
          )}

          {view === "context" && (
            <motion.div
              key="context"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-full items-center justify-between px-3.5"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0f53fc]" />
              <span className="mx-2 flex-1 truncate text-[11px] font-medium text-white/85">
                {contextLabel ?? "Obaid OS"}
              </span>
              <Bars playing={isPlaying} />
            </motion.div>
          )}

          {view === "expanded" && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex h-full flex-col justify-between p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 shrink-0 rounded-xl shadow-lg"
                  style={{ background: track?.artwork ?? "#0f53fc" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {track?.title ?? "Not Playing"}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {track?.artist ?? "—"}
                  </p>
                </div>
                <Bars playing={isPlaying} />
              </div>

              {/* progress */}
              <div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] tabular-nums text-white/40">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <IconBtn label="Previous track" onClick={prev}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 6v12H5V6zM20 6v12l-9-6z" />
                  </svg>
                </IconBtn>
                <IconBtn label={isPlaying ? "Pause" : "Play"} onClick={toggle}>
                  {isPlaying ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </IconBtn>
                <IconBtn label="Next track" onClick={next}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 6v12h2V6zM4 6v12l9-6z" />
                  </svg>
                </IconBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

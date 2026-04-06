import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const tabTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const PinnedStorySequence = ({
  scenes,
  eyebrow,
  className = "",
  renderVisual,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  if (!scenes.length) {
    return null;
  }

  const activeScene = scenes[activeIndex];

  return (
    <section className={`relative ${className}`}>
      <div className="section-shell panel-glow relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-8">
            <p className="eyebrow">{eyebrow}</p>

            <div className="min-h-[16.5rem] sm:min-h-[20rem]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeScene.title}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 20, filter: "blur(10px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -16, filter: "blur(10px)" }
                  }
                  transition={tabTransition}
                  className="max-w-2xl"
                >
                  <p className="text-xs uppercase tracking-[0.34em] text-accentSoft/80">
                    {activeScene.kicker || `Scene ${String(activeIndex + 1).padStart(2, "0")}`}
                  </p>
                  <h2 className="mt-5 font-display text-[clamp(1.9rem,7vw,4rem)] font-semibold leading-[0.96] tracking-tight text-white sm:text-5xl xl:text-[4rem]">
                    {activeScene.title}
                  </h2>
                  <p className="mt-6 text-sm leading-7 text-muted sm:text-base">
                    {activeScene.description}
                  </p>
                </motion.article>
              </AnimatePresence>
            </div>

            <div
              role="tablist"
              aria-label={eyebrow || "Story sections"}
              className="flex flex-wrap gap-3"
            >
              {scenes.map((scene, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={scene.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition ${
                      isActive
                        ? "border-accent/35 bg-white/[0.09] text-white shadow-glow"
                        : "border-white/8 bg-white/[0.03] text-white/70 hover:border-accent/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    {scene.pill || scene.kicker || `Frame ${index + 1}`}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeScene.title}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={tabTransition}
            className="relative"
          >
            {renderVisual ? renderVisual({ activeIndex, activeScene }) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PinnedStorySequence;

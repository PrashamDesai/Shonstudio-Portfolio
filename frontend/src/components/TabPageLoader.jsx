import { motion, useReducedMotion } from "framer-motion";

import BrandBounceLoader from "./BrandBounceLoader";

const TabPageLoader = ({
  eyebrow = "Loading page",
  title = "Opening the next tab",
  message = "Bringing the next section in without dropping the layout.",
  forceAnimate = false,
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = forceAnimate || !prefersReducedMotion;

  return (
    <div className={`flex min-h-[58vh] items-center justify-center pb-24 ${className}`}>
      <div className="section-shell panel-glow relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-surface/72 px-6 py-10 sm:px-10 sm:py-12">
        <motion.div
          aria-hidden="true"
          className="absolute -left-16 top-6 h-44 w-44 rounded-full bg-accent/14 blur-3xl"
          animate={shouldAnimate ? { x: [0, 24, 0], y: [0, -16, 0] } : undefined}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-10 bottom-2 h-52 w-52 rounded-full bg-accentAlt/16 blur-3xl"
          animate={shouldAnimate ? { x: [0, -20, 0], y: [0, 14, 0] } : undefined}
          transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accentSoft">{eyebrow}</p>
          <div className="mt-5">
            <BrandBounceLoader size="lg" label={title} forceAnimate={forceAnimate} />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{message}</p>

          <div className="mt-7 flex w-full max-w-xs items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-1.5 flex-1 rounded-full bg-white/12"
                animate={
                  shouldAnimate
                    ? {
                        opacity: [0.38, 1, 0.38],
                        scaleX: [0.8, 1, 0.8],
                        backgroundColor: [
                          "rgba(255,255,255,0.12)",
                          "rgba(0,212,255,0.88)",
                          "rgba(255,255,255,0.12)",
                        ],
                      }
                    : undefined
                }
                transition={{ duration: 1.15, delay: index * 0.14, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabPageLoader;

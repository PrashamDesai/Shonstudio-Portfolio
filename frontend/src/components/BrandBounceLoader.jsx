import { motion, useReducedMotion } from "framer-motion";

import brandMark from "../assets/brand-mark.svg";

const SIZE_CLASS_MAP = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

const RING_CLASS_MAP = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-[4.25rem] w-[4.25rem]",
};

const SHADOW_CLASS_MAP = {
  sm: "h-1.5 w-10",
  md: "h-2 w-12",
  lg: "h-2.5 w-16",
};

const BrandBounceLoader = ({
  size = "md",
  label = "Loading content",
  showLabel = false,
  forceAnimate = false,
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = forceAnimate || !prefersReducedMotion;
  const markClassName = SIZE_CLASS_MAP[size] ?? SIZE_CLASS_MAP.md;
  const ringClassName = RING_CLASS_MAP[size] ?? RING_CLASS_MAP.md;
  const shadowClassName = SHADOW_CLASS_MAP[size] ?? SHADOW_CLASS_MAP.md;

  return (
    <div role="status" aria-live="polite" className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <span className="sr-only">{label}</span>

      <div className="relative flex items-end justify-center pb-2">
        <motion.span
          aria-hidden="true"
          className={`absolute rounded-full border border-white/14 bg-white/[0.02] ${ringClassName}`}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.52, 0.92, 0.52],
                  scale: [0.9, 1.05, 0.9],
                }
              : undefined
          }
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src={brandMark}
          alt=""
          aria-hidden="true"
          className={`relative z-10 object-contain ${markClassName}`}
          animate={
            shouldAnimate
              ? {
                  y: [0, -10, 0],
                  rotate: [-1.2, 1.2, -1.2],
                }
              : undefined
          }
          transition={{ duration: 0.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        />

        <motion.span
          aria-hidden="true"
          className={`absolute -bottom-0.5 rounded-full bg-white/20 blur-[1px] ${shadowClassName}`}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.32, 0.2, 0.32],
                  scaleX: [1, 0.75, 1],
                }
              : undefined
          }
          transition={{ duration: 0.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        />
      </div>

      {showLabel ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</span>
      ) : null}
    </div>
  );
};

export default BrandBounceLoader;
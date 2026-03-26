import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const SceneSection = ({
  children,
  background,
  className = "",
  panelClassName = "",
  contentClassName = "",
}) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85, 1], [0.38, 1, 1, 0.92, 0.52]),
    { stiffness: 110, damping: 24, mass: 0.4 },
  );
  const scale = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2, 0.5, 0.85, 1],
      prefersReducedMotion ? [1, 1, 1, 1, 1] : [0.965, 1, 1, 0.992, 0.98],
    ),
    { stiffness: 120, damping: 26, mass: 0.4 },
  );
  const contentY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.25, 0.75, 1],
      prefersReducedMotion ? [0, 0, 0, 0] : [56, 0, 0, -44],
    ),
    { stiffness: 120, damping: 24, mass: 0.45 },
  );
  const backgroundY = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      prefersReducedMotion ? [0, 0] : [32, -32],
    ),
    { stiffness: 90, damping: 24, mass: 0.55 },
  );

  return (
    <section ref={ref} className={`relative ${className}`}>
      <motion.div
        className={`section-shell panel-glow relative overflow-hidden ${panelClassName}`}
        style={{ opacity, scale }}
      >
        {background ? (
          <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
            {background}
          </motion.div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/10" />

        <motion.div className={`relative z-10 ${contentClassName}`} style={{ y: contentY }}>
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SceneSection;

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import brandMark from "../assets/brand-mark.svg";

const clampPointerUnit = (value) => Math.max(-1, Math.min(1, value));

const CompanyBrandHero = () => {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: prefersReducedMotion ? 260 : 120,
    damping: prefersReducedMotion ? 42 : 18,
    mass: 0.42,
  });
  const smoothY = useSpring(pointerY, {
    stiffness: prefersReducedMotion ? 260 : 120,
    damping: prefersReducedMotion ? 42 : 18,
    mass: 0.42,
  });

  const markX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-42, 42]);
  const markY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-28, 28]);
  const markRotateX = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [7, -7]);
  const markRotateY = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-9, 9]);
  const haloX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-20, 20]);
  const haloY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-14, 14]);
  const spotlightX = useTransform(smoothX, [-1, 1], [30, 70]);
  const spotlightY = useTransform(smoothY, [-1, 1], [24, 76]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(85,203,255,0.2), transparent 16%),
    radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(137,109,255,0.16), transparent 30%)
  `;

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const nextY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    pointerX.set(clampPointerUnit(nextX));
    pointerY.set(clampPointerUnit(nextY));
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative -mx-4 min-h-[calc(100vh-5rem)] overflow-hidden bg-transparent sm:-mx-6 lg:-mx-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,12,21,0.92),rgba(10,17,30,0.78)_42%,rgba(17,26,46,0.88))]" />
      <motion.div className="absolute inset-0 opacity-95" style={{ background: spotlightBackground }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,212,255,0.12),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(122,92,255,0.14),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(65,223,208,0.1),transparent_26%)]" />
      <div className="hero-grid absolute inset-0 opacity-12" />

      <motion.div
        className="absolute left-[-5%] top-[9%] h-64 w-64 rounded-full bg-accent/16 blur-3xl"
        style={{ x: haloX, y: haloY }}
      />
      <motion.div
        className="absolute bottom-[8%] right-[-3%] h-72 w-72 rounded-full bg-accentAlt/16 blur-3xl"
        style={{ x: haloX, y: haloY }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <motion.div
          style={{
            x: markX,
            y: markY,
            rotateX: markRotateX,
            rotateY: markRotateY,
            transformPerspective: 1600,
            transformStyle: "preserve-3d",
          }}
          className="will-change-transform"
        >
          <motion.img
            src={brandMark}
            alt="ShonStudio brand mark"
            className="h-[66vh] w-auto max-w-none select-none object-contain opacity-[0.95] drop-shadow-[0_0_48px_rgba(85,203,255,0.16)] sm:h-[74vh] lg:h-[84vh] xl:h-[88vh]"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -12, 0],
                    scale: [1, 1.018, 1],
                  }
            }
            transition={{
              duration: 8.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base via-base/70 to-transparent" />
    </section>
  );
};

export default CompanyBrandHero;

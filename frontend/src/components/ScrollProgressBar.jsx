import { motion, useSpring } from "framer-motion";

import { useSmoothScroll } from "../hooks/useSmoothScroll.jsx";

const ScrollProgressBar = () => {
  const { progress } = useSmoothScroll();
  const scaleX = useSpring(progress, {
    stiffness: 180,
    damping: 28,
    mass: 0.3,
  });

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[140] h-[2px] origin-left bg-theme-gradient shadow-glow"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgressBar;

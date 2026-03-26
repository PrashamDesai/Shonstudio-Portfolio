import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const isFinePointer = useMemo(
    () => window.matchMedia && window.matchMedia("(pointer: fine)").matches,
    [],
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 260, damping: 30, mass: 0.35 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 30, mass: 0.35 });

  useEffect(() => {
    if (!isFinePointer) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handleLeave);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) {
    return null;
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[130] h-3 w-3 rounded-full bg-accent shadow-glow"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[129] flex items-center justify-center rounded-full border border-white/15 bg-surface/50 backdrop-blur-xl"
        animate={{
          width: 28,
          height: 28,
          opacity: visible ? 1 : 0,
          borderColor: "rgb(var(--border-rgb) / 0.72)",
          backgroundColor: "rgb(var(--surface-rgb) / 0.56)",
          boxShadow: "0 0 10px rgb(var(--accent-primary-rgb) / 0.12)",
        }}
        transition={{ type: "spring", stiffness: 190, damping: 24 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
};

export default CustomCursor;

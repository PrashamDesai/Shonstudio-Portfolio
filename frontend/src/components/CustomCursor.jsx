import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");
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

    const interactiveSelector =
      'a, button, input, textarea, [data-cursor="link"], [data-cursor="large"]';

    const handlePointerMove = (event) => {
      const target = event.target.closest(interactiveSelector);

      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);
      setHovered(Boolean(target));
      setLabel(target?.getAttribute("data-cursor-label") || "");
    };

    const handleLeave = () => {
      setVisible(false);
      setLabel("");
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
          width: hovered ? 84 : 28,
          height: hovered ? 84 : 28,
          opacity: visible ? 1 : 0,
          borderColor: hovered ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.16)",
          backgroundColor: hovered ? "rgba(10,10,15,0.88)" : "rgba(26,26,38,0.42)",
          boxShadow: hovered
            ? "0 0 20px rgba(0,212,255,0.24), 0 0 24px rgba(122,92,255,0.18)"
            : "0 0 10px rgba(0,212,255,0.08)",
        }}
        transition={{ type: "spring", stiffness: 190, damping: 24 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.span
          animate={{ opacity: hovered && label ? 1 : 0, scale: hovered && label ? 1 : 0.8 }}
          className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accentSoft"
        >
          {label}
        </motion.span>
      </motion.div>
    </>
  );
};

export default CustomCursor;

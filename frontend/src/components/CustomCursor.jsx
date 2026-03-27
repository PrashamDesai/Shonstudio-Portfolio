import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [cursorColor, setCursorColor] = useState(() => {
    if (typeof window === "undefined") return "rgb(145, 163, 201)";
    const computedStyle = getComputedStyle(document.documentElement);
    const borderRgb = computedStyle.getPropertyValue("--border-rgb").trim();
    return borderRgb ? `rgb(${borderRgb})` : "rgb(145, 163, 201)";
  });
  const [surfaceColor, setSurfaceColor] = useState(() => {
    if (typeof window === "undefined") return "rgb(20, 27, 40)";
    const computedStyle = getComputedStyle(document.documentElement);
    const surfaceRgb = computedStyle.getPropertyValue("--surface-rgb").trim();
    return surfaceRgb ? `rgb(${surfaceRgb})` : "rgb(20, 27, 40)";
  });

  const isFinePointer = useMemo(
    () => window.matchMedia && window.matchMedia("(pointer: fine)").matches,
    [],
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 260, damping: 30, mass: 0.35 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 30, mass: 0.35 });

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const borderRgb = computedStyle.getPropertyValue("--border-rgb").trim();
      const surfaceRgb = computedStyle.getPropertyValue("--surface-rgb").trim();
      if (borderRgb) setCursorColor(`rgb(${borderRgb})`);
      if (surfaceRgb) setSurfaceColor(`rgb(${surfaceRgb})`);
    };

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

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
        className="pointer-events-none fixed left-0 top-0 z-[10001] h-3 w-3 rounded-full bg-accent shadow-glow"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] flex items-center justify-center rounded-full border backdrop-blur-xl"
        animate={{
          width: 28,
          height: 28,
          opacity: visible ? 1 : 0,
          borderColor: `rgba(${cursorColor.match(/\d+, \d+, \d+/)?.[0] || "145, 163, 201"}, 0.72)`,
          backgroundColor: `rgba(${surfaceColor.match(/\d+, \d+, \d+/)?.[0] || "20, 27, 40"}, 0.56)`,
          boxShadow: "0 0 10px rgba(85, 203, 255, 0.12)",
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

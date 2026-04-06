import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_CURSOR_RGB = "145, 163, 201";
const DEFAULT_SURFACE_RGB = "20, 27, 40";
const CURSOR_MEDIA_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const normalizeRgb = (value, fallback) => {
  const normalizedValue = String(value || "")
    .trim()
    .replace(/\s+/g, ", ");

  return normalizedValue || fallback;
};

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [isMouseInputActive, setIsMouseInputActive] = useState(false);
  const [cursorRgb, setCursorRgb] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_CURSOR_RGB;
    }

    const computedStyle = getComputedStyle(document.documentElement);
    return normalizeRgb(computedStyle.getPropertyValue("--border-rgb"), DEFAULT_CURSOR_RGB);
  });
  const [surfaceRgb, setSurfaceRgb] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SURFACE_RGB;
    }

    const computedStyle = getComputedStyle(document.documentElement);
    return normalizeRgb(computedStyle.getPropertyValue("--surface-rgb"), DEFAULT_SURFACE_RGB);
  });

  const isEligibleDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.(CURSOR_MEDIA_QUERY).matches,
    [],
  );
  const [isCursorCapableDevice, setIsCursorCapableDevice] = useState(isEligibleDevice);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 260, damping: 30, mass: 0.35 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 30, mass: 0.35 });

  const isCustomCursorEnabled = isCursorCapableDevice && isMouseInputActive;

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(CURSOR_MEDIA_QUERY);
    const handleChange = (event) => {
      setIsCursorCapableDevice(event.matches);
    };

    setIsCursorCapableDevice(mediaQueryList.matches);

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const updateColors = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setCursorRgb(normalizeRgb(computedStyle.getPropertyValue("--border-rgb"), DEFAULT_CURSOR_RGB));
      setSurfaceRgb(normalizeRgb(computedStyle.getPropertyValue("--surface-rgb"), DEFAULT_SURFACE_RGB));
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isCustomCursorEnabled) {
      document.body?.removeAttribute("data-custom-cursor");
      return undefined;
    }

    document.body?.setAttribute("data-custom-cursor", "enabled");

    return () => {
      document.body?.removeAttribute("data-custom-cursor");
    };
  }, [isCustomCursorEnabled]);

  useEffect(() => {
    if (!isCursorCapableDevice) {
      setVisible(false);
      setIsMouseInputActive(false);
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        setVisible(false);
        setIsMouseInputActive(false);
        return;
      }

      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setIsMouseInputActive(true);
      setVisible(true);
    };

    const handleMouseMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setIsMouseInputActive(true);
      setVisible(true);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        setVisible(false);
        setIsMouseInputActive(false);
      }
    };

    const handleLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("blur", handleLeave);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [isCursorCapableDevice, mouseX, mouseY]);

  if (!isCursorCapableDevice || !isMouseInputActive) {
    return null;
  }

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10001] h-3 w-3 rounded-full bg-accent shadow-glow"
        animate={{
          opacity: visible ? 1 : 0,
          marginLeft: -6,
          marginTop: -6,
        }}
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] rounded-full border backdrop-blur-xl"
        animate={{
          width: 28,
          height: 28,
          opacity: visible ? 1 : 0,
          marginLeft: -14,
          marginTop: -14,
          borderColor: `rgba(${cursorRgb}, 0.72)`,
          backgroundColor: `rgba(${surfaceRgb}, 0.56)`,
          boxShadow: "0 0 10px rgba(85, 203, 255, 0.12)",
        }}
        transition={{ type: "spring", stiffness: 190, damping: 24 }}
        style={{
          x: ringX,
          y: ringY,
        }}
      />
    </>
  );
};

export default CustomCursor;

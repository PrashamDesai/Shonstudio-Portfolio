import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { motionValue } from "framer-motion";

const SmoothScrollContext = createContext(null);

export const SmoothScrollProvider = ({ children }) => {
  const smoothY = useMemo(() => motionValue(0), []);
  const progress = useMemo(() => motionValue(0), []);
  const frameRef = useRef(0);

  useEffect(() => {
    let current = window.scrollY;
    let target = window.scrollY;

    const updateTarget = () => {
      target = window.scrollY;
    };

    const update = () => {
      current += (target - current) * 0.12;

      if (Math.abs(target - current) < 0.1) {
        current = target;
      }

      smoothY.set(current);

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );

      progress.set(current / maxScroll);
      frameRef.current = window.requestAnimationFrame(update);
    };

    updateTarget();
    frameRef.current = window.requestAnimationFrame(update);

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [progress, smoothY]);

  return (
    <SmoothScrollContext.Provider value={{ smoothY, progress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  }

  return context;
};

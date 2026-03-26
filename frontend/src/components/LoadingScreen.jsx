import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import studioLogo from "../assets/ShonStudio Logo.svg";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return Math.min(current + Math.floor(Math.random() * 18) + 6, 100);
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-base"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"], y: ["0%", "-6%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[22%] h-48 w-48 rounded-full bg-accent/12 blur-3xl"
        />
        <motion.div
          animate={{ x: ["10%", "-8%", "10%"], y: ["0%", "8%", "0%"] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[16%] right-[12%] h-56 w-56 rounded-full bg-accentAlt/16 blur-3xl"
        />
      </div>

      <div className="w-full max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="space-y-5 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-mutedDeep">ShonStudio</p>
            <div className="space-y-3">
              <motion.div
                initial={{ scaleX: 0.92, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-fit overflow-hidden"
              >
                <img
                  src={studioLogo}
                  alt="ShonStudio logo"
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                />
              </motion.div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                Designing and developing next-gen game experiences.
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {/* <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  className="h-1.5 rounded-full bg-white/8"
                  initial={{ opacity: 0.2, scaleX: 0.6 }}
                  animate={{
                    opacity: progress / 20 > index ? 1 : 0.2,
                    scaleX: progress / 20 > index ? 1 : 0.6,
                    backgroundColor:
                      progress / 20 > index ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div> */}

            <div className="overflow-hidden rounded-full border border-white/10 bg-elevated/70 p-1 shadow-glow">
              <motion.div
                className="h-2 rounded-full bg-theme-gradient"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
          </div>

          <div className="grid gap-4 text-xs uppercase tracking-[0.3em] text-mutedDeep sm:grid-cols-3">
            <span>Initializing</span>
            <span className="text-center text-muted">{progress}%</span>
            <span className="text-right">Entering World</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

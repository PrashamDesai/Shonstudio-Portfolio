import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const Timeline = ({ items = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressHeight = useMemo(() => {
    if (items.length <= 1) {
      return "0%";
    }

    return `${(activeIndex / (items.length - 1)) * 100}%`;
  }, [activeIndex, items.length]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="relative pl-10 sm:pl-14">
      <div className="absolute left-[15px] top-4 h-[calc(100%-2rem)] w-px bg-white/10 sm:left-[19px]" />
      <motion.div
        className="absolute left-[14px] top-4 w-[3px] rounded-full bg-theme-gradient shadow-glow sm:left-[18px]"
        animate={{ height: progressHeight }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.article
              key={`${item.date}-${item.title}`}
              initial={{ opacity: 0, x: 24, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onViewportEnter={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className="group relative"
            >
              <motion.span
                className={`absolute left-[-29px] top-4 h-4 w-4 rounded-full border sm:left-[-39px] ${
                  isActive
                    ? "border-accent bg-accent shadow-[0_0_24px_rgba(0,212,255,0.45)]"
                    : "border-white/14 bg-base"
                }`}
                animate={{ scale: isActive ? 1.08 : 1, opacity: isActive ? 1 : 0.82 }}
                transition={{ duration: 0.25 }}
              />

              <div
                className={`section-shell panel-glow relative overflow-hidden px-6 py-6 sm:px-7 ${
                  isActive ? "border-accent/22 shadow-glow" : ""
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(122,92,255,0.12),transparent_24%)] opacity-80" />
                <div className="relative z-10 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">{item.date}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

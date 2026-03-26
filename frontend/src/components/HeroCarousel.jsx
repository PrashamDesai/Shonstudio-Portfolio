import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import { useCarouselLogic } from "../hooks/useCarouselLogic";

const categoryPath = {
  projects: (item) => (item?.slug || item?.id ? `/projects/${item?.slug || item?.id}` : "/projects"),
  services: (item) => (item?.slug || item?.id ? `/services/${item?.slug || item?.id}` : "/services"),
  training: (item) => (item?.slug || item?.id ? `/training/${item?.slug || item?.id}` : "/training"),
  tools: (item) => (item?.slug || item?.id ? `/tools/${item?.slug || item?.id}` : "/tools"),
};

const getTargetPath = (categoryKey, item) => categoryPath[categoryKey]?.(item) || "/";

const HeroCarousel = ({ categories = [] }) => {
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const {
    activeCategory,
    activeItem,
    activeItemIndex,
    categoryProgress,
  } = useCarouselLogic({ categories, paused });

  const activePath = useMemo(
    () => getTargetPath(activeCategory?.key, activeItem),
    [activeCategory?.key, activeItem],
  );

  useEffect(() => {
    if (!activeCategory?.items?.length) {
      return;
    }

    const nextIndex = (activeItemIndex + 1) % activeCategory.items.length;
    const nextItem = activeCategory.items[nextIndex];

    if (!nextItem) {
      return;
    }

    const image = new window.Image();
    image.src = resolveMedia(nextItem.carouselImage);
  }, [activeCategory, activeItemIndex]);

  if (!activeCategory || !activeItem) {
    return null;
  }

  const cardKey = `${activeCategory.key}-${activeItem.id}`;

  return (
    <div
      className="section-shell panel-glow relative h-full min-h-[16rem] overflow-hidden rounded-[1.95rem] border border-white/10 bg-white/[0.03]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link
        to={activePath}
        data-cursor="link"
        data-cursor-label="Open"
        className="absolute inset-0 z-20"
        aria-label={`Open ${activeItem.title}`}
      />

      <AnimatePresence mode="wait">
        <motion.img
          key={cardKey}
          src={resolveMedia(activeItem.carouselImage)}
          alt={activeItem.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={prefersReducedMotion ? { opacity: 0.98 } : { opacity: 0, scale: 1.01 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1.05,
                }
          }
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          transition={{
            opacity: { duration: prefersReducedMotion ? 0.2 : 0.65, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 2.8, ease: "linear" },
          }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/82 via-black/34 to-black/8" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/35 to-transparent" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${cardKey}-text`}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-5 sm:px-6 sm:pb-6"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.34em] text-white/78">{activeCategory.label}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {activeItem.title}
          </h3>
          <p className="mt-2 max-w-[34ch] text-sm leading-6 text-white/82 sm:text-[0.95rem]">
            {activeItem.shortDescription}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[3px] bg-white/12">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-accent via-accentSoft to-accentAlt"
          animate={{ scaleX: categoryProgress }}
          transition={{ duration: 0.12, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;

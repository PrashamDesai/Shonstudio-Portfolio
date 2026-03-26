import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { resolveMedia } from "../assets/mediaMap";

const AUTO_SCROLL_DIRECTION = 1;
const AUTO_SCROLL_INTERVAL_MS = 3600;

const HeroShowcaseCarousel = ({ items = [] }) => {
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const scrollToIndex = (index, behavior = "smooth") => {
    const viewport = viewportRef.current;

    if (!viewport || !items.length) {
      return;
    }

    const nextIndex = (index + items.length) % items.length;
    const slide = slideRefs.current[nextIndex];

    if (!slide) {
      return;
    }

    viewport.scrollTo({
      left: slide.offsetLeft,
      behavior: prefersReducedMotion ? "auto" : behavior,
    });
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      scrollToIndex(activeIndex + AUTO_SCROLL_DIRECTION);
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [activeIndex, items.length, prefersReducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const handleScroll = () => {
      const nearestIndex = slideRefs.current.reduce((closestIndex, slide, index) => {
        if (!slide) {
          return closestIndex;
        }

        const closestSlide = slideRefs.current[closestIndex];
        const currentDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        const closestDistance = closestSlide
          ? Math.abs(closestSlide.offsetLeft - viewport.scrollLeft)
          : Number.POSITIVE_INFINITY;

        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);

      setActiveIndex(nearestIndex);
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  const handleWheel = (event) => {
    const viewport = viewportRef.current;

    if (!viewport || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    viewport.scrollBy({
      left: event.deltaY,
      behavior: "auto",
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full min-h-0 flex-col">
        <div
          ref={viewportRef}
          onWheel={handleWheel}
          className="flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <motion.article
              key={item.slug}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              initial={prefersReducedMotion ? false : { opacity: 0.85, scale: 0.985 }}
              animate={{ opacity: index === activeIndex ? 1 : 0.82, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full min-w-full snap-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-base/55"
            >
              <img
                src={resolveMedia(item.heroImage || item.coverImage)}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/46 to-transparent p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-accentSoft">
                    Frame 0{index + 1}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80">
                    {item.technologies?.[0] || "Showcase"}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-[1.9rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/78">{item.tagline}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={`${item.slug}-dot`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? "w-8 bg-accent shadow-glow" : "w-2.5 bg-white/22"
              }`}
              aria-label={`Go to showcase slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroShowcaseCarousel;

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import { useCarouselLogic } from "../hooks/useCarouselLogic";

const categoryPath = {
  projects: (item) => (item?.slug || item?.id ? `/projects/${item?.slug || item?.id}` : "/projects"),
  services: (item) => (item?.slug || item?.id ? `/services/${item?.slug || item?.id}` : "/services"),
  training: (item) => (item?.slug || item?.id ? `/training/${item?.slug || item?.id}` : "/training"),
  tools: (item) => (item?.categorySlug ? `/tools/category/${item.categorySlug}` : "/tools"),
};

const getTargetPath = (categoryKey, item) => categoryPath[categoryKey]?.(item) || "/";

const HeroCarousel = ({ categories = [] }) => {
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const {
    activeCategory,
    activeItem,
    activeItemIndex,
    nextItem,
  } = useCarouselLogic({ categories, paused });

  const activePath = useMemo(
    () => getTargetPath(activeCategory?.key, activeItem),
    [activeCategory?.key, activeItem],
  );

  // Track which image URLs have been fully decoded and are ready for instant display
  const decodedUrls = useRef(new Set());
  const [, forceRender] = useState(0);

  // Resolve src for current and next items
  const activeSrc = activeItem?.carouselImage ? resolveMedia(activeItem.carouselImage) : null;
  const nextSrc = nextItem?.carouselImage ? resolveMedia(nextItem.carouselImage) : null;

  const markDecoded = useCallback((url) => {
    if (!url || decodedUrls.current.has(url)) {
      return;
    }

    decodedUrls.current.add(url);

    while (decodedUrls.current.size > 8) {
      const oldestUrl = decodedUrls.current.values().next().value;
      decodedUrls.current.delete(oldestUrl);
    }
  }, []);

  const preDecodeImage = useCallback((url, onSettled) => {
    if (!url) {
      return;
    }

    if (decodedUrls.current.has(url)) {
      onSettled?.();
      return;
    }

    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
    const finalize = () => {
      markDecoded(url);
      onSettled?.();
    };

    if (typeof img.decode === "function") {
      img.decode().then(finalize).catch(finalize);
      return;
    }

    img.onload = finalize;
    img.onerror = finalize;
  }, [markDecoded]);

  useEffect(() => {
    if (nextSrc) {
      preDecodeImage(nextSrc);
    }
  }, [nextSrc, preDecodeImage]);

  useEffect(() => {
    if (!activeSrc) {
      return;
    }

    preDecodeImage(activeSrc, () => {
      forceRender((value) => value + 1);
    });
  }, [activeSrc, preDecodeImage]);

  if (!activeCategory || !activeItem) {
    return null;
  }

  const cardKey = `${activeCategory.key}-${activeItem.id}`;
  const isImageReady = activeSrc && decodedUrls.current.has(activeSrc);

  return (
    <div
      className="section-shell panel-glow relative h-full min-h-[14.5rem] overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] max-[480px]:min-h-[14rem] sm:min-h-[16rem] sm:rounded-[1.95rem]"
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

      {/* Crossfade: new image mounts immediately on top, old one fades out underneath */}
      <AnimatePresence mode="sync">
        <motion.img
          key={cardKey}
          src={activeSrc}
          alt={activeItem.title}
          className="absolute inset-0 h-full w-full object-cover"
          // Start fully visible if pre-decoded, otherwise do a quick 150ms fade
          initial={
            prefersReducedMotion || isImageReady
              ? { opacity: 1 }
              : { opacity: 0, scale: 1.01 }
          }
          animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.05 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
          transition={{
            opacity: { duration: prefersReducedMotion ? 0.05 : 0.15, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 2.8, ease: "linear" },
          }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${cardKey}-text`}
          className="theme-image-caption pointer-events-none absolute -inset-x-px -bottom-px z-30 min-h-[5.6rem] overflow-hidden p-3 backdrop-blur-md max-[480px]:min-h-[5.2rem] sm:min-h-[7rem] sm:overflow-visible sm:p-6"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-full flex-col justify-end">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/78 sm:text-[11px] sm:tracking-[0.30em]">{activeCategory.label}</p>
            <h3 className="mt-1 truncate font-display text-base font-semibold leading-tight text-white sm:mt-2 sm:whitespace-normal sm:text-3xl">
              {activeItem.title}
            </h3>
            <p className="mt-2 hidden max-w-[100ch] text-[13px] leading-6 text-white/82 sm:block sm:text-[0.95rem]">
              {activeItem.shortDescription}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default HeroCarousel;

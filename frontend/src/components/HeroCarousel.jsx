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

  // Pre-decode a single image URL, mark it as ready when done
  const preDecodeImage = useCallback((url) => {
    if (!url || decodedUrls.current.has(url)) return;
    const img = new window.Image();
    img.src = url;
    // decode() resolves once the browser has the pixels ready to paint
    img.decode().then(() => {
      decodedUrls.current.add(url);
    }).catch(() => {
      // Still mark as "decoded" so we don't retry forever on broken URLs
      decodedUrls.current.add(url);
    });
  }, []);

  // On mount: eagerly pre-decode ALL carousel images so every slide is instant
  useEffect(() => {
    categories.forEach((category) => {
      category?.items?.forEach((item) => {
        if (item?.carouselImage) {
          preDecodeImage(resolveMedia(item.carouselImage));
        }
      });
    });
  }, [categories, preDecodeImage]);

  // Aggressively pre-decode the NEXT image whenever it changes
  useEffect(() => {
    if (nextSrc) preDecodeImage(nextSrc);
  }, [nextSrc, preDecodeImage]);

  // Pre-decode the active image and force re-render once ready (handles first load)
  useEffect(() => {
    if (!activeSrc || decodedUrls.current.has(activeSrc)) return;
    const img = new window.Image();
    img.src = activeSrc;
    img.decode().then(() => {
      decodedUrls.current.add(activeSrc);
      forceRender((n) => n + 1);
    }).catch(() => {
      decodedUrls.current.add(activeSrc);
      forceRender((n) => n + 1);
    });
  }, [activeSrc]);

  if (!activeCategory || !activeItem) {
    return null;
  }

  const cardKey = `${activeCategory.key}-${activeItem.id}`;
  // Image is ready if it has been pre-decoded (no visible loading flash)
  const isImageReady = activeSrc && decodedUrls.current.has(activeSrc);

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

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/82 via-black/34 to-black/8" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/35 to-transparent" />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${cardKey}-text`}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-black/50 backdrop-blur-md p-5 sm:p-6"
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

    </div>
  );
};

export default HeroCarousel;

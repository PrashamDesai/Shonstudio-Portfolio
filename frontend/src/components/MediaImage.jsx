import { useEffect, useRef, useState } from "react";

import BrandBounceLoader from "./BrandBounceLoader";

const VIEWPORT_PRELOAD_MARGIN = "280px 0px";

const MediaImage = ({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  skeletonClassName = "",
  fallbackClassName = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  sizes,
  draggable = false,
  transitionDurationMs = 700,
  deferUntilInView,
  rootMargin = VIEWPORT_PRELOAD_MARGIN,
  forceLoaderAnimation = false,
}) => {
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const shouldDeferLoad = deferUntilInView ?? (loading === "lazy" && fetchPriority !== "high");
  const [shouldLoad, setShouldLoad] = useState(() => !shouldDeferLoad);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setShouldLoad(!shouldDeferLoad);
  }, [shouldDeferLoad, src]);

  useEffect(() => {
    if (!src || !shouldDeferLoad || shouldLoad) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const nextEntry = entries[0];

        if (!nextEntry?.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      {
        rootMargin,
      },
    );

    const currentWrapper = wrapperRef.current;

    if (currentWrapper) {
      observer.observe(currentWrapper);
    } else {
      setShouldLoad(true);
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, [rootMargin, shouldDeferLoad, shouldLoad, src]);

  useEffect(() => {
    const currentImage = imageRef.current;

    if (!shouldLoad || !currentImage || !currentImage.complete || !currentImage.currentSrc) {
      return;
    }

    setIsLoaded(true);
  }, [shouldLoad, src]);

  const effectiveLoading = shouldDeferLoad ? "eager" : loading;
  const effectiveFetchPriority = shouldDeferLoad ? "low" : fetchPriority;

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-white/[0.04] ${wrapperClassName}`}
    >
      {!isLoaded && !hasError ? (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.14),rgba(255,255,255,0.04))] ${skeletonClassName}`}
          aria-hidden="true"
        >
          <BrandBounceLoader
            size="sm"
            label="Loading image"
            forceAnimate={forceLoaderAnimation}
            className="pointer-events-none opacity-85"
          />
        </div>
      ) : null}

      {hasError ? (
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-muted ${fallbackClassName}`}
        >
          Image unavailable
        </div>
      ) : null}

      {shouldLoad ? (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={effectiveLoading}
          decoding={decoding}
          fetchpriority={effectiveFetchPriority}
          sizes={sizes}
          draggable={draggable}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{ transitionDuration: `${transitionDurationMs}ms` }}
          className={`${imgClassName} transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            hasError
              ? "opacity-0"
              : isLoaded
                ? "scale-100 blur-0 opacity-100"
                : "scale-[1.02] blur-sm opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
};

export default MediaImage;

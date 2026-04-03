import { useEffect, useState } from "react";

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
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-white/[0.04] ${wrapperClassName}`}>
      {!isLoaded && !hasError ? (
        <div
          className={`absolute inset-0 animate-pulse bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.14),rgba(255,255,255,0.04))] ${skeletonClassName}`}
          aria-hidden="true"
        />
      ) : null}

      {hasError ? (
        <div
          className={`absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-muted ${fallbackClassName}`}
        >
          Image unavailable
        </div>
      ) : null}

      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchpriority={fetchPriority}
        sizes={sizes}
        draggable={draggable}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ transitionDuration: `${transitionDurationMs}ms` }}
        className={`${imgClassName} transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hasError ? "opacity-0" : isLoaded ? "scale-100 blur-0 opacity-100" : "scale-[1.02] blur-sm opacity-0"
        }`}
      />
    </div>
  );
};

export default MediaImage;

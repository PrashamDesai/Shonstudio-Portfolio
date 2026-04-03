import heroGrid from "./hero-grid.svg";
import aurora from "./project-aurora.svg";
import mech from "./project-mech.svg";
import pulse from "./project-pulse.svg";
import environment from "./tool-environment.svg";
import dialogue from "./tool-dialogue.svg";
import audio from "./tool-audio.svg";
import { getApiBase } from "../utils/apiBase.js";

const mediaMap = {
  hero: heroGrid,
  "aurora-drift": aurora,
  "aurora-drift-detail": aurora,
  "aurora-drift-ui": aurora,
  "mech-siege-tactics": mech,
  "mech-siege-hud": mech,
  "mech-siege-mission": mech,
  "pulse-xr-lab": pulse,
  "pulse-xr-interface": pulse,
  "pulse-xr-training": pulse,
  "team-rhea-dev": aurora,
  "team-arjun-dev": pulse,
  "team-nisha-dev": mech,
  "team-aanya-design": aurora,
  "team-vihaan-design": pulse,
  "team-meera-design": mech,
  "modular-environment-kit": environment,
  "adaptive-dialogue-builder": dialogue,
  "audio-moodboard-library": audio,
};

const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const MEDIA_FILE_PATTERN = /\.(avif|bmp|gif|ico|jpe?g|jfif|png|svg|webp)$/i;

const getBackendOrigin = () => {
  const apiBase = String(getApiBase() || "").trim();

  if (!/^https?:\/\//i.test(apiBase)) {
    return "";
  }

  return apiBase.replace(/\/api\/?$/i, "");
};

const looksLikeMediaPath = (value) =>
  typeof value === "string" &&
  (value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.includes("\\") ||
    value.includes("/") ||
    MEDIA_FILE_PATTERN.test(value));

const resolveDynamicMediaSource = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("blob:") ||
    normalizedValue.startsWith("//") ||
    ABSOLUTE_URL_PATTERN.test(normalizedValue)
  ) {
    return normalizedValue;
  }

  if (!looksLikeMediaPath(normalizedValue)) {
    return "";
  }

  const normalizedPath = normalizedValue.replace(/\\/g, "/");
  const pathWithoutLeadingDots = normalizedPath.replace(/^\.?\//, "");
  const absolutePath = pathWithoutLeadingDots.startsWith("/")
    ? pathWithoutLeadingDots
    : `/${pathWithoutLeadingDots}`;
  const backendOrigin = getBackendOrigin();

  return backendOrigin ? `${backendOrigin}${absolutePath}` : absolutePath;
};

export const resolveMedia = (key) => {
  if (!key) {
    return heroGrid;
  }

  if (typeof key === "string") {
    const normalizedKey = key.trim();
    const dynamicSource = resolveDynamicMediaSource(normalizedKey);

    if (dynamicSource) {
      return dynamicSource;
    }

    if (mediaMap[normalizedKey]) {
      return mediaMap[normalizedKey];
    }
  }

  return mediaMap[key] || heroGrid;
};

export { heroGrid };

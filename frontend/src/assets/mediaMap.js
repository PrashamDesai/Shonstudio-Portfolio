import heroGrid from "./hero-grid.svg";
import aurora from "./project-aurora.svg";
import mech from "./project-mech.svg";
import pulse from "./project-pulse.svg";
import environment from "./tool-environment.svg";
import dialogue from "./tool-dialogue.svg";
import audio from "./tool-audio.svg";

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

export const resolveMedia = (key) => {
  if (!key) {
    return heroGrid;
  }

  if (
    typeof key === "string" &&
    (key.startsWith("data:") || key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/"))
  ) {
    return key;
  }

  return mediaMap[key] || heroGrid;
};

export { heroGrid };

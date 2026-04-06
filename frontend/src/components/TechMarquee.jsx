import { useReducedMotion } from "framer-motion";
import {
  SiAndroid,
  SiApple,
  SiClaude,
  SiGooglegemini,
  SiIos,
  SiMeta,
  SiOculus,
  SiOpenai,
  SiSharp,
  SiUnity,
} from "react-icons/si";

const CursorLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M12 2.2 20.3 7v10L12 21.8 3.7 17V7L12 2.2Z"
      fill="currentColor"
      opacity="0.28"
    />
    <path
      d="M12 2.2 3.7 7l8.3 4.8L20.3 7 12 2.2Z"
      fill="currentColor"
      opacity="0.5"
    />
    <path
      d="M3.7 7v10l8.3 4.8v-10L3.7 7Z"
      fill="currentColor"
      opacity="0.42"
    />
    <path
      d="M20.3 7v10L12 21.8v-10L20.3 7Z"
      fill="currentColor"
      opacity="0.34"
    />
    <path
      d="M7.5 8.25 13.15 13.9l-2.65.38 1.1 3.95 1.65-.48-1.12-3.9 3.95-1.12L7.5 8.25Z"
      fill="rgb(255 255 255 / 0.88)"
    />
  </svg>
);

const logoComponents = {
  unity: SiUnity,
  csharp: SiSharp,
  meta: SiMeta,
  oculus: SiOculus,
  appleVisionPro: SiApple,
  gemini: SiGooglegemini,
  claude: SiClaude,
  codex: SiOpenai,
  chatgpt: SiOpenai,
  cursor: CursorLogo,
  ios: SiIos,
  android: SiAndroid,
};

const TechMarquee = ({ items = [] }) => {
  const prefersReducedMotion = useReducedMotion();
  const loopItems = [...items, ...items];
  const renderLogo = (item) => {
    const LogoComponent = logoComponents[item.logo] || SiOpenai;
    return <LogoComponent />;
  };

  if (!items.length) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <div className="tech-marquee section-shell panel-glow relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {items.map((item) => (
            <div key={item.name} className="tech-logo-pill">
              <span className="tech-logo-mark">{renderLogo(item)}</span>
              <span className="tech-logo-label">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tech-marquee section-shell panel-glow relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-base via-base/80 to-transparent min-[420px]:block sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-base via-base/80 to-transparent min-[420px]:block sm:w-20" />
      <div className="tech-marquee-track">
        {loopItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="tech-logo-pill">
            <span className="tech-logo-mark">{renderLogo(item)}</span>
            <span className="tech-logo-label">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;

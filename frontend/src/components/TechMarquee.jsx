import { useReducedMotion } from "framer-motion";

const TechMarquee = ({ items = [] }) => {
  const prefersReducedMotion = useReducedMotion();
  const loopItems = [...items, ...items];

  if (!items.length) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <div key={item.name} className="tech-logo-pill">
              <span className="tech-logo-mark">{item.mark}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tech-marquee section-shell panel-glow relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-base via-base/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-base via-base/80 to-transparent" />
      <div className="tech-marquee-track">
        {loopItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="tech-logo-pill">
            <span className="tech-logo-mark">{item.mark}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;

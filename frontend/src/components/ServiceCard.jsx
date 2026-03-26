import { motion } from "framer-motion";

import studioLogo from "../assets/ShonStudio Logo.svg";
import AdminEntityActions from "./AdminEntityActions";

const iconMap = {
  grid: "[]",
  layers: ":::",
  cube: "3D",
  orbit: "XR",
  book: "ED",
  shield: "QA",
  wave: "AU",
  spark: "AD",
};

const ServiceCard = ({ service, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative flex h-full flex-col justify-between p-6 transition duration-300 hover:shadow-hoverGlow"
    data-cursor="large"
    data-cursor-label="Open"
  >
    {adminActions ? <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} /> : null}
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/20 bg-[linear-gradient(135deg,rgba(0,212,255,0.12),rgba(122,92,255,0.12))] text-xs font-semibold uppercase tracking-[0.2em] text-accent shadow-glow">
          {iconMap[service.icon] ? (
            iconMap[service.icon]
          ) : (
            <img src={studioLogo} alt="ShonStudio logo" className="h-6 w-6 object-contain" />
          )}
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-mutedDeep">{service.category}</span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
          {service.title}
        </h3>
        <p className="text-sm leading-7 text-muted">{service.summary}</p>
      </div>

      <div className="space-y-2">
        {service.highlights?.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-8 border-t border-white/8 pt-4 text-sm text-mutedDeep">
      Delivery format: <span className="text-muted">{service.deliveryFormat}</span>
    </div>
  </motion.article>
);

export default ServiceCard;

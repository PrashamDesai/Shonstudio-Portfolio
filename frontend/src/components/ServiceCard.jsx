import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
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
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative flex h-full flex-col overflow-hidden transition duration-300 hover:shadow-hoverGlow"
    data-cursor="large"
    data-cursor-label="Open"
  >
    {adminActions ? <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} /> : null}
    <Link
      to={`/services/${service.slug}`}
      className="flex flex-col sm:flex-row h-full sm:h-72 w-full text-left"
      data-cursor="link"
      data-cursor-label="Open"
      aria-label={`Open ${service.title}`}
    >
      <div className="relative overflow-hidden border-b border-white/10 sm:w-1/4 sm:border-b-0 sm:border-r">
        <motion.img
          src={resolveMedia(service.cardImage)}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.07, y: -4 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/55 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:w-3/4 justify-center">
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/20 bg-[linear-gradient(135deg,rgba(0,212,255,0.12),rgba(122,92,255,0.12))] text-xs font-semibold uppercase tracking-[0.2em] text-accent shadow-glow">
            {iconMap[service.icon] || "SV"}
          </span>
          <span className="text-xs uppercase tracking-[0.28em] text-mutedDeep">{service.category}</span>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
            {service.title}
          </h3>
          <p className="text-sm leading-7 text-muted">{service.shortDescription || service.summary}</p>
        </div>

        <div className="mt-5 space-y-2">
          {(service.highlights || []).slice(0, 3).map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-white/8 pt-4 text-sm text-mutedDeep">
          Delivery format: <span className="text-muted">{service.deliveryFormat}</span>
        </div>
      </div>
    </Link>
  </motion.article>
);

export default ServiceCard;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "./AdminEntityActions";

const getServicePath = (service) => {
  const serviceIdentifier = service?.slug || service?._id;
  return serviceIdentifier ? `/services/${serviceIdentifier}` : "/services";
};

const ServiceCard = ({ service, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative flex h-full flex-col overflow-hidden transition duration-300"
    data-cursor="large"
    data-cursor-label="Open"
  >
    {adminActions ? <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} /> : null}
    <Link
      to={getServicePath(service)}
      className="flex h-full w-full flex-col text-left sm:h-72 sm:flex-row"
      data-cursor="link"
      data-cursor-label="Open"
      aria-label={`Open ${service.title || "service"}`}
    >
      <div className="relative h-52 overflow-hidden border-b border-white/10 sm:h-auto sm:w-1/4 sm:border-b-0 sm:border-r">
        <motion.img
          src={resolveMedia(service.cardImage || service.carouselImage)}
          alt={service.title || "Service"}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.07, y: -4 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="theme-image-static-scrim absolute inset-0" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:w-3/4 sm:gap-4 sm:p-6">
        {service.category ? (
          <p className="text-xs uppercase tracking-[0.28em] text-mutedDeep">{service.category}</p>
        ) : null}

        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {service.title || "Untitled service"}
          </h3>
          <p className="text-sm leading-7 text-muted">{service.shortDescription || service.summary}</p>
        </div>

        <div className="mt-2 space-y-2 sm:mt-4">
          {(service.highlights || []).slice(0, 3).map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-white/8 pt-4 text-sm text-mutedDeep sm:mt-auto">
          Delivery format: <span className="text-muted">{service.deliveryFormat || "Custom engagement"}</span>
        </div>
      </div>
    </Link>
  </motion.article>
);

export default ServiceCard;

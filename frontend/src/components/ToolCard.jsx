import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "./AdminEntityActions";

const ToolCard = ({ tool, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative overflow-hidden transition duration-300 hover:shadow-hoverGlow"
    data-cursor="large"
    data-cursor-label="Open"
  >
    {adminActions ? <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} /> : null}
    <Link
      to="/tools"
      className="block h-full"
      data-cursor="link"
      data-cursor-label="Open"
      aria-label={`Open ${tool.title}`}
    >
      <div className="overflow-hidden border-b border-white/8">
        <img
          src={resolveMedia(tool.cardImage || tool.image)}
          alt={tool.title}
          loading="lazy"
          className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{tool.type}</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
            {tool.title}
          </h3>
        </div>
        <p className="text-sm leading-7 text-muted">{tool.shortDescription || tool.description}</p>
        <p className="text-sm leading-7 text-mutedDeep">{tool.useCase}</p>
        <div className="flex flex-wrap gap-2">
          {(tool.tags || []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="theme-chip rounded-full px-3 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </motion.article>
);

export default ToolCard;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "./AdminEntityActions";

const ProjectCard = ({ project, compact = false, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -10, scale: 1.012 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative h-full overflow-hidden transition duration-300 hover:shadow-hoverGlow"
    data-cursor="large"
    data-cursor-label="View"
  >
    {adminActions ? <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} /> : null}
    <Link
      to={`/projects/${project.slug}`}
      className="flex h-full flex-col"
      data-cursor="link"
      data-cursor-label="Open"
      aria-label={`Open ${project.title}`}
    >
      <motion.div
        layoutId={`project-media-${project.slug}`}
        className="relative overflow-hidden border-b border-white/8"
      >
        <motion.img
          src={resolveMedia(project.coverImage)}
          alt={project.title}
          loading="lazy"
          className={`w-full object-cover ${
            compact ? "h-40" : "h-44 sm:h-48"
          }`}
          whileHover={{ scale: 1.08, y: -6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
      </motion.div>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">
            {project.featured ? "Featured project" : "Project"}
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
            {project.title}
          </h3>
          <p className="text-sm leading-7 text-muted">{project.tagline}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.technologies?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="theme-chip rounded-full px-3 py-1 text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </motion.article>
);

export default ProjectCard;

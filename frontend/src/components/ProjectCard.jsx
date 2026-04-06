import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "./AdminEntityActions";
import MediaImage from "./MediaImage";

const ProjectCard = ({ project, compact = false, adminActions = null, priority = false }) => (
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
      <div className="relative overflow-hidden border-b border-white/8">
        <MediaImage
          src={resolveMedia(project.cardImage || project.coverImage)}
          alt={project.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          transitionDurationMs={240}
          sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
          wrapperClassName="theme-media-frame aspect-video w-full"
          imgClassName="h-full w-full object-cover group-hover:scale-[1.06] group-hover:-translate-y-1.5"
        />
        <motion.div
          className="theme-image-scrim project-card-image-scrim absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
          aria-hidden="true"
        />
        <div className="theme-image-hover-ribbon pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 px-4 py-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-active:translate-y-0 group-active:opacity-100">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
            View Case Study
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5 sm:space-y-5 sm:p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">
            {project.featured ? "Featured project" : "Project"}
          </p>
          <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {project.title}
          </h3>
          <p className="text-sm leading-7 text-muted">
            {project.shortDescription || project.tagline}
          </p>
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

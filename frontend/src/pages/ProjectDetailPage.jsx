import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { projects as projectFallback } from "../assets/mockData";
import { resolveMedia } from "../assets/mediaMap";
import Reveal from "../components/Reveal";
import { useItem } from "../hooks/usePageData";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { data: project, loading, error } = useItem(`/projects/${slug}`, projectFallback, slug);

  if (loading && !project) {
    return <main className="py-24 text-muted">Loading project...</main>;
  }

  if (!project) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Project not found</h1>
          <Link to="/projects" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to showcase
          </Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-10 pb-24"
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-5">
          <p className="eyebrow">Project detail</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">{project.tagline}</p>
          <p className="max-w-2xl text-sm leading-7 text-mutedDeep">{project.description}</p>
          {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
        </div>

        <div className="section-shell panel-glow p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Tech used</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="theme-chip rounded-full px-3 py-2 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Reveal>
        <motion.div layoutId={`project-media-${project.slug}`}>
          <img
            src={resolveMedia(project.coverImage)}
            alt={project.title}
            className="section-shell panel-glow h-[22rem] w-full object-cover sm:h-[30rem]"
          />
        </motion.div>
      </Reveal>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="section-shell panel-glow h-full p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Role breakdown</p>
            <div className="mt-6 space-y-5">
              {project.roleBreakdown?.map((item) => (
                <div key={item.title} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery?.map((item, index) => (
              <img
                key={`${item}-${index}`}
                src={resolveMedia(item)}
                alt={`${project.title} gallery ${index + 1}`}
                loading="lazy"
                className={`section-shell panel-glow w-full object-cover ${
                  index === 0 ? "h-56 sm:col-span-2 sm:h-80" : "h-56"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </section>
    </motion.main>
  );
};

export default ProjectDetailPage;

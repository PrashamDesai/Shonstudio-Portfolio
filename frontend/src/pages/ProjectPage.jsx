import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext.jsx";
import { useItem } from "../hooks/usePageData";

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState(null);
  const { data: project, loading, error, notFound } = useItem(slug ? `/projects/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveProject = async (payload) => {
    if (!editingProject?._id) {
      return;
    }

    await requestAdmin(`/projects/${editingProject._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteProject = async () => {
    if (!editingProject?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${editingProject.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/projects/${editingProject._id}`, {
      method: "DELETE",
    });
    signalRefresh();
    setEditingProject(null);
    navigate("/projects");
  };

  if (loading && !project) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataLoader label="Loading project..." />
      </main>
    );
  }

  if (error && !project && !notFound) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Unable to load project</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
          <Link to="/projects" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to showcase
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Project not found</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This project does not exist or is not published yet.
          </p>
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
          <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
            {project.shortDescription || project.tagline || "No summary available."}
          </p>
          <p className="max-w-2xl text-sm leading-7 text-mutedDeep">
            {project.description || "No description available."}
          </p>
          {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
          {isAdmin && project._id ? (
            <button
              type="button"
              onClick={() => setEditingProject(project)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        <div className="section-shell panel-glow p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Tech used</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(project.technologies || []).length ? (
              project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="theme-chip rounded-full px-3 py-2 text-sm"
                >
                  {tech}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted">No technologies listed.</p>
            )}
          </div>
        </div>
      </div>

      <Reveal>
        <motion.div layoutId={`project-media-${project.slug}`}>
          <img
            src={resolveMedia(project.cardImage || project.coverImage)}
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
              {(project.roleBreakdown || []).length ? (
                project.roleBreakdown.map((item) => (
                  <div key={item.title} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No role breakdown available.</p>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(project.gallery || []).length ? (
              project.gallery.map((item, index) => (
                <img
                  key={`${item}-${index}`}
                  src={resolveMedia(item)}
                  alt={`${project.title} gallery ${index + 1}`}
                  loading="lazy"
                  className={`section-shell panel-glow w-full object-cover ${
                    index === 0 ? "h-56 sm:col-span-2 sm:h-80" : "h-56"
                  }`}
                />
              ))
            ) : (
              <div className="section-shell panel-glow sm:col-span-2 p-6">
                <p className="text-sm text-muted">No gallery available.</p>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {editingProject ? (
        <AdminEntityModal
          title="Edit project"
          entityType="projects"
          initialValue={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={saveProject}
          onDelete={deleteProject}
        />
      ) : null}
    </motion.main>
  );
};

export default ProjectPage;

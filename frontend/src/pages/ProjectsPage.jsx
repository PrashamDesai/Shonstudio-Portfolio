import { motion } from "framer-motion";
import { useState } from "react";

import { projectTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { CardGridSkeleton, PageDataEmpty } from "../components/ApiState";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ProjectsPage = () => {
  const [editingProject, setEditingProject] = useState(null);
  const [quickEditingProject, setQuickEditingProject] = useState(null);
  const { data: projects, loading, error, isEmpty } = useCollection("/projects");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveProject = async (payload) => {
    if (editingProject?._id) {
      await requestAdmin(`/projects/${editingProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    signalRefresh();
  };

  const saveQuickProject = async (payload) => {
    if (!quickEditingProject?._id) {
      return;
    }

    await requestAdmin(`/projects/${quickEditingProject._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteProject = async (project) => {
    if (!project?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${project.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/projects/${project._id}`, {
      method: "DELETE",
    });
    signalRefresh();
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-10 pb-24"
    >
      <SectionHeader
        eyebrow="Projects"
        title="Case studies with visual impact and production clarity."
        description="A visual-first grid of shipped work, with focused copy and confident interaction."
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setEditingProject(projectTemplate)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Add project
            </button>
          ) : null
        }
      />

      {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}

      {loading && !projects.length ? (
        <CardGridSkeleton count={6} className="h-80" />
      ) : isEmpty ? (
        <PageDataEmpty message="No projects available." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal
              key={project.slug || project._id || index}
              delay={Math.min(index, 5) * 0.04}
              amount={0.08}
              immediate={index < 6}
            >
              <ProjectCard
                project={project}
                priority={index < 3}
                adminActions={
                  isAdmin && project._id
                    ? {
                        onEdit: () => setQuickEditingProject(project),
                        onDelete: () => deleteProject(project),
                      }
                    : null
                }
              />
            </Reveal>
          ))}
        </div>
      )}

      {editingProject ? (
        <AdminEntityModal
          title={editingProject._id ? "Edit project" : "Add project"}
          entityType="projects"
          initialValue={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={saveProject}
          onDelete={editingProject._id ? () => deleteProject(editingProject) : undefined}
        />
      ) : null}

      {quickEditingProject ? (
        <AdminQuickEditModal
          title="Quick edit project card"
          entityType="projects"
          initialValue={quickEditingProject}
          onClose={() => setQuickEditingProject(null)}
          onSave={saveQuickProject}
          onDelete={async () => {
            await deleteProject(quickEditingProject);
            setQuickEditingProject(null);
          }}
        />
      ) : null}
    </motion.main>
  );
};

export default ProjectsPage;

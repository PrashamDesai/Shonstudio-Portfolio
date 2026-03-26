import { motion } from "framer-motion";
import { useState } from "react";

import { projectTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { projects as projectFallback } from "../assets/mockData";
import AdminEntityModal from "../components/AdminEntityModal";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ProjectsPage = () => {
  const [editingProject, setEditingProject] = useState(null);
  const { data: projects, error } = useCollection("/projects", projectFallback);
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
        title="A showcase grid designed to feel cinematic, structured, and client-ready."
        description="Hover-led motion, slug-based detail routes, and premium layout framing make each project feel like a polished portfolio case study."
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

      {error ? <p className="text-sm text-white/45">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <ProjectCard
              project={project}
              adminActions={
                isAdmin && project._id
                  ? {
                      onEdit: () => setEditingProject(project),
                      onDelete: () => deleteProject(project),
                    }
                  : null
              }
            />
          </Reveal>
        ))}
      </div>

      {editingProject ? (
        <AdminEntityModal
          title={editingProject._id ? "Edit project" : "Add project"}
          entityType="projects"
          initialValue={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={saveProject}
        />
      ) : null}
    </motion.main>
  );
};

export default ProjectsPage;

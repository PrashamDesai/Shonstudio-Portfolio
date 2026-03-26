import { motion } from "framer-motion";
import { useState } from "react";

import { courseTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { teachingModules } from "../assets/mockData";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const TrainingPage = () => {
  const [editingCourse, setEditingCourse] = useState(null);
  const { data: courses, error } = useCollection("/training", teachingModules);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveCourse = async (payload) => {
    if (editingCourse?._id) {
      await requestAdmin(`/training/${editingCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    signalRefresh();
  };

  const deleteCourse = async (course) => {
    if (!course?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${course.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/training/${course._id}`, {
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
        eyebrow="Training"
        title="Structured modules designed for students, teams, and learning-led interactive programs."
        description="Each module previews scope, duration, and outcomes so the page feels useful to training clients instead of reading like a vague service list."
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setEditingCourse(courseTemplate)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Add training module
            </button>
          ) : null
        }
      />

      {error ? <p className="text-sm text-white/45">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((module, index) => (
          <Reveal key={module.slug || module.title} delay={index * 0.06}>
            <article className="section-shell panel-glow relative h-full space-y-6 p-6 sm:p-8">
              {isAdmin && module._id ? (
                <AdminEntityActions
                  onEdit={() => setEditingCourse(module)}
                  onDelete={() => deleteCourse(module)}
                />
              ) : null}

              <div className="flex items-start justify-between gap-4 pr-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Module</p>
                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
                    {module.title}
                  </h3>
                </div>
                <span className="theme-chip rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em]">
                  {module.duration}
                </span>
              </div>

              <p className="text-sm leading-7 text-muted">{module.summary}</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-white">Curriculum preview</p>
                  <div className="mt-3 space-y-2">
                    {(module.curriculum || []).map((item) => (
                      <p key={item} className="text-sm text-muted">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Skill outcomes</p>
                  <div className="mt-3 space-y-2">
                    {(module.outcomes || []).map((item) => (
                      <p key={item} className="text-sm text-muted">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {editingCourse ? (
        <AdminEntityModal
          title={editingCourse._id ? "Edit training module" : "Add training module"}
          entityType="courses"
          initialValue={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={saveCourse}
        />
      ) : null}
    </motion.main>
  );
};

export default TrainingPage;

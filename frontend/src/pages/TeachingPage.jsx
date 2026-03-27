import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

import { courseTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { CardListSkeleton, PageDataEmpty } from "../components/ApiState";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const TrainingPage = () => {
  const [editingCourse, setEditingCourse] = useState(null);
  const [quickEditingCourse, setQuickEditingCourse] = useState(null);
  const { data: courses, loading, error, isEmpty } = useCollection("/training");
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

  const saveQuickCourse = async (payload) => {
    if (!quickEditingCourse?._id) {
      return;
    }

    await requestAdmin(`/training/${quickEditingCourse._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
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
        title="Practical training modules for teams and students."
        description="Structured learning blocks with clear duration, scope, and measurable outcomes."
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

      {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}

      {loading && !courses.length ? (
        <CardListSkeleton count={3} className="h-80" />
      ) : isEmpty ? (
        <PageDataEmpty message="No training modules available." />
      ) : (
        <div className="flex w-full flex-col gap-6">
          {courses.map((module, index) => (
            <Reveal key={module.slug || module.title || module._id || index} delay={index * 0.06}>
              <article className="section-shell panel-glow group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.04] transition duration-300 hover:shadow-hoverGlow">
                {isAdmin && module._id ? (
                  <AdminEntityActions
                    onEdit={() => setQuickEditingCourse(module)}
                    onDelete={() => deleteCourse(module)}
                  />
                ) : null}

                <Link
                  to={`/training/${module.slug || module._id}`}
                  className="flex flex-col sm:flex-row h-full sm:h-80"
                  data-cursor="link"
                  data-cursor-label="Open"
                  aria-label={`Open ${module.title}`}
                >
                  <div className="overflow-hidden border-b border-white/10 sm:w-1/4 sm:border-b-0 sm:border-r">
                    <img
                      src={resolveMedia(module.cardImage || module.carouselImage || "pulse-xr-lab")}
                      alt={module.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="space-y-6 p-6 sm:w-3/4 sm:p-8">
                    <div className="flex items-start justify-between gap-4 pr-12">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Training module</p>
                        <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                          {module.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="theme-chip rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em]">
                          {module.duration || "Duration"}
                        </span>
                        <span className="theme-chip rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em]">
                          {module.level || "Beginner"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-muted">
                      {module.shortDescription || module.summary}
                    </p>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-white">Curriculum preview</p>
                        <div className="mt-3 space-y-2">
                          {(module.curriculum || []).slice(0, 3).map((item) => (
                            <p key={item} className="text-sm text-muted">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Skill outcomes</p>
                        <div className="mt-3 space-y-2">
                          {(module.outcomes || []).slice(0, 3).map((item) => (
                            <p key={item} className="text-sm text-muted">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {editingCourse ? (
        <AdminEntityModal
          title={editingCourse._id ? "Edit training module" : "Add training module"}
          entityType="courses"
          initialValue={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={saveCourse}
          onDelete={editingCourse._id ? () => deleteCourse(editingCourse) : undefined}
        />
      ) : null}

      {quickEditingCourse ? (
        <AdminQuickEditModal
          title="Quick edit training card"
          entityType="courses"
          initialValue={quickEditingCourse}
          onClose={() => setQuickEditingCourse(null)}
          onSave={saveQuickCourse}
          onDelete={async () => {
            await deleteCourse(quickEditingCourse);
            setQuickEditingCourse(null);
          }}
        />
      ) : null}
    </motion.main>
  );
};

export default TrainingPage;

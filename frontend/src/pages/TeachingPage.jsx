import { motion } from "framer-motion";
import { useMemo, useState } from "react";
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

const TRAINING_TRACK_ORDER = ["ui-ux", "unity-2d", "unity-3d", "xr-development", "xr-developments"];

const getTrackKey = (module = {}) =>
  String(module.slug || module.title || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

const TrainingPage = () => {
  const [editingCourse, setEditingCourse] = useState(null);
  const [quickEditingCourse, setQuickEditingCourse] = useState(null);
  const { data: courses, loading, error, isEmpty } = useCollection("/training");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const orderedModules = useMemo(() => {
    return [...courses].sort((a, b) => {
      const aKey = getTrackKey(a);
      const bKey = getTrackKey(b);
      const aIndex = TRAINING_TRACK_ORDER.indexOf(aKey);
      const bIndex = TRAINING_TRACK_ORDER.indexOf(bKey);

      if (aIndex >= 0 && bIndex >= 0) {
        return aIndex - bIndex;
      }

      if (aIndex >= 0) {
        return -1;
      }

      if (bIndex >= 0) {
        return 1;
      }

      return String(a.title || "").localeCompare(String(b.title || ""));
    });
  }, [courses]);

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
      className="space-y-8 pb-24 sm:space-y-10"
    >
      <SectionHeader
        eyebrow="Training"
        title="Deep beginner-to-builder training roadmap."
        description="Structured, practical tracks designed to push beginners into production-ready habits without overwhelming them."
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setEditingCourse(courseTemplate)}
              className="theme-button-primary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
            >
              Add training module
            </button>
          ) : null
        }
      />

      {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}

      {loading && !orderedModules.length ? (
        <CardListSkeleton count={3} className="h-80" />
      ) : isEmpty ? (
        <PageDataEmpty message="No training modules available." />
      ) : (
        <div className="flex w-full flex-col gap-6">
          {orderedModules.map((module, index) => (
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
                  className="flex h-full flex-col sm:h-80 sm:flex-row"
                  data-cursor="link"
                  data-cursor-label="Open"
                  aria-label={`Open ${module.title}`}
                >
                  <div className="h-52 overflow-hidden border-b border-white/10 sm:h-auto sm:w-1/4 sm:border-b-0 sm:border-r">
                    <img
                      src={resolveMedia(module.cardImage || module.carouselImage || "pulse-xr-lab")}
                      alt={module.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="space-y-5 p-5 sm:w-3/4 sm:space-y-6 sm:p-8">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pr-12">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Training module</p>
                        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                          {module.title}
                        </h3>
                      </div>
                      {getTrackKey(module) !== "ui-ux" ? (
                        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                          <span className="theme-chip rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            {module.duration || "Duration"}
                          </span>
                          <span className="theme-chip rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            {module.level || "Beginner"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <p className="text-sm leading-7 text-muted">
                      {module.shortDescription || module.summary}
                    </p>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-white">Curriculum preview</p>
                        <div className="mt-3 space-y-2">
                          {(module.curriculum || []).slice(0, 4).length ? (
                            (module.curriculum || []).slice(0, 4).map((item, itemIndex) => (
                              <p key={item} className="flex gap-2 text-sm text-muted">
                                <span className="text-white/70">{itemIndex + 1}.</span>
                                <span>{item}</span>
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-muted">No curriculum preview available.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Skill outcomes</p>
                        <div className="mt-3 space-y-2">
                          {(module.outcomes || []).slice(0, 4).length ? (
                            (module.outcomes || []).slice(0, 4).map((item, itemIndex) => (
                              <p key={item} className="flex gap-2 text-sm text-muted">
                                <span className="text-white/70">{itemIndex + 1}.</span>
                                <span>{item}</span>
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-muted">No outcomes listed yet.</p>
                          )}
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

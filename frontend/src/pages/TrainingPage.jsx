import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import { useAdmin } from "../context/AdminContext.jsx";
import { useItem } from "../hooks/usePageData";

const TrainingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: course, loading, error, notFound } = useItem(slug ? `/training/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveCourse = async (payload) => {
    if (!editingCourse?._id) {
      return;
    }

    await requestAdmin(`/training/${editingCourse._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteCourse = async () => {
    if (!editingCourse?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${editingCourse.title}"?`);
    if (!confirmed) {
      return;
    }

    await requestAdmin(`/training/${editingCourse._id}`, {
      method: "DELETE",
    });
    signalRefresh();
    setEditingCourse(null);
    navigate("/training");
  };

  if (loading && !course) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataLoader label="Loading training module..." />
      </main>
    );
  }

  if (error && !course && !notFound) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Unable to load training module</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
          <Link to="/training" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to training
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !course) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Training module not found</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This training module does not exist or is not published yet.
          </p>
          <Link to="/training" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to training
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
      className="space-y-8 pb-24"
    >
      <section className="section-shell panel-glow overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={resolveMedia(course.carouselImage || course.cardImage || "pulse-xr-lab")}
          alt={course.title}
          className="h-64 sm:h-80 lg:h-96 w-full object-cover"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Training module</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {course.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              {course.shortDescription || course.summary || "No summary available."}
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-mutedDeep">
              {course.duration || "Duration not available"}
            </p>
          </div>
          {isAdmin && course._id ? (
            <button
              type="button"
              onClick={() => setEditingCourse(course)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Curriculum</p>
            <div className="mt-3 space-y-2">
              {(course.curriculum || []).length ? (
                course.curriculum.map((item) => (
                  <p key={item} className="text-sm leading-7 text-muted">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted">No curriculum available.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Outcomes</p>
            <div className="mt-3 space-y-2">
              {(course.outcomes || []).length ? (
                course.outcomes.map((item) => (
                  <p key={item} className="text-sm leading-7 text-muted">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted">No outcomes listed.</p>
              )}
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-mutedDeep">{error}</p> : null}
      </section>

      {editingCourse ? (
        <AdminEntityModal
          title={editingCourse._id ? "Edit training module" : "Add training module"}
          entityType="courses"
          initialValue={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={saveCourse}
          onDelete={deleteCourse}
        />
      ) : null}
    </motion.main>
  );
};

export default TrainingPage;

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
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{error}</p>
          <Link to="/training" className="theme-link mt-7 inline-flex text-base" data-cursor="link">
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
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            This training module does not exist or is not published yet.
          </p>
          <Link to="/training" className="theme-link mt-7 inline-flex text-base" data-cursor="link">
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
      className="space-y-10 pb-24"
    >
      <section className="section-shell panel-glow overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={resolveMedia(course.carouselImage || course.cardImage || "pulse-xr-lab")}
          alt={course.title}
          className="h-72 w-full object-cover sm:h-96 lg:h-[30rem]"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-7 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-base">Training module</p>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {course.title}
            </h1>
            <p className="max-w-4xl text-lg leading-9 text-muted sm:text-xl">
              {course.shortDescription || course.summary || "No summary available."}
            </p>
            <p className="text-sm uppercase tracking-[0.2em] text-mutedDeep sm:text-base">
              {course.duration || "Duration not available"}
            </p>
          </div>
          {isAdmin && course._id ? (
            <button
              type="button"
              onClick={() => setEditingCourse(course)}
              className="theme-button-primary rounded-full px-6 py-3.5 text-base font-semibold"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Curriculum</p>
            <div className="mt-4 space-y-3">
              {(course.curriculum || []).length ? (
                course.curriculum.map((item) => (
                  <p key={item} className="text-base leading-8 text-muted sm:text-lg sm:leading-9">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-base text-muted sm:text-lg">No curriculum available.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Outcomes</p>
            <div className="mt-4 space-y-3">
              {(course.outcomes || []).length ? (
                course.outcomes.map((item) => (
                  <p key={item} className="text-base leading-8 text-muted sm:text-lg sm:leading-9">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-base text-muted sm:text-lg">No outcomes listed.</p>
              )}
            </div>
          </div>
        </div>

        {error ? <p className="mt-5 text-base text-mutedDeep sm:text-lg">{error}</p> : null}
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

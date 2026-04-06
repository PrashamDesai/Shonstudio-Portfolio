import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import { useAdmin } from "../context/AdminContext.jsx";
import { trainingCoursePlans } from "../data/trainingCoursePlans";
import { useItem } from "../hooks/usePageData";

const parseLearningItem = (item = "", index = 0) => {
  const text = String(item || "").trim();
  const match = text.match(/^(week\s*\d+(?:\s*lab|\s*final)?|day\s*\d+|module\s*\d+)\s*:\s*(.+)$/i);

  if (!match) {
    return {
      label: `Step ${index + 1}`,
      detail: text,
    };
  }

  return {
    label: match[1],
    detail: match[2],
  };
};

const normalizeCourseKey = (course = {}) => {
  const slugKey = String(course?.slug || "")
    .toLowerCase()
    .trim();

  if (slugKey) {
    return slugKey;
  }

  return String(course?.title || "")
    .toLowerCase()
    .trim()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-");
};

const TrainingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: course, loading, error, notFound } = useItem(slug ? `/training/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const curriculumItems = useMemo(() => {
    return (course?.curriculum || []).map((item, index) => {
      const parsed = parseLearningItem(item, index);
      return {
        key: `${parsed.label}-${index}`,
        ...parsed,
      };
    });
  }, [course?.curriculum]);

  const outcomes = useMemo(() => {
    return course?.outcomes || [];
  }, [course?.outcomes]);

  const trackStats = useMemo(() => {
    return [
      {
        label: "Duration",
        value: course?.duration || "Duration not available",
      },
      {
        label: "Level",
        value: course?.level || "Beginner",
      },
      {
        label: "Curriculum blocks",
        value: String(curriculumItems.length || 0),
      },
      {
        label: "Expected outcomes",
        value: String(outcomes.length || 0),
      },
    ];
  }, [course?.duration, course?.level, curriculumItems.length, outcomes.length]);

  const coursePlan = useMemo(() => {
    const normalizedKey = normalizeCourseKey(course);
    return trainingCoursePlans[normalizedKey] || null;
  }, [course]);

  const hasStructuredPlan = Boolean(coursePlan);

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
        <div className="section-shell mx-auto max-w-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Unable to load training module</h1>
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
        <div className="section-shell mx-auto max-w-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Training module not found</h1>
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
      className="space-y-8 pb-24 sm:space-y-10"
    >
      <section className="section-shell panel-glow overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={resolveMedia(course.carouselImage || course.cardImage || "pulse-xr-lab")}
          alt={course.title}
          className="h-52 w-full object-cover sm:h-80 lg:h-[30rem]"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-base">
              Training module
            </p>
            <h1 className="font-display text-[clamp(2.1rem,9vw,4.7rem)] font-semibold tracking-tight text-white lg:text-7xl">
              {course.title}
            </h1>
            <p className="max-w-4xl text-base leading-8 text-muted sm:text-xl sm:leading-9">
              {course.shortDescription || course.summary || "No summary available."}
            </p>
            {hasStructuredPlan ? (
              <p className="max-w-5xl text-base leading-8 text-white/85 sm:text-lg sm:leading-9">
                {coursePlan.objective}
              </p>
            ) : null}
          </div>
          {isAdmin && course._id ? (
            <button
              type="button"
              onClick={() => setEditingCourse(course)}
              className="theme-button-primary w-full rounded-full px-6 py-3.5 text-base font-semibold sm:w-auto"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        {hasStructuredPlan ? (
          <div className="training-structured-scale mt-8 space-y-6">
              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Course Overview
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedDeep">Course title</p>
                    <p className="mt-2 text-sm text-white">{coursePlan.overview.courseTitle}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedDeep">Duration</p>
                    <p className="mt-2 text-sm text-white">{coursePlan.overview.duration}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3.5">
                  <p className="text-xs uppercase tracking-[0.2em] text-mutedDeep">Target audience</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{coursePlan.overview.targetAudience}</p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-white">Learning outcomes</p>
                  <ul className="mt-3 space-y-2">
                    {coursePlan.overview.learningOutcomes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Weekly Breakdown
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {coursePlan.weeklyBreakdown.flatMap((week) => [
                    <section
                      key={`${week.title}-summary`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
                    >
                      <h3 className="font-display text-xl font-semibold text-white">{week.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{week.summary}</p>
                    </section>,
                    <section
                      key={`${week.title}-skills`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
                    >
                      <h3 className="font-display text-xl font-semibold text-white">Key skills covered</h3>
                      <ul className="mt-2 space-y-2">
                        {week.keySkills.map((skill) => (
                          <li key={skill} className="flex gap-2 text-sm leading-7 text-muted">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </section>,
                  ])}
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Daily Plan (Day 1-{coursePlan.dailyPlan.length})
                </h2>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {coursePlan.dailyPlan.map((dayPlan) => (
                    <section
                      key={`day-${dayPlan.day}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
                    >
                      <h3 className="font-display text-xl font-semibold text-white">
                        Day {dayPlan.day} - {dayPlan.title}
                      </h3>

                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-white">Concepts:</p>
                          <ul className="mt-2 space-y-2">
                            {dayPlan.concepts.map((concept) => (
                              <li key={concept} className="flex gap-2 text-sm leading-7 text-muted">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                                <span>{concept}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">Why It Matters:</p>
                          <p className="mt-2 text-sm leading-7 text-muted">{dayPlan.whyItMatters}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">Task (Hands-on):</p>
                          <p className="mt-2 text-sm leading-7 text-muted">{dayPlan.task}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">Deliverable:</p>
                          <p className="mt-2 text-sm leading-7 text-muted">{dayPlan.deliverable}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">Tools:</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {dayPlan.tools.map((tool) => (
                              <span key={tool} className="theme-chip rounded-full px-3 py-1 text-[11px]">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Projects
                </h2>
                <div className="mt-5 space-y-4">
                  {coursePlan.projects.map((project) => (
                    <section key={project.title} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                      <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-white">Problem statement</p>
                          <p className="mt-2 text-sm leading-7 text-muted">{project.problemStatement}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Features/screens required</p>
                          <ul className="mt-2 space-y-2">
                            {project.featuresScreens.map((feature) => (
                              <li key={feature} className="flex gap-2 text-sm leading-7 text-muted">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Expected outcome</p>
                          <p className="mt-2 text-sm leading-7 text-muted">{project.expectedOutcome}</p>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Design System Basics
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {Object.entries(coursePlan.designSystemBasics).map(([key, items]) => (
                    <section key={key} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                      <h3 className="font-display text-xl font-semibold capitalize text-white">{key}</h3>
                      <ul className="mt-3 space-y-2">
                        {items.map((item) => (
                          <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Portfolio Guidance
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">Structure a case study</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.portfolioGuidance.structureCaseStudy.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">Present projects</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.portfolioGuidance.presentProjects.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">What recruiters look for</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.portfolioGuidance.recruiterLooksFor.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>

              <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Bonus Section
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">Free resources</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.bonus.freeResources.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">Common beginner mistakes</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.bonus.commonBeginnerMistakes.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2 sm:p-5">
                    <h3 className="font-display text-xl font-semibold text-white">Pro tips</h3>
                    <ul className="mt-3 space-y-2">
                      {coursePlan.bonus.proTips.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
          </div>
        ) : (
          <div className="mt-8 grid gap-7 lg:grid-cols-[1.45fr_0.95fr] lg:items-start">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Curriculum journey</p>
              <div className="mt-5 space-y-4">
                {curriculumItems.length ? (
                  curriculumItems.map((item, index) => (
                    <article
                      key={item.key}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/80">{item.label}</p>
                        <span className="theme-chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                          Block {index + 1}
                        </span>
                      </div>
                      <p className="mt-3 text-base leading-8 text-muted sm:text-lg sm:leading-9">{item.detail}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-base text-muted sm:text-lg">No curriculum available.</p>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Track stats</p>
                <div className="mt-4 space-y-3">
                  {trackStats.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-mutedDeep">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Skill outcomes</p>
                <div className="mt-4 space-y-3">
                  {outcomes.length ? (
                    outcomes.map((item, index) => (
                      <p key={item} className="flex gap-2 text-base leading-8 text-muted sm:text-lg sm:leading-9">
                        <span className="text-white/70">{index + 1}.</span>
                        <span>{item}</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-base text-muted sm:text-lg">No outcomes listed.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {error ? <p className="mt-6 text-base text-mutedDeep sm:text-lg">{error}</p> : null}
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

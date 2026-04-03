import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { projectTemplate } from "../admin/entityTemplates";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { PageDataEmpty } from "../components/ApiState";
import WhatWeDoModal from "../components/WhatWeDoModal";
import HeroCarousel from "../components/HeroCarousel";
import MagneticButton from "../components/MagneticButton";
import TechMarquee from "../components/TechMarquee";
import { buildHeroCarouselData } from "../components/carouselDataAdapter";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";
import { useSmoothScroll } from "../hooks/useSmoothScroll.jsx";

const techLogos = [
  { name: "Unity", logo: "unity" },
  { name: "C#", logo: "csharp" },
  { name: "Meta", logo: "meta" },
  { name: "Oculus", logo: "oculus" },
  { name: "Apple Vision Pro", logo: "appleVisionPro" },
  { name: "Gemini", logo: "gemini" },
  { name: "Claude", logo: "claude" },
  { name: "Codex", logo: "codex" },
  { name: "ChatGPT", logo: "chatgpt" },
  { name: "Cursor", logo: "cursor" },
  { name: "iOS", logo: "ios" },
  { name: "Android", logo: "android" },
];

const mergeShowcaseItems = (primaryItems, fallbackItems, limit) => {
  const seen = new Set();
  const ordered = [...primaryItems, ...fallbackItems].filter((item) => {
    if (!item?.slug || seen.has(item.slug)) {
      return false;
    }

    seen.add(item.slug);
    return true;
  });

  return ordered.slice(0, limit);
};

const getServicePath = (service) => {
  const serviceIdentifier = service?.slug || service?._id;
  return serviceIdentifier ? `/services/${serviceIdentifier}` : "/services";
};

const HomePage = () => {
  const [editingEntity, setEditingEntity] = useState(null);
  const [quickEditingEntity, setQuickEditingEntity] = useState(null);
  // Dedicated state for the What We Do modal (add=null means closed, {} means add new, or entity object means edit)
  const [whatWeDoModal, setWhatWeDoModal] = useState(null);
  const { data: projects, loading: projectsLoading, error: projectsError } = useCollection("/projects");
  const { data: services, loading: servicesLoading, error: servicesError } = useCollection("/services");
  const { data: courses, loading: coursesLoading, error: coursesError } = useCollection("/training");
  const { data: tools, loading: toolsLoading, error: toolsError } = useCollection("/tools");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();
  const { smoothY } = useSmoothScroll();
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useTransform(pointerX, [-0.5, 0.5], [28, 72]);
  const glowY = useTransform(pointerY, [-0.5, 0.5], [36, 64]);
  const heroGlow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 212, 255, 0.22), transparent 28%), radial-gradient(circle at 78% 14%, rgba(122, 92, 255, 0.18), transparent 26%), radial-gradient(circle at 30% 86%, rgba(0, 255, 198, 0.08), transparent 24%)`;
  const heroGridY = useTransform(
    smoothY,
    [0, 900],
    [0, prefersReducedMotion ? -8 : -34],
  );
  const heroContentY = useTransform(
    smoothY,
    [0, 700],
    [0, prefersReducedMotion ? -6 : -22],
  );
  const ctaGlowY = useTransform(
    smoothY,
    [0, 2200],
    [0, prefersReducedMotion ? -10 : -42],
  );

  const topProjects = mergeShowcaseItems(
    projects.filter((project) => project.featured),
    projects,
    3,
  );
  const featuredServices = mergeShowcaseItems(
    services.filter((service) => service.featured),
    services,
    4,
  );
  const isLoadingHeroContent =
    (projectsLoading || servicesLoading || coursesLoading || toolsLoading) &&
    !(projects.length || services.length || courses.length || tools.length);
  const isServicesLoading = servicesLoading && !services.length;
  const isProjectsLoading = projectsLoading && !projects.length;
  const homeErrors = [projectsError, servicesError, coursesError, toolsError].filter(Boolean);
  const primaryHomeError = homeErrors[0] || "";
  const heroCarouselCategories = useMemo(
    () =>
      buildHeroCarouselData({
        projects,
        services,
        courses,
        tools,
      }),
    [projects, services, courses, tools],
  );

  const saveEntity = async (payload) => {
    const entityType = editingEntity?.entityType;

    if (!entityType) {
      return;
    }

    if (editingEntity?._id) {
      await requestAdmin(`/${entityType}/${editingEntity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin(`/${entityType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    signalRefresh();
  };

  /** Save handler for the What We Do modal (add or edit) */
  const saveWhatWeDo = async (payload) => {
    if (whatWeDoModal?._id) {
      await requestAdmin(`/services/${whatWeDoModal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    signalRefresh();
  };

  /** Delete handler for the What We Do modal */
  const deleteWhatWeDo = async (item) => {
    if (!item?._id) return;
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;
    await requestAdmin(`/services/${item._id}`, { method: "DELETE" });
    setWhatWeDoModal(null);
    signalRefresh();
  };

  const saveQuickEntity = async (payload) => {
    const entityType = quickEditingEntity?.entityType;

    if (!entityType || !quickEditingEntity?._id) {
      return;
    }

    await requestAdmin(`/${entityType}/${quickEditingEntity._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    signalRefresh();
  };

  const deleteEntity = async (entityType, item) => {
    if (!item?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${item.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/${entityType}/${item._id}`, {
      method: "DELETE",
    });
    signalRefresh();
  };

  const handleHeroMove = (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
  };

  const resetHeroMove = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24"
    >
      <section
        className="relative min-h-[36rem] overflow-hidden rounded-[2.35rem] border border-white/10 bg-surface/75 px-6 py-12 shadow-soft sm:px-10 sm:py-14 lg:min-h-[42rem] lg:px-16 lg:py-16"
        onMouseMove={handleHeroMove}
        onMouseLeave={resetHeroMove}
      >
        <motion.div className="hero-grid absolute inset-0 opacity-30" style={{ y: heroGridY }} />
        <motion.div className="absolute inset-0 opacity-90" style={{ backgroundImage: heroGlow }} />
        <motion.div
          className="absolute -left-20 top-8 h-44 w-44 rounded-full bg-accent/14 blur-3xl"
          animate={prefersReducedMotion ? undefined : { y: [0, -20, 0], x: [0, 16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-8 bottom-0 h-56 w-56 rounded-full bg-accentAlt/16 blur-3xl"
          animate={prefersReducedMotion ? undefined : { y: [0, 22, 0], x: [0, -14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ y: heroContentY }}
          className="relative z-10 grid h-full items-stretch gap-8 lg:min-h-[34rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10"
        >
          <div className="flex h-full flex-col justify-center gap-8 lg:pr-2">
            <p className="eyebrow">ShonStudio</p>
            <h1 className="font-display text-5xl font-semibold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
              Crafting Worlds Beyond Screens
            </h1>
            <p className="max-w-2xl text-base text-muted sm:text-lg">
              Game development, XR products, and immersive systems for ambitious teams.
            </p>
            <div className="pt-4 sm:pt-6 lg:pt-12">
              <MagneticButton
                to="/projects"
                cursorLabel="View"
                className="theme-button-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
              >
                View Projects
              </MagneticButton>
            </div>
          </div>

          <div className="relative h-[21rem] min-h-[20rem] sm:h-[24rem] lg:h-full lg:min-h-[34rem]">
            {isLoadingHeroContent ? (
              <div className="section-shell panel-glow h-full animate-pulse rounded-[1.95rem] border border-white/10 bg-white/[0.03]" />
            ) : heroCarouselCategories.length ? (
              <HeroCarousel categories={heroCarouselCategories} />
            ) : (
              <div className="section-shell panel-glow flex h-full items-center justify-center rounded-[1.95rem] border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-sm text-muted">No content available</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <TechMarquee items={techLogos} />
      </motion.section>

      {primaryHomeError ? (
        <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-mutedDeep">
          {primaryHomeError}
        </div>
      ) : null}

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_84%_16%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Focused capabilities for real outcomes.
              </h2>
            </div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setWhatWeDoModal({})}
                className="theme-button-secondary rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Add Capability
              </button>
            ) : null}
          </div>

          {isServicesLoading ? (
            /* Skeleton mirrors the actual service card grid exactly */
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl"
                >
                  {/* Category eyebrow */}
                  <div className="h-3 w-20 rounded-full bg-white/10" />
                  {/* Title */}
                  <div className="mt-3 space-y-2">
                    <div className="h-6 w-3/4 rounded-lg bg-white/10" />
                    <div className="h-6 w-1/2 rounded-lg bg-white/10" />
                  </div>
                  {/* Highlight pills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="h-6 w-20 rounded-full bg-white/10" />
                    <div className="h-6 w-16 rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredServices.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.slug || index}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl"
                >
                  {/* Admin: click pencil to open dedicated What We Do modal */}
                  {isAdmin && service._id ? (
                    <AdminEntityActions
                      onEdit={() => setWhatWeDoModal(service)}
                      onDelete={() => deleteWhatWeDo(service)}
                    />
                  ) : null}
                  <Link
                    to={getServicePath(service)}
                    className="block"
                    data-cursor="link"
                    data-cursor-label="Open"
                    aria-label={`Open ${service.title || "service"}`}
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-accentSoft/80">
                      {service.category || "Capability"}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-white">
                      {service.title || "Untitled service"}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(service.highlights || []).slice(0, 2).map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <PageDataEmpty message="No services available." />
          )}
        </div>
      </section>

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(0,212,255,0.10),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Featured Projects</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Visual-first projects, built to launch.
              </h2>
            </div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() =>
                  setEditingEntity({
                    ...projectTemplate,
                    entityType: "projects",
                  })
                }
                className="theme-button-secondary rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Add Project
              </button>
            ) : null}
          </div>

          {isProjectsLoading ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
                >
                  {/* Image area */}
                  <div className="aspect-video w-full bg-white/10" />
                  {/* Text area */}
                  <div className="space-y-3 px-5 py-5">
                    <div className="h-3 w-16 rounded-full bg-white/10" />
                    <div className="h-6 w-3/4 rounded-lg bg-white/10" />
                    <div className="h-4 w-full rounded-lg bg-white/10" />
                    <div className="h-4 w-2/3 rounded-lg bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProjects.length ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {topProjects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  initial={{ opacity: 0, y: 34, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
                >
                  {isAdmin && project._id ? (
                    <AdminEntityActions
                      onEdit={() =>
                        setQuickEditingEntity({
                          ...project,
                          entityType: "projects",
                        })
                      }
                      onDelete={() => deleteEntity("projects", project)}
                    />
                  ) : null}
                  <Link
                    to={`/projects/${project.slug}`}
                    data-cursor="link"
                    data-cursor-label="Open"
                    className="block"
                  >
                    <div className="relative overflow-hidden border-b border-white/10">
                      <motion.img
                        src={resolveMedia(project.cardImage || project.coverImage)}
                        alt={project.title}
                        loading="lazy"
                        className="aspect-video w-full object-cover"
                        whileHover={{ scale: 1.07, y: -4 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent opacity-70" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full border-t border-white/10 bg-black/72 px-4 py-3 transition duration-300 group-hover:translate-y-0">
                        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
                          View Case Study
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 px-5 py-5">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-accentSoft/80">
                        Featured
                      </p>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm leading-7 text-muted">
                        {project.shortDescription || project.tagline}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <PageDataEmpty message="No projects available." />
          )}
        </div>
      </section>

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/72 px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_34%),radial-gradient(circle_at_72%_18%,rgba(122,92,255,0.14),transparent_30%)]"
          style={{ y: ctaGlowY }}
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Let&apos;s build your next digital flagship.
          </h2>
          <div>
            <MagneticButton
              to="/counselling"
              cursorLabel="Open"
              className="theme-button-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
            >
              Get in Touch
            </MagneticButton>
          </div>
        </div>
      </section>

      {editingEntity ? (
        <AdminEntityModal
          title={editingEntity._id ? "Edit item" : "Add item"}
          entityType={editingEntity.entityType}
          initialValue={editingEntity}
          onClose={() => setEditingEntity(null)}
          onSave={saveEntity}
          onDelete={
            editingEntity._id
              ? () => deleteEntity(editingEntity.entityType, editingEntity)
              : undefined
          }
        />
      ) : null}

      {quickEditingEntity ? (
        <AdminQuickEditModal
          title="Quick edit card"
          entityType={quickEditingEntity.entityType}
          initialValue={quickEditingEntity}
          onClose={() => setQuickEditingEntity(null)}
          onSave={saveQuickEntity}
          onDelete={async () => {
            await deleteEntity(quickEditingEntity.entityType, quickEditingEntity);
            setQuickEditingEntity(null);
          }}
        />
      ) : null}

      {/* Dedicated add/edit modal for the What We Do section */}
      {whatWeDoModal !== null ? (
        <WhatWeDoModal
          isAdd={!whatWeDoModal._id}
          initialValue={whatWeDoModal}
          onClose={() => setWhatWeDoModal(null)}
          onSave={saveWhatWeDo}
          onDelete={whatWeDoModal._id ? () => deleteWhatWeDo(whatWeDoModal) : undefined}
        />
      ) : null}
    </motion.main>
  );
};

export default HomePage;

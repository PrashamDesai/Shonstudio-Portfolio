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
import BrandBounceLoader from "../components/BrandBounceLoader";
import MediaImage from "../components/MediaImage";
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
      className="space-y-6 pb-24 sm:space-y-8"
    >
      <section
        className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/10 bg-surface/75 px-5 py-8 shadow-soft max-[480px]:min-h-[26rem] max-[480px]:rounded-[1.45rem] max-[480px]:px-4 max-[480px]:py-6 sm:min-h-[36rem] sm:px-10 sm:py-14 xl:min-h-[42rem] xl:rounded-[2.35rem] xl:px-16 xl:py-16"
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

        <p className="eyebrow pointer-events-none absolute left-4 top-4 z-20 max-[480px]:left-3 max-[480px]:top-3 sm:left-8 sm:top-8 lg:left-10 lg:top-10">
          ShonStudio
        </p>

        <motion.div
          style={{ y: heroContentY }}
          className="relative z-10 grid h-full items-stretch gap-6 pt-12 max-[480px]:gap-5 max-[480px]:pt-16 sm:pt-14 xl:min-h-[34rem] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-10 xl:pt-0"
        >
          <div className="flex h-full min-w-0 flex-col justify-center gap-6 max-[480px]:gap-5 sm:gap-8 xl:max-w-[34rem] xl:pr-2">
            <h1 className="text-balance font-display text-[clamp(2.15rem,8.4vw,4.8rem)] font-semibold leading-[0.95] tracking-tight text-white max-[480px]:text-[clamp(2rem,11vw,2.55rem)]">
              Where ideas become experiences.
            </h1>
            <p className="mt-2 max-w-2xl text-base text-muted max-[480px]:mt-1.5 max-[480px]:text-[0.95rem] sm:mt-3 sm:text-lg">
              Execution defines everything, turning ideas into experiences that hold attention and deliver real impact.
            </p>
            <div className="pt-2 max-[480px]:pt-1 sm:pt-6 xl:pt-12">
              <MagneticButton
                to="/projects"
                cursorLabel="View"
                className="theme-button-primary inline-flex w-full items-center justify-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto"
              >
                View Projects
              </MagneticButton>
            </div>
          </div>

          <div className="relative h-[18rem] min-h-[16rem] min-w-0 max-[480px]:h-[16rem] max-[480px]:min-h-[14rem] sm:h-[24rem] xl:h-full xl:min-h-[34rem]">
            {isLoadingHeroContent ? (
              <div className="section-shell panel-glow flex h-full items-center justify-center rounded-[1.95rem] border border-white/10 bg-white/[0.03]">
                <BrandBounceLoader size="lg" label="Loading hero content" showLabel />
              </div>
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

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 max-[480px]:px-4 max-[480px]:py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_84%_16%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white max-[480px]:text-[1.75rem] sm:text-4xl">
                Focused capabilities for real outcomes.
              </h2>
            </div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setWhatWeDoModal({})}
                className="theme-button-secondary w-full rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
              >
                Add Capability
              </button>
            ) : null}
          </div>

          {isServicesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-h-[14.5rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl"
                >
                  <BrandBounceLoader size="md" label="Loading services" />
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
                    <h3 className="mt-3 break-words font-display text-2xl font-semibold leading-tight tracking-tight text-white">
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

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 max-[480px]:px-4 max-[480px]:py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(0,212,255,0.10),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-7">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Featured Projects</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white max-[480px]:text-[1.75rem] sm:text-4xl">
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
                className="theme-button-secondary w-full rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
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
                  className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
                >
                  <div className="flex aspect-video items-center justify-center border-b border-white/10">
                    <BrandBounceLoader size="md" label="Loading projects" />
                  </div>
                  <div className="px-5 py-5">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-mutedDeep">Loading project</span>
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
                      <MediaImage
                        src={resolveMedia(project.cardImage || project.coverImage)}
                        alt={project.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "low"}
                        transitionDurationMs={240}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        wrapperClassName="theme-media-frame aspect-video w-full"
                        imgClassName="h-full w-full object-cover group-hover:scale-[1.07] group-hover:-translate-y-1"
                      />
                      <div className="theme-image-scrim absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100" />
                      <div className="theme-image-hover-ribbon pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full px-4 py-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-active:translate-y-0 group-active:opacity-100">
                        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
                          View Case Study
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 px-5 py-5">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-accentSoft/80">
                        Featured
                      </p>
                      <h3 className="break-words font-display text-2xl font-semibold tracking-tight text-white">
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

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/72 px-5 py-10 text-center max-[480px]:px-4 max-[480px]:py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_34%),radial-gradient(circle_at_72%_18%,rgba(122,92,255,0.14),transparent_30%)]"
          style={{ y: ctaGlowY }}
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white max-[480px]:text-[1.8rem] sm:text-4xl lg:text-5xl">
            Let&apos;s build your next digital flagship.
          </h2>
          <div>
            <MagneticButton
              to="/counselling"
              cursorLabel="Open"
              className="theme-button-primary inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto"
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

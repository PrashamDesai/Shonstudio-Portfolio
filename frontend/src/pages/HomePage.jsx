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
import { projectTemplate, serviceTemplate } from "../admin/entityTemplates";
import { resolveMedia } from "../assets/mediaMap";
import { projects as projectFallback, services as serviceFallback } from "../assets/mockData";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import MagneticButton from "../components/MagneticButton";
import TechMarquee from "../components/TechMarquee";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";
import { useSmoothScroll } from "../hooks/useSmoothScroll.jsx";

const techLogos = [
  { name: "Unity", mark: "U" },
  { name: "C#", mark: "C#" },
  { name: "Meta", mark: "M" },
  { name: "Oculus", mark: "O" },
  { name: "Apple Vision Pro", mark: "AVP" },
  { name: "Gemini", mark: "G" },
  { name: "Claude", mark: "CL" },
  { name: "Codex", mark: "CX" },
  { name: "ChatGPT", mark: "GPT" },
  { name: "Cursor", mark: "CS" },
];

const conciseServiceLines = [
  "2D & 3D Game Development",
  "XR & Immersive Systems",
  "Game Design & UI/UX",
  "Audio & Production",
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

const HomePage = () => {
  const [editingEntity, setEditingEntity] = useState(null);
  const featuredFallback = useMemo(
    () => projectFallback.filter((project) => project.featured),
    [],
  );
  const { data: featuredProjects } = useCollection("/projects?featured=true", featuredFallback);
  const { data: services } = useCollection("/services", serviceFallback);
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

  const topProjects = mergeShowcaseItems(featuredProjects, projectFallback, 3);
  const featuredServices = mergeShowcaseItems(
    services.filter((service) => service.featured),
    services,
    4,
  );
  const conciseServices = conciseServiceLines.map((line, index) => ({
    line,
    service: featuredServices[index] || null,
  }));

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
          className="relative z-10 flex h-full flex-col justify-center gap-8 lg:max-w-[44rem]"
        >
          <p className="eyebrow">ShonStudio</p>
          <h1 className="font-display text-5xl font-semibold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
            Crafting Worlds Beyond Screens
          </h1>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            Game development, XR experiences, and immersive systems.
          </p>
          <div>
            <MagneticButton
              to="/projects"
              cursorLabel="View"
              className="theme-button-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em]"
            >
              View Projects
            </MagneticButton>
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

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_84%_16%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Focused capabilities, built for impact.
              </h2>
            </div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() =>
                  setEditingEntity({
                    ...serviceTemplate,
                    entityType: "services",
                  })
                }
                className="theme-button-secondary rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Add Service
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {conciseServices.map((item, index) => (
              <motion.article
                key={`${item.line}-${item.service?.slug || index}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl"
              >
                {isAdmin && item.service?._id ? (
                  <AdminEntityActions
                    onEdit={() =>
                      setEditingEntity({
                        ...item.service,
                        entityType: "services",
                      })
                    }
                    onDelete={() => deleteEntity("services", item.service)}
                  />
                ) : null}
                <p className="text-xs uppercase tracking-[0.24em] text-accentSoft/80">
                  {item.service?.category || "Capability"}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-white">
                  {item.line}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(item.service?.highlights || []).slice(0, 2).map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/70 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(0,212,255,0.10),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(122,92,255,0.12),transparent_24%)]" />
        <div className="relative z-10 space-y-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Featured Projects</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Designed to be seen. Built to ship.
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
                      setEditingEntity({
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
                      src={resolveMedia(project.coverImage)}
                      alt={project.title}
                      loading="lazy"
                      className="h-60 w-full object-cover sm:h-64"
                      whileHover={{ scale: 1.07, y: -4 }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent opacity-70" />
                  </div>
                  <div className="space-y-3 px-5 py-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-accentSoft/80">
                      Featured
                    </p>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted">{project.tagline}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/72 px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_34%),radial-gradient(circle_at_72%_18%,rgba(122,92,255,0.14),transparent_30%)]"
          style={{ y: ctaGlowY }}
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Let&apos;s build something unreal.
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
        />
      ) : null}
    </motion.main>
  );
};

export default HomePage;

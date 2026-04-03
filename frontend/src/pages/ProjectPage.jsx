import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityModal from "../components/AdminEntityModal";
import MediaImage from "../components/MediaImage";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext.jsx";
import { useItem } from "../hooks/usePageData";
import { getApiBaseCandidates } from "../utils/apiBase.js";

const fallbackCaseStudyTitle = (projectTitle) => `Case Study: ${projectTitle}`;
const initialProjectGallery = {
  gallery: [],
  screenshotOrientation: "portrait",
};
const GALLERY_PAGE_SIZE = 6;

const fallbackCaseStudy = (project) => ({
  title: project?.caseStudy?.title || fallbackCaseStudyTitle(project?.title || "Project"),
  challenge:
    project?.caseStudy?.challenge ||
    project?.description ||
    "This project focused on building a polished, readable digital experience that could scale for different kinds of users.",
  goals: (project?.caseStudy?.goals || []).filter(Boolean),
  solutions: (project?.caseStudy?.solutions || []).filter((item) => item?.title || item?.summary),
  pillars: (project?.caseStudy?.pillars || []).filter((item) => item?.title || item?.summary),
  conclusion:
    project?.caseStudy?.conclusion ||
    "The final case study balances usability, visual clarity, and a scalable product structure.",
});

const ProjectPageSkeleton = () => (
  <main className="space-y-8 pb-24 sm:space-y-10">
    <section className="section-shell panel-glow overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
        <div className="space-y-5 animate-pulse">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="space-y-3">
            <div className="h-12 w-full max-w-3xl rounded-2xl bg-white/10 sm:h-14" />
            <div className="h-12 w-4/5 max-w-2xl rounded-2xl bg-white/10 sm:h-14" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-full max-w-3xl rounded-xl bg-white/10" />
            <div className="h-5 w-11/12 max-w-2xl rounded-xl bg-white/10" />
            <div className="h-5 w-4/5 max-w-xl rounded-xl bg-white/10" />
          </div>
        </div>

        <div className="h-[12rem] max-w-[20rem] animate-pulse rounded-[1.8rem] border border-white/8 bg-white/[0.05] sm:h-[15rem] lg:h-[18rem] lg:w-full lg:max-w-none" />
      </div>
    </section>

    <section className="section-shell panel-glow p-6 sm:p-8">
      <div className="space-y-5 animate-pulse">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`project-screenshot-skeleton-${index}`}
              className="h-56 rounded-[1.4rem] border border-white/8 bg-white/[0.05]"
            />
          ))}
        </div>
      </div>
    </section>

    <section className="section-shell panel-glow p-6 sm:p-8 lg:p-10">
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="h-4 w-36 rounded-full bg-white/10" />
            <div className="h-10 w-80 rounded-2xl bg-white/10" />
            <div className="space-y-3">
              <div className="h-5 w-full rounded-xl bg-white/10" />
              <div className="h-5 w-11/12 rounded-xl bg-white/10" />
              <div className="h-5 w-4/5 rounded-xl bg-white/10" />
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.05] p-5">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="mt-4 flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`project-tech-skeleton-${index}`}
                  className="h-10 w-24 rounded-full bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`project-section-skeleton-${index}`}
              className="rounded-[1.6rem] border border-white/8 bg-white/[0.05] p-6 sm:p-8"
            >
              <div className="h-8 w-56 rounded-xl bg-white/10" />
              <div className="mt-5 space-y-3">
                <div className="h-5 w-full rounded-xl bg-white/10" />
                <div className="h-5 w-11/12 rounded-xl bg-white/10" />
                <div className="h-5 w-4/5 rounded-xl bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const ProjectScreenshotBand = ({ project, loading = false }) => {
  const screenshots = useMemo(() => {
    const gallerySources = Array.isArray(project?.gallery)
      ? project.gallery.filter(Boolean)
      : [];
    const uniqueSources = [];
    const seen = new Set();

    gallerySources.forEach((item) => {
      const key = String(item || "").trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      uniqueSources.push(key);
    });

    return uniqueSources.map((item, index) => ({
      id: `${index}-${item}`,
      src: resolveMedia(item),
    }));
  }, [project?.gallery]);

  const userOrientation =
    project?.screenshotOrientation === "landscape" || project?.screenshotOrientation === "portrait";
  const screenshotOrientation = userOrientation ? project.screenshotOrientation : "portrait";

  const scrollItems =
    screenshots.length > 1 ? [...screenshots, ...screenshots, ...screenshots] : screenshots;
  const scrollDuration = `${Math.max(
    28,
    Math.min(48, screenshots.length * (screenshotOrientation === "landscape" ? 10 : 8)),
  )}s`;

  if (loading) {
    return (
      <section className="section-shell panel-glow p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Screenshots</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-project-screenshot-${index}`}
              className="h-56 animate-pulse rounded-[1.35rem] border border-white/8 bg-white/[0.05]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!screenshots.length) {
    return (
      <section className="section-shell panel-glow p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Screenshots</p>
        <p className="mt-4 text-base leading-8 text-muted sm:text-lg">No screenshots available yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Game Preview</p>
         
        </div>
      
      </div>

      <div
        className={`case-study-screenshot-band section-shell panel-glow ${
          screenshotOrientation === "landscape"
            ? "case-study-screenshot-band-landscape"
            : "case-study-screenshot-band-portrait"
        }`}
        style={{ "--case-study-scroll-duration": scrollDuration }}
      >
        <div
          className={`case-study-screenshot-track ${
            screenshots.length <= 1 ? "case-study-screenshot-track-static" : ""
          }`}
        >
          {scrollItems.map((item, index) => (
            <figure
              key={`${item.id}-${index}`}
              className="case-study-screenshot-frame"
            >
              <MediaImage
                src={item.src}
                alt={`${project.title} screenshot ${index % screenshots.length + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
                transitionDurationMs={240}
                sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 72vw"
                wrapperClassName="h-full w-full bg-black/20"
                skeletonClassName="bg-white/5"
                imgClassName="case-study-screenshot-image"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState(null);
  const [savedProject, setSavedProject] = useState(null);
  const [additionalGallery, setAdditionalGallery] = useState([]);
  const {
    data: projectData,
    loading,
    error,
    notFound,
    refetch,
  } = useItem(slug ? `/projects/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const {
    data: projectGalleryData,
    loading: galleryLoading,
    refetch: refetchGallery,
  } = useItem(slug ? `/projects/${slug}/gallery?offset=0&limit=${GALLERY_PAGE_SIZE}` : "", {
    enabled: Boolean(slug),
    initialData: initialProjectGallery,
    timeoutMs: 60_000,
  });
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();
  const primaryGallery = useMemo(
    () => (Array.isArray(projectGalleryData?.gallery) ? projectGalleryData.gallery.filter(Boolean) : []),
    [projectGalleryData?.gallery],
  );

  useEffect(() => {
    if (!slug) {
      setAdditionalGallery([]);
      return;
    }

    if (!primaryGallery.length || primaryGallery.length < GALLERY_PAGE_SIZE) {
      setAdditionalGallery([]);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const fetchRemainingGallery = async () => {
      const nextGallery = [];
      const apiBases = getApiBaseCandidates();
      let offset = primaryGallery.length;

      while (active) {
        let batch = null;

        for (const apiBase of apiBases) {
          try {
            const response = await axios.get(
              `${apiBase}/projects/${slug}/gallery?offset=${offset}&limit=${GALLERY_PAGE_SIZE}`,
              {
                signal: controller.signal,
                timeout: 60_000,
              },
            );

            batch = Array.isArray(response?.data?.gallery)
              ? response.data.gallery.filter(Boolean)
              : [];
            break;
          } catch (requestError) {
            if (axios.isCancel(requestError)) {
              return;
            }
          }
        }

        if (!batch?.length) {
          break;
        }

        nextGallery.push(...batch);
        offset += batch.length;

        if (batch.length < GALLERY_PAGE_SIZE) {
          break;
        }
      }

      if (active) {
        setAdditionalGallery(nextGallery);
      }
    };

    fetchRemainingGallery();

    return () => {
      active = false;
      controller.abort();
    };
  }, [primaryGallery, slug]);

  const project = useMemo(() => {
    const baseProject = savedProject || projectData;

    if (!baseProject) {
      return null;
    }

    const nextGallery =
      Array.isArray(savedProject?.gallery)
        ? savedProject.gallery
        : primaryGallery.length || additionalGallery.length
          ? [...primaryGallery, ...additionalGallery]
          : [];
    const nextScreenshotOrientation =
      savedProject?.screenshotOrientation ||
      projectGalleryData?.screenshotOrientation ||
      baseProject.screenshotOrientation ||
      "portrait";

    return {
      ...baseProject,
      gallery: nextGallery,
      screenshotOrientation: nextScreenshotOrientation,
    };
  }, [additionalGallery, primaryGallery, projectData, projectGalleryData, savedProject]);

  useEffect(() => {
    if (savedProject?.slug && savedProject.slug !== slug) {
      setSavedProject(null);
    }
  }, [savedProject, slug]);

  useEffect(() => {
    if (
      savedProject?._id &&
      projectData?._id === savedProject._id &&
      projectData?.updatedAt === savedProject.updatedAt
    ) {
      setSavedProject(null);
    }
  }, [projectData, savedProject]);

  const saveProject = async (payload) => {
    if (!editingProject?._id) {
      return;
    }

    const result = await requestAdmin(`/projects/${editingProject._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const nextProject = result?.data || null;

    if (nextProject) {
      setSavedProject(nextProject);
    }

    signalRefresh();

    if (nextProject?.slug && nextProject.slug !== slug) {
      navigate(`/projects/${nextProject.slug}`, { replace: true });
      return;
    }

    refetch();
    refetchGallery();
  };

  const deleteProject = async () => {
    if (!editingProject?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${editingProject.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/projects/${editingProject._id}`, {
      method: "DELETE",
    });
    setSavedProject(null);
    signalRefresh();
    setEditingProject(null);
    navigate("/projects");
  };

  const topShowcaseImage = useMemo(
    () => resolveMedia(project?.carouselImage || project?.heroImage || project?.cardImage || project?.coverImage),
    [project?.carouselImage, project?.heroImage, project?.cardImage, project?.coverImage],
  );

  if (loading && !project) {
    return <ProjectPageSkeleton />;
  }

  if (error && !project && !notFound) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Unable to load project</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
          <Link to="/projects" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to showcase
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Project not found</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This project does not exist or is not published yet.
          </p>
          <Link to="/projects" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to showcase
          </Link>
        </div>
      </main>
    );
  }

  const summary = project.shortDescription || project.tagline || "No summary available.";
  const description = project.description || "No description available.";
  const making = project.making || description;
  const technologies = project.technologies || [];
  const features = project.features || [];
  const caseStudy = fallbackCaseStudy(project);

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24 sm:space-y-10"
    >
      <section className="section-shell panel-glow overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <div className="space-y-5">
            <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/85 sm:text-xl sm:leading-9 lg:text-2xl">
              {summary}
            </p>
            <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {description}
            </p>
            {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
            {isAdmin && project._id ? (
              <button
                type="button"
                onClick={() => setEditingProject(project)}
                className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Edit full details
              </button>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-black h-[12rem] max-w-[20rem] self-start justify-self-end sm:h-[15rem] lg:h-[18rem] lg:w-full">
            <MediaImage
              src={topShowcaseImage}
              alt={`${project.title} showcase`}
              loading="eager"
              fetchPriority="high"
              transitionDurationMs={240}
              sizes="(min-width: 1024px) 34vw, 100vw"
              wrapperClassName="h-full w-full bg-black/20"
              imgClassName="block h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>


      <Reveal delay={0.02} immediate>
        <ProjectScreenshotBand
          project={project}
          loading={galleryLoading && !(project?.gallery || []).length}
        />
      </Reveal>

      <Reveal delay={0.06} immediate>
        <section className="section-shell panel-glow p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Making of this project</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Making of this project
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                {making}
              </p>
            </div>

            <div className="w-full rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5 lg:max-w-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-accentSoft/80">Tech used</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {technologies.length ? (
                  technologies.map((tech) => (
                    <span
                      key={tech}
                      className="theme-chip rounded-full px-4 py-3 text-base font-medium text-white"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-base leading-8 text-muted">No technologies listed.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                1. The Challenge
              </h3>
              <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{caseStudy.challenge}</p>
              {caseStudy.goals.length ? (
                <div className="mt-6 grid gap-3">
                  {caseStudy.goals.map((goal, index) => (
                    <div
                      key={`${index}-${goal}`}
                      className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-base text-white/85"
                    >
                      {goal}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {caseStudy.solutions.length ? (
              <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  2. Key Features &amp; Solutions
                </h3>
                <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-white/8">
                  <div className="grid grid-cols-1 border-b border-white/8 bg-white/[0.03] sm:grid-cols-2">
                    <div className="px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accentSoft/80">
                      Feature
                    </div>
                    <div className="border-t border-white/8 px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-accentSoft/80 sm:border-l sm:border-t-0">
                      Strategic implementation
                    </div>
                  </div>

                  {caseStudy.solutions.map((item, index) => (
                    <div
                      key={`${index}-${item.title}`}
                      className="grid grid-cols-1 border-b border-white/8 last:border-b-0 sm:grid-cols-2"
                    >
                      <div className="px-5 py-5 text-lg font-medium text-white/90">
                        {item.title}
                      </div>
                      <div className="border-t border-white/8 px-5 py-5 text-base leading-8 text-muted sm:border-l sm:border-t-0">
                        {item.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {caseStudy.pillars.length ? (
              <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  3. Core Experience Pillars
                </h3>
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {caseStudy.pillars.map((pillar, index) => (
                    <div
                      key={`${index}-${pillar.title}`}
                      className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-5"
                    >
                      <h4 className="font-display text-xl font-semibold tracking-tight text-white">
                        {pillar.title}
                      </h4>
                      <p className="mt-3 text-base leading-8 text-muted">{pillar.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                4. Conclusion
              </h3>
              <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{caseStudy.conclusion}</p>
            </div>

            {features.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 sm:p-6"
                  >
                    <p className="text-lg leading-8 text-white/85">{feature}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </Reveal>

      {editingProject ? (
        <AdminEntityModal
          title="Edit project"
          entityType="projects"
          initialValue={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={saveProject}
          onDelete={deleteProject}
        />
      ) : null}
    </motion.main>
  );
};

export default ProjectPage;

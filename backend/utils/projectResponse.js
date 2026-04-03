import mongoose from "mongoose";

const isObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeStringArray = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => normalizeText(item))
        .filter(Boolean)
    : [];

const normalizeCaseStudyRows = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => ({
          title: normalizeText(item?.title),
          summary: normalizeText(item?.summary),
        }))
        .filter((item) => item.title || item.summary)
    : [];

const normalizeProjectCaseStudy = (project) => {
  const caseStudy = isObject(project?.caseStudy) ? project.caseStudy : {};

  return {
    title: normalizeText(caseStudy.title),
    challenge: normalizeText(caseStudy.challenge),
    goals: normalizeStringArray(caseStudy.goals),
    solutions: normalizeCaseStudyRows(caseStudy.solutions),
    pillars: normalizeCaseStudyRows(caseStudy.pillars),
    conclusion: normalizeText(caseStudy.conclusion),
  };
};

const toProjectId = (project) => {
  if (typeof project?._id === "string") {
    return project._id;
  }

  return project?._id ? String(project._id) : "";
};

const normalizeProjectBase = (project) => {
  const title = normalizeText(project?.title);
  const slug = normalizeText(project?.slug) || toProjectId(project);
  const description = normalizeText(project?.description);
  const shortDescription =
    normalizeText(project?.shortDescription) ||
    normalizeText(project?.tagline) ||
    description;
  const tagline =
    normalizeText(project?.tagline) ||
    shortDescription;
  const cardImage =
    normalizeText(project?.cardImage) ||
    normalizeText(project?.coverImage) ||
    normalizeText(project?.heroImage) ||
    normalizeText(project?.carouselImage);
  const carouselImage =
    normalizeText(project?.carouselImage) ||
    normalizeText(project?.heroImage) ||
    cardImage;

  return {
    _id: toProjectId(project),
    title,
    slug,
    tagline,
    shortDescription,
    description,
    making: normalizeText(project?.making) || description,
    cardImage,
    carouselImage,
    technologies: normalizeStringArray(project?.technologies),
    features: normalizeStringArray(project?.features),
    caseStudy: normalizeProjectCaseStudy(project),
    featured: Boolean(project?.featured),
    updatedAt: project?.updatedAt || null,
    createdAt: project?.createdAt || null,
  };
};

export const buildProjectLookupFilter = (identifier) =>
  mongoose.Types.ObjectId.isValid(identifier)
    ? {
        $or: [
          { slug: identifier },
          { _id: identifier },
        ],
      }
    : { slug: identifier };

export const serializeProjectSummary = (project) => {
  const normalized = normalizeProjectBase(project);

  return {
    _id: normalized._id,
    title: normalized.title,
    slug: normalized.slug,
    tagline: normalized.tagline,
    shortDescription: normalized.shortDescription,
    cardImage: normalized.cardImage,
    carouselImage: normalized.carouselImage,
    technologies: normalized.technologies,
    featured: normalized.featured,
    updatedAt: normalized.updatedAt,
  };
};

export const serializeProjectDetail = (project) => {
  const normalized = normalizeProjectBase(project);

  return {
    ...normalized,
  };
};

export const serializeProjectGallery = (project) => ({
  _id: toProjectId(project),
  slug: normalizeText(project?.slug) || toProjectId(project),
  screenshotOrientation:
    project?.screenshotOrientation === "landscape" ? "landscape" : "portrait",
  gallery: normalizeStringArray(project?.gallery),
});

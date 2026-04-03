import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  buildProjectLookupFilter,
  serializeProjectDetail,
  serializeProjectGallery,
  serializeProjectSummary,
} from "../utils/projectResponse.js";

const PROJECT_RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000;
const projectResponseCache = new Map();
const PROJECT_LIST_CACHE_TTL_MS = 60 * 1000;
const PROJECT_LIST_QUERY_TIMEOUT_MS = 30000;
const PROJECT_DETAIL_QUERY_TIMEOUT_MS = 60000;
const PROJECT_GALLERY_DEFAULT_LIMIT = 10;
const PROJECT_GALLERY_MAX_LIMIT = 24;
const projectListCache = new Map();

const runWithTimeout = async (operationPromise, timeoutMs) => {
  let timer = null;

  try {
    return await Promise.race([
      operationPromise,
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Project query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const buildProjectCacheKey = (scope, identifier) => `${scope}:${String(identifier || "").trim()}`;

const getCachedProjectResponse = (key) => {
  const cachedValue = projectResponseCache.get(key);

  if (!cachedValue) {
    return null;
  }

  if (Date.now() - cachedValue.timestamp >= PROJECT_RESPONSE_CACHE_TTL_MS) {
    projectResponseCache.delete(key);
    return null;
  }

  return cachedValue.data;
};

const setCachedProjectResponse = (key, data) => {
  projectResponseCache.set(key, {
    timestamp: Date.now(),
    data,
  });
};

const getCachedProjectList = (key) => {
  const cachedValue = projectListCache.get(key);

  if (!cachedValue) {
    return null;
  }

  if (Date.now() - cachedValue.timestamp >= PROJECT_LIST_CACHE_TTL_MS) {
    projectListCache.delete(key);
    return null;
  }

  return cachedValue.data;
};

const setCachedProjectList = (key, data) => {
  projectListCache.set(key, {
    timestamp: Date.now(),
    data,
  });
};

export const clearProjectListCache = () => {
  projectListCache.clear();
};

export const clearProjectResponseCache = (identifier) => {
  const normalizedIdentifier = String(identifier || "").trim();

  if (!normalizedIdentifier) {
    return;
  }

  projectResponseCache.delete(buildProjectCacheKey("detail", normalizedIdentifier));

  const galleryCacheKey = buildProjectCacheKey("gallery", normalizedIdentifier);
  const paginatedGalleryCachePrefix = `${galleryCacheKey}:`;

  for (const key of projectResponseCache.keys()) {
    if (key === galleryCacheKey || key.startsWith(paginatedGalleryCachePrefix)) {
      projectResponseCache.delete(key);
    }
  }
};

export const getProjects = asyncHandler(async (req, res) => {
  const featuredOnly = req.query.featured === "true";
  const cacheKey = featuredOnly ? "featured" : "all";

  const cachedProjects = getCachedProjectList(cacheKey);

  if (cachedProjects) {
    res.json(cachedProjects);
    return;
  }

  try {
    const filter = featuredOnly ? { featured: true } : {};
    const projects = await runWithTimeout(
      Project.find(
        filter,
        {
          title: 1,
          slug: 1,
          tagline: 1,
          shortDescription: 1,
          cardImage: 1,
          coverImage: 1,
          carouselImage: 1,
          heroImage: 1,
          technologies: 1,
          featured: 1,
          updatedAt: 1,
        },
      )
        .sort({ createdAt: -1 })
        .maxTimeMS(PROJECT_LIST_QUERY_TIMEOUT_MS)
        .lean(),
      PROJECT_LIST_QUERY_TIMEOUT_MS,
    );
    const serializedProjects = projects.map(serializeProjectSummary);
    setCachedProjectList(cacheKey, serializedProjects);
    res.json(serializedProjects);
    return;
  } catch (error) {
    res.status(503);
    throw new Error("Project data source is temporarily unavailable. Please try again.");
  }
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const cacheKey = buildProjectCacheKey("detail", req.params.slug);
  const cachedProject = getCachedProjectResponse(cacheKey);

  if (cachedProject) {
    res.json(cachedProject);
    return;
  }

  let project = null;

  try {
    project = await runWithTimeout(
      Project.findOne(
        buildProjectLookupFilter(req.params.slug),
        {
          title: 1,
          slug: 1,
          tagline: 1,
          shortDescription: 1,
          description: 1,
          making: 1,
          cardImage: 1,
          coverImage: 1,
          carouselImage: 1,
          heroImage: 1,
          technologies: 1,
          features: 1,
          caseStudy: 1,
          featured: 1,
          updatedAt: 1,
          createdAt: 1,
        },
      )
        .maxTimeMS(PROJECT_DETAIL_QUERY_TIMEOUT_MS)
        .lean(),
      PROJECT_DETAIL_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Project data source is temporarily unavailable. Please try again.");
  }

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const serializedProject = serializeProjectDetail(project);
  setCachedProjectResponse(cacheKey, serializedProject);
  res.json(serializedProject);
});

export const getProjectGalleryBySlug = asyncHandler(async (req, res) => {
  const requestedOffset = Number(req.query.offset || 0);
  const requestedLimit = Number(req.query.limit || PROJECT_GALLERY_DEFAULT_LIMIT);
  const offset = Number.isFinite(requestedOffset) && requestedOffset > 0 ? Math.floor(requestedOffset) : 0;
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(PROJECT_GALLERY_MAX_LIMIT, Math.max(1, Math.floor(requestedLimit)))
    : PROJECT_GALLERY_DEFAULT_LIMIT;

  const cacheKey = buildProjectCacheKey("gallery", `${req.params.slug}:${offset}:${limit}`);
  const cachedGallery = getCachedProjectResponse(cacheKey);

  if (cachedGallery) {
    res.json(cachedGallery);
    return;
  }

  let project = null;

  try {
    project = await runWithTimeout(
      Project.findOne(
        buildProjectLookupFilter(req.params.slug),
        {
          slug: 1,
          gallery: { $slice: [offset, limit] },
          screenshotOrientation: 1,
        },
      )
        .maxTimeMS(PROJECT_DETAIL_QUERY_TIMEOUT_MS)
        .lean(),
      PROJECT_DETAIL_QUERY_TIMEOUT_MS,
    );
  } catch {
    res.status(503);
    throw new Error("Project gallery data source is temporarily unavailable. Please try again.");
  }

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const serializedGallery = serializeProjectGallery(project);
  setCachedProjectResponse(cacheKey, serializedGallery);
  res.json(serializedGallery);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

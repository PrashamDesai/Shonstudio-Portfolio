const FALLBACK_IMAGE_KEYS = {
  projects: ["aurora-drift", "mech-siege-tactics", "pulse-xr-lab"],
  services: ["mech-siege-tactics", "aurora-drift", "pulse-xr-lab"],
  training: ["pulse-xr-lab", "aurora-drift", "mech-siege-tactics"],
  tools: ["modular-environment-kit", "adaptive-dialogue-builder", "audio-moodboard-library"],
};

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toArray = (value) => (Array.isArray(value) ? value : []);

const pickFirstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

const normalizeItem = (item, categoryKey, index) => {
  const title = pickFirstText(item?.title, item?.name);

  if (!title) {
    return null;
  }

  const shortDescription = pickFirstText(
    item?.shortDescription,
    item?.summary,
    item?.tagline,
    item?.description,
    item?.useCase,
  );
  const fallbackPool = FALLBACK_IMAGE_KEYS[categoryKey] || [];
  const carouselImage =
    pickFirstText(
      item?.carouselImage,
      item?.heroImage,
      item?.coverImage,
      item?.image,
      item?.thumbnail,
    ) || fallbackPool[index % Math.max(fallbackPool.length, 1)] || "hero";

  return {
    id: item?._id || item?.id || item?.slug || `${categoryKey}-${slugify(title)}-${index}`,
    slug: item?.slug || slugify(title),
    title,
    shortDescription: shortDescription || "Built for production-ready outcomes.",
    carouselImage,
  };
};

const createCategory = (key, label, source) => {
  const items = toArray(source)
    .map((item, index) => normalizeItem(item, key, index))
    .filter(Boolean)
    .slice(0, 8);

  return {
    key,
    label,
    items,
  };
};

export const buildHeroCarouselData = ({ projects, services, courses, tools }) => [
  createCategory("projects", "Projects", projects),
  createCategory("services", "Services", services),
  createCategory("training", "Training", courses),
  createCategory("tools", "Tools", tools),
].filter((category) => category.items.length);


const CATEGORY_DEFINITIONS = [
  {
    key: "2D Assets",
    slug: "2d-assets",
    title: "2D Assets",
    description: "Sprites, props, and tile-ready packs for polished 2D pipelines.",
    fallbackImage: "aurora-drift",
  },
  {
    key: "3D Assets",
    slug: "3d-assets",
    title: "3D Assets",
    description: "Environment kits and 3D content blocks for rapid world building.",
    fallbackImage: "modular-environment-kit",
  },
  {
    key: "UI Packs",
    slug: "ui-packs",
    title: "UI Packs",
    description: "Production UI systems for HUDs, menus, and interaction layers.",
    fallbackImage: "mech-siege-hud",
  },
  {
    key: "VFX & Particles",
    slug: "vfx-particles",
    title: "VFX & Particles",
    description: "Motion, impact, and atmosphere assets for visual depth.",
    fallbackImage: "pulse-xr-lab",
  },
  {
    key: "Dev Tools",
    slug: "dev-tools",
    title: "Dev Tools",
    description: "Utility tooling that accelerates build, iteration, and QA workflows.",
    fallbackImage: "adaptive-dialogue-builder",
  },
];

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inferCategory = (tool = {}) => {
  const tags = (tool.tags || []).map((item) => String(item).toLowerCase());
  const type = String(tool.type || "").toLowerCase();
  const title = String(tool.title || "").toLowerCase();

  if (tags.some((item) => item.includes("2d") || item.includes("pixel")) || type.includes("2d")) {
    return "2D Assets";
  }
  if (tags.some((item) => item.includes("ui") || item.includes("hud")) || type.includes("ui")) {
    return "UI Packs";
  }
  if (tags.some((item) => item.includes("vfx") || item.includes("particle") || item.includes("audio"))) {
    return "VFX & Particles";
  }
  if (type.includes("tool") || tags.some((item) => item.includes("tool"))) {
    return "Dev Tools";
  }
  if (title.includes("environment") || title.includes("3d") || tags.some((item) => item.includes("environment"))) {
    return "3D Assets";
  }

  return "Dev Tools";
};

export const getToolCategory = (tool = {}) => {
  const rawCategory = tool.category || inferCategory(tool);
  const found = CATEGORY_DEFINITIONS.find((item) => item.key.toLowerCase() === String(rawCategory).toLowerCase());
  return found?.key || inferCategory(tool);
};

export const getCategoryBySlug = (categorySlug) =>
  CATEGORY_DEFINITIONS.find((item) => item.slug === categorySlug) || null;

export const getToolCategoriesWithCounts = (tools = []) =>
  CATEGORY_DEFINITIONS.map((category) => {
    const matched = tools.filter((tool) => getToolCategory(tool) === category.key);
    const featuredImage =
      matched[0]?.cardImage ||
      matched[0]?.carouselImage ||
      matched[0]?.image ||
      category.fallbackImage;

    return {
      ...category,
      count: matched.length,
      featuredImage,
    };
  });

export const filterToolsByCategorySlug = (tools = [], categorySlug = "") => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return [];
  }

  return tools.filter((tool) => getToolCategory(tool) === category.key);
};

export const mapToolForCarousel = (tool = {}, index = 0) => {
  const resolvedCategory = getToolCategory(tool);
  const categorySlug = CATEGORY_DEFINITIONS.find((item) => item.key === resolvedCategory)?.slug || "";

  return {
    id: tool._id || tool.id || tool.slug || `tool-${index}`,
    slug: tool.slug || slugify(tool.title || `tool-${index}`),
    categorySlug,
    title: tool.title || "Tool",
    shortDescription: tool.shortDescription || tool.description || tool.useCase || "Production-ready studio tool.",
    carouselImage: tool.carouselImage || tool.cardImage || tool.image || "adaptive-dialogue-builder",
  };
};

export { CATEGORY_DEFINITIONS };


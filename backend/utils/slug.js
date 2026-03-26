const slugPattern = /[^a-z0-9]+/g;

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(slugPattern, "-")
    .replace(/^-|-$/g, "");

export const resolveUniqueSlug = async (Model, source, excludeId = null) => {
  const baseSlug = slugify(source);

  if (!baseSlug) {
    return "";
  }

  let candidate = baseSlug;
  let suffix = 2;

  // Keep incrementing until the candidate slug is unique for the target model.
  // This protects dynamic route generation when two items share the same title.
  while (true) {
    const query = { slug: candidate };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.exists(query);

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

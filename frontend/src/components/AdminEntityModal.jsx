import { useEffect, useMemo, useState } from "react";

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");

const createProjectForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  tagline: value.tagline || "",
  description: value.description || "",
  coverImage: value.coverImage || "",
  heroImage: value.heroImage || "",
  gallery: joinLines(value.gallery),
  technologies: joinLines(value.technologies),
  featured: Boolean(value.featured),
  roleBreakdown:
    Array.isArray(value.roleBreakdown) && value.roleBreakdown.length
      ? value.roleBreakdown.map((item) => ({
          title: item?.title || "",
          summary: item?.summary || "",
        }))
      : [{ title: "", summary: "" }],
});

const createServiceForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  summary: value.summary || "",
  description: value.description || "",
  category: value.category || "",
  icon: value.icon || "spark",
  highlights: joinLines(value.highlights),
  deliveryFormat: value.deliveryFormat || "",
  featured: Boolean(value.featured),
});

const createToolForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  type: value.type || "",
  image: value.image || "",
  description: value.description || "",
  useCase: value.useCase || "",
  tags: joinLines(value.tags),
});

const createCourseForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  duration: value.duration || "",
  summary: value.summary || "",
  curriculum: joinLines(value.curriculum),
  outcomes: joinLines(value.outcomes),
});

const createVisionSceneForm = (value = {}) => ({
  kicker: value.kicker || "",
  pill: value.pill || "",
  title: value.title || "",
  description: value.description || "",
  panelTitle: value.panelTitle || "",
  panelSummary: value.panelSummary || "",
  panelImage: value.panelImage || "",
  bullets: joinLines(value.bullets),
  featured: Boolean(value.featured ?? true),
});

const buildInitialForm = (entityType, value) => {
  switch (entityType) {
    case "projects":
      return createProjectForm(value);
    case "services":
      return createServiceForm(value);
    case "tools":
      return createToolForm(value);
    case "courses":
      return createCourseForm(value);
    case "vision-scenes":
      return createVisionSceneForm(value);
    default:
      return {};
  }
};

const buildPayload = (entityType, form) => {
  switch (entityType) {
    case "projects":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        coverImage: form.coverImage.trim(),
        heroImage: form.heroImage.trim(),
        gallery: splitLines(form.gallery),
        technologies: splitLines(form.technologies),
        featured: Boolean(form.featured),
        roleBreakdown: (form.roleBreakdown || [])
          .map((item) => ({
            title: item.title.trim(),
            summary: item.summary.trim(),
          }))
          .filter((item) => item.title || item.summary),
      };
    case "services":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        icon: form.icon.trim(),
        highlights: splitLines(form.highlights),
        deliveryFormat: form.deliveryFormat.trim(),
        featured: Boolean(form.featured),
      };
    case "tools":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        type: form.type.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        useCase: form.useCase.trim(),
        tags: splitLines(form.tags),
      };
    case "courses":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        duration: form.duration.trim(),
        summary: form.summary.trim(),
        curriculum: splitLines(form.curriculum),
        outcomes: splitLines(form.outcomes),
      };
    case "vision-scenes":
      return {
        kicker: form.kicker.trim(),
        pill: form.pill.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        panelTitle: form.panelTitle.trim(),
        panelSummary: form.panelSummary.trim(),
        panelImage: form.panelImage.trim(),
        bullets: splitLines(form.bullets),
        featured: Boolean(form.featured),
      };
    default:
      return {};
  }
};

const textInputClass =
  "theme-input mt-2 w-full rounded-[1rem] px-4 py-3 text-sm text-white";
const textareaClass =
  "theme-input mt-2 min-h-[7.5rem] w-full rounded-[1rem] px-4 py-3 text-sm text-white";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    {children}
  </label>
);

const ImagePreview = ({ src, alt, className = "h-40" }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      className={`mt-3 w-full rounded-[1rem] border border-white/10 object-cover ${className}`}
    />
  ) : null;

const AdminEntityModal = ({ title, entityType, initialValue, onClose, onSave }) => {
  const [form, setForm] = useState(() => buildInitialForm(entityType, initialValue));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    setForm(buildInitialForm(entityType, initialValue));
  }, [entityType, initialValue]);

  const isProject = entityType === "projects";

  const sectionTitle = useMemo(() => {
    switch (entityType) {
      case "projects":
        return "Project details";
      case "services":
        return "Service details";
      case "tools":
        return "Tool details";
    case "courses":
      return "Course details";
    case "vision-scenes":
      return "Studio vision scene";
    default:
      return "Content details";
    }
  }, [entityType]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSingleImageUpload = async (field, file) => {
    if (!file) {
      return;
    }

    setError("");

    try {
      const imageData = await readFileAsDataUrl(file);
      updateField(field, imageData);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to load image.");
    }
  };

  const handleGalleryUpload = async (files) => {
    if (!files?.length) {
      return;
    }

    setError("");

    try {
      const uploadedImages = await Promise.all(Array.from(files).map((file) => readFileAsDataUrl(file)));
      setForm((current) => ({
        ...current,
        gallery: joinLines([...(splitLines(current.gallery) || []), ...uploadedImages]),
      }));
    } catch (uploadError) {
      setError(uploadError.message || "Unable to load gallery images.");
    }
  };

  const updateRole = (index, field, value) => {
    setForm((current) => ({
      ...current,
      roleBreakdown: current.roleBreakdown.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const addRole = () => {
    setForm((current) => ({
      ...current,
      roleBreakdown: [...(current.roleBreakdown || []), { title: "", summary: "" }],
    }));
  };

  const removeRole = (index) => {
    setForm((current) => ({
      ...current,
      roleBreakdown: current.roleBreakdown.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSave(buildPayload(entityType, form));
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-shell">
      <div className="admin-modal-panel w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-muted">{sectionTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-secondary-button text-xs"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title">
              <input
                value={form.title || ""}
                onChange={(event) => updateField("title", event.target.value)}
                className={textInputClass}
                required
              />
            </Field>

            <Field label="Slug" hint="Optional. Leave blank to generate it from the title.">
              {entityType !== "vision-scenes" ? (
                <input
                  value={form.slug || ""}
                  onChange={(event) => updateField("slug", event.target.value)}
                  className={textInputClass}
                />
              ) : null}
            </Field>

            {entityType === "projects" ? (
              <Field label="Tagline">
                <input
                  value={form.tagline || ""}
                  onChange={(event) => updateField("tagline", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "vision-scenes" ? (
              <Field label="Kicker">
                <input
                  value={form.kicker || ""}
                  onChange={(event) => updateField("kicker", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "vision-scenes" ? (
              <Field label="Pill label">
                <input
                  value={form.pill || ""}
                  onChange={(event) => updateField("pill", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "services" ? (
              <Field label="Category">
                <input
                  value={form.category || ""}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "services" ? (
              <Field label="Icon">
                <input
                  value={form.icon || ""}
                  onChange={(event) => updateField("icon", event.target.value)}
                  className={textInputClass}
                />
              </Field>
            ) : null}

            {entityType === "tools" ? (
              <Field label="Type">
                <input
                  value={form.type || ""}
                  onChange={(event) => updateField("type", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "courses" ? (
              <Field label="Duration">
                <input
                  value={form.duration || ""}
                  onChange={(event) => updateField("duration", event.target.value)}
                  className={textInputClass}
                  required
                />
              </Field>
            ) : null}

            {entityType === "projects" ? (
              <Field label="Cover image key">
                <input
                  value={form.coverImage || ""}
                  onChange={(event) => updateField("coverImage", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("coverImage", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.coverImage} alt="Project cover preview" className="h-44" />
              </Field>
            ) : null}

            {entityType === "projects" ? (
              <Field label="Hero carousel image">
                <input
                  value={form.heroImage || ""}
                  onChange={(event) => updateField("heroImage", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("heroImage", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.heroImage} alt="Hero image preview" className="h-44" />
              </Field>
            ) : null}

            {entityType === "vision-scenes" ? (
              <Field label="Panel image">
                <input
                  value={form.panelImage || ""}
                  onChange={(event) => updateField("panelImage", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("panelImage", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.panelImage} alt="Panel image preview" className="h-44" />
              </Field>
            ) : null}

            {entityType === "tools" ? (
              <Field label="Image key">
                <input
                  value={form.image || ""}
                  onChange={(event) => updateField("image", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("image", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.image} alt="Tool preview" className="h-44" />
              </Field>
            ) : null}

            {entityType === "services" ? (
              <Field label="Delivery format">
                <input
                  value={form.deliveryFormat || ""}
                  onChange={(event) => updateField("deliveryFormat", event.target.value)}
                  className={textInputClass}
                />
              </Field>
            ) : null}

            {entityType === "projects" || entityType === "services" ? (
              <label className="mt-7 flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-white">Feature this item on the homepage</span>
              </label>
            ) : null}

            {entityType === "vision-scenes" ? (
              <label className="mt-7 flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-white">Show this scene in studio vision</span>
              </label>
            ) : null}

            {entityType !== "vision-scenes" ? (
              <div className="md:col-span-2">
                <Field label={entityType === "services" ? "Summary" : "Description"}>
                  <textarea
                    value={
                      entityType === "services"
                        ? form.summary || ""
                        : entityType === "courses"
                          ? form.summary || ""
                          : form.description || ""
                    }
                    onChange={(event) =>
                      updateField(
                        entityType === "services" || entityType === "courses"
                          ? "summary"
                          : "description",
                        event.target.value,
                      )
                    }
                    className={textareaClass}
                    required
                  />
                </Field>
              </div>
            ) : null}

            {entityType === "services" || entityType === "tools" ? (
              <div className="md:col-span-2">
                <Field label={entityType === "services" ? "Full description" : "Use case"}>
                  <textarea
                    value={entityType === "services" ? form.description || "" : form.useCase || ""}
                    onChange={(event) =>
                      updateField(entityType === "services" ? "description" : "useCase", event.target.value)
                    }
                    className={textareaClass}
                    required
                  />
                </Field>
              </div>
            ) : null}

            {entityType === "vision-scenes" ? (
              <>
                <div className="md:col-span-2">
                  <Field label="Vision description">
                    <textarea
                      value={form.description || ""}
                      onChange={(event) => updateField("description", event.target.value)}
                      className={textareaClass}
                      required
                    />
                  </Field>
                </div>

                <Field label="Panel title">
                  <input
                    value={form.panelTitle || ""}
                    onChange={(event) => updateField("panelTitle", event.target.value)}
                    className={textInputClass}
                  />
                </Field>

                <Field label="Panel summary">
                  <textarea
                    value={form.panelSummary || ""}
                    onChange={(event) => updateField("panelSummary", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Supporting bullets" hint="Enter one support point per line.">
                    <textarea
                      value={form.bullets || ""}
                      onChange={(event) => updateField("bullets", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {entityType === "tools" ? (
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    value={form.description || ""}
                    onChange={(event) => updateField("description", event.target.value)}
                    className={textareaClass}
                    required
                  />
                </Field>
              </div>
            ) : null}

            {entityType === "projects" ? (
              <>
                <div className="md:col-span-2">
                  <Field label="Project description">
                    <textarea
                      value={form.description || ""}
                      onChange={(event) => updateField("description", event.target.value)}
                      className={textareaClass}
                      required
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Gallery image keys" hint="Enter one image key per line.">
                    <textarea
                      value={form.gallery || ""}
                      onChange={(event) => updateField("gallery", event.target.value)}
                      className={textareaClass}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => handleGalleryUpload(event.target.files)}
                      className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                    {splitLines(form.gallery).length ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {splitLines(form.gallery).map((item, index) => (
                          <div key={`${index}-${item.slice(0, 12)}`} className="space-y-2">
                            <ImagePreview
                              src={item}
                              alt={`Gallery preview ${index + 1}`}
                              className="h-32"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateField(
                                  "gallery",
                                  joinLines(splitLines(form.gallery).filter((_, itemIndex) => itemIndex !== index)),
                                )
                              }
                              className="admin-danger-button px-3 py-2 text-xs"
                            >
                              Remove image
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Technologies" hint="Enter one technology per line.">
                    <textarea
                      value={form.technologies || ""}
                      onChange={(event) => updateField("technologies", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {entityType === "services" ? (
              <div className="md:col-span-2">
                <Field label="Highlights" hint="Enter one highlight per line.">
                  <textarea
                    value={form.highlights || ""}
                    onChange={(event) => updateField("highlights", event.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            ) : null}

            {entityType === "tools" ? (
              <div className="md:col-span-2">
                <Field label="Tags" hint="Enter one tag per line.">
                  <textarea
                    value={form.tags || ""}
                    onChange={(event) => updateField("tags", event.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            ) : null}

            {entityType === "courses" ? (
              <>
                <div className="md:col-span-2">
                  <Field label="Curriculum" hint="Enter one curriculum point per line.">
                    <textarea
                      value={form.curriculum || ""}
                      onChange={(event) => updateField("curriculum", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Outcomes" hint="Enter one outcome per line.">
                    <textarea
                      value={form.outcomes || ""}
                      onChange={(event) => updateField("outcomes", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </>
            ) : null}
          </div>

          {isProject ? (
            <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Role breakdown</h3>
                  <p className="mt-1 text-sm text-muted">
                    Add the project roles or delivery blocks shown in the case study.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addRole}
                  className="admin-secondary-button px-4 py-2"
                >
                  Add role
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {(form.roleBreakdown || []).map((item, index) => (
                  <div key={`${index}-${item.title}`} className="rounded-[1.15rem] border border-white/8 p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <Field label="Role title">
                        <input
                          value={item.title}
                          onChange={(event) => updateRole(index, "title", event.target.value)}
                          className={textInputClass}
                        />
                      </Field>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="admin-danger-button px-4 py-3"
                          disabled={(form.roleBreakdown || []).length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <Field label="Role summary">
                      <textarea
                        value={item.summary}
                        onChange={(event) => updateRole(index, "summary", event.target.value)}
                        className={textareaClass}
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <div className="mt-6 flex justify-end gap-3 border-t border-white/8 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="admin-secondary-button px-5 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-save-button disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEntityModal;

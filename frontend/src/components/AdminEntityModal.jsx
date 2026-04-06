import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "./ui/Modal";

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");
const createCaseStudyRow = () => ({ title: "", summary: "" });
const normalizeCaseStudyRows = (items) => {
  const rows = Array.isArray(items)
    ? items.map((item) => ({
        title: String(item?.title || "").trim(),
        summary: String(item?.summary || "").trim(),
      }))
    : [];

  return rows.length ? rows : [createCaseStudyRow()];
};
const sanitizeCaseStudyRows = (items) =>
  Array.isArray(items)
    ? items
        .map((item) => ({
          title: String(item?.title || "").trim(),
          summary: String(item?.summary || "").trim(),
        }))
        .filter((item) => item.title || item.summary)
    : [];

const MAX_ADMIN_PAYLOAD_BYTES = 14 * 1024 * 1024;
const MAX_IMAGE_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_OUTPUT_BYTES = 750 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const TARGET_JPEG_QUALITY = 0.78;
const MIN_JPEG_QUALITY = 0.62;

const estimatePayloadSize = (payload) => {
  try {
    return new Blob([JSON.stringify(payload)]).size;
  } catch {
    return 0;
  }
};

const createProjectForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  shortDescription: value.shortDescription || value.tagline || "",
  tagline: value.tagline || value.shortDescription || "",
  description: value.description || value.caseStudy?.challenge || value.shortDescription || value.tagline || "",
  making: value.making || "",
  cardImage: value.cardImage || value.coverImage || "",
  carouselImage: value.carouselImage || value.heroImage || value.cardImage || value.coverImage || "",
  gallery: joinLines(value.gallery),
  screenshotOrientation: value.screenshotOrientation || "portrait",
  technologies: joinLines(value.technologies),
  features: joinLines(value.features),
  caseStudyTitle: value.caseStudy?.title || "",
  caseStudyChallengeDescription: value.caseStudy?.challenge || "",
  caseStudyChallengeBullets: joinLines(value.caseStudy?.goals),
  caseStudySolutions: normalizeCaseStudyRows(value.caseStudy?.solutions),
  caseStudyPillars: normalizeCaseStudyRows(value.caseStudy?.pillars),
  caseStudyConclusion: value.caseStudy?.conclusion || "",
  featured: Boolean(value.featured),
});

const createServiceForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  shortDescription: value.shortDescription || value.summary || "",
  summary: value.summary || value.shortDescription || "",
  cardImage: value.cardImage || "",
  carouselImage: value.carouselImage || value.cardImage || "",
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
  shortDescription: value.shortDescription || value.description || "",
  cardImage: value.cardImage || value.image || "",
  carouselImage: value.carouselImage || value.cardImage || value.image || "",
  type: value.type || "",
  category: value.category || "Dev Tools",
  image: value.image || value.cardImage || "",
  description: value.description || "",
  useCase: value.useCase || "",
  features: joinLines(value.features),
  techUsed: joinLines(value.techUsed),
  price: value.price || "",
  ctaLabel: value.ctaLabel || "Use Tool",
  ctaUrl: value.ctaUrl || "",
  gallery: joinLines(value.gallery),
  tags: joinLines(value.tags),
});

const createCourseForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  shortDescription: value.shortDescription || value.summary || "",
  cardImage: value.cardImage || "",
  carouselImage: value.carouselImage || value.cardImage || "",
  duration: value.duration || "",
  level: value.level || "Beginner",
  summary: value.summary || value.shortDescription || "",
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
    case "projects": {
      const projectSummary = form.shortDescription.trim();
      const projectDescription = (
        form.description ||
        form.caseStudyChallengeDescription ||
        form.shortDescription
      ).trim();

      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: projectSummary,
        tagline: projectSummary,
        description: projectDescription,
        making: form.making.trim(),
        cardImage: form.cardImage.trim(),
        carouselImage: form.carouselImage.trim(),
        gallery: splitLines(form.gallery),
        screenshotOrientation: form.screenshotOrientation === "landscape" ? "landscape" : "portrait",
        technologies: splitLines(form.technologies),
        features: splitLines(form.features),
        caseStudy: {
          title: form.caseStudyTitle.trim(),
          challenge: form.caseStudyChallengeDescription.trim(),
          goals: splitLines(form.caseStudyChallengeBullets),
          solutions: sanitizeCaseStudyRows(form.caseStudySolutions),
          pillars: sanitizeCaseStudyRows(form.caseStudyPillars),
          conclusion: form.caseStudyConclusion.trim(),
        },
        featured: Boolean(form.featured),
      };
    }
    case "services":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        cardImage: form.cardImage.trim(),
        carouselImage: form.carouselImage.trim(),
        summary: (form.shortDescription || form.summary).trim(),
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
        shortDescription: form.shortDescription.trim(),
        cardImage: form.cardImage.trim(),
        carouselImage: form.carouselImage.trim(),
        type: form.type.trim(),
        category: form.category.trim(),
        image: (form.cardImage || form.image).trim(),
        description: form.description.trim(),
        useCase: form.useCase.trim(),
        features: splitLines(form.features),
        techUsed: splitLines(form.techUsed),
        price: form.price.trim(),
        ctaLabel: form.ctaLabel.trim(),
        ctaUrl: form.ctaUrl.trim(),
        gallery: splitLines(form.gallery),
        tags: splitLines(form.tags),
      };
    case "courses":
      return {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        cardImage: form.cardImage.trim(),
        carouselImage: form.carouselImage.trim(),
        duration: form.duration.trim(),
        level: form.level.trim(),
        summary: (form.shortDescription || form.summary).trim(),
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
const tableInputClass =
  "theme-input w-full rounded-[0.95rem] px-3 py-3 text-sm text-white";
const tableTextareaClass =
  "theme-input min-h-[6.25rem] w-full rounded-[0.95rem] px-3 py-3 text-sm text-white";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const readBlobAsDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to process image."));
    reader.readAsDataURL(blob);
  });

const loadImage = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to process image."));
    image.src = dataUrl;
  });

const compressImageFile = async (file) => {
  if (!file) return "";

  if (file.size > MAX_IMAGE_INPUT_BYTES) {
    throw new Error("Image is too large. Please pick a file under 8 MB.");
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  let image;

  try {
    image = await loadImage(originalDataUrl);
  } catch (error) {
    throw new Error(error?.message || "Unable to process image.");
  }

  const needsResize = Math.max(image.width, image.height) > MAX_IMAGE_DIMENSION;

  if (!needsResize && file.size <= MAX_IMAGE_OUTPUT_BYTES) {
    return originalDataUrl;
  }

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const toDataUrlWithQuality = (quality) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error("Unable to encode image."));
            return;
          }
          resolve({
            blob,
            dataUrl: await readBlobAsDataUrl(blob),
          });
        },
        "image/jpeg",
        quality,
      );
    });

  let quality = TARGET_JPEG_QUALITY;
  let encoded = await toDataUrlWithQuality(quality);

  if (encoded.blob.size > MAX_IMAGE_OUTPUT_BYTES) {
    quality = Math.max(MIN_JPEG_QUALITY, TARGET_JPEG_QUALITY - 0.16);
    encoded = await toDataUrlWithQuality(quality);
  }

  return encoded.dataUrl;
};

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    {children}
  </label>
);

const ImagePreview = ({ src, alt, className = "h-40", fitClassName = "object-cover" }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      className={`mt-3 w-full rounded-[1rem] border border-white/10 ${fitClassName} ${className}`}
    />
  ) : null;

const SectionBlock = ({ title, hint }) => (
  <div className="md:col-span-2 rounded-[1.15rem] border border-white/8 bg-white/[0.03] px-4 py-4">
    <h3 className="text-base font-semibold text-white">{title}</h3>
    {hint ? <p className="mt-1 text-sm leading-6 text-muted">{hint}</p> : null}
  </div>
);

const CaseStudyRowTable = ({
  label,
  hint,
  rows,
  titleLabel,
  descriptionLabel,
  addLabel,
  onAdd,
  onChange,
  onRemove,
}) => (
  <div className="md:col-span-2">
    <Field label={label} hint={hint}>
      <div className="mt-3 space-y-3">
        <div className="hidden grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)_auto] gap-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accentSoft/80 md:grid">
          <span>{titleLabel}</span>
          <span>{descriptionLabel}</span>
          <span className="text-right">Action</span>
        </div>

        {(rows || []).map((item, index) => (
          <div
            key={`${label}-${index}`}
            className="grid gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] p-3 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)_auto] md:items-start"
          >
            <div className="space-y-2">
              <span className="text-xs font-medium text-white md:hidden">{titleLabel}</span>
              <input
                value={item.title || ""}
                onChange={(event) => onChange(index, "title", event.target.value)}
                className={tableInputClass}
                placeholder={titleLabel}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-white md:hidden">{descriptionLabel}</span>
              <textarea
                value={item.summary || ""}
                onChange={(event) => onChange(index, "summary", event.target.value)}
                className={tableTextareaClass}
                placeholder={descriptionLabel}
              />
            </div>

            <div className="flex justify-end md:pt-9">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="admin-danger-button px-4 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="admin-secondary-button mt-4 px-4 py-2 text-sm"
      >
        {addLabel}
      </button>
    </Field>
  </div>
);

const AdminEntityModal = ({ title, entityType, initialValue, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(() => buildInitialForm(entityType, initialValue));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    setForm(buildInitialForm(entityType, initialValue));
  }, [entityType, initialValue]);

  const isPortraitProjectGallery = (form.screenshotOrientation || "portrait") !== "landscape";

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

  const modalMaxWidthClass = useMemo(() => {
    if (entityType === "projects") {
      return "max-w-5xl";
    }

    if (entityType === "services" || entityType === "courses") {
      return "max-w-4xl";
    }

    return "max-w-3xl";
  }, [entityType]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCaseStudyRow = (field, index, key, value) => {
    setForm((current) => ({
      ...current,
      [field]: (current[field] || []).map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  };

  const addCaseStudyRow = (field) => {
    setForm((current) => ({
      ...current,
      [field]: [...(current[field] || []), createCaseStudyRow()],
    }));
  };

  const removeCaseStudyRow = (field, index) => {
    setForm((current) => {
      const nextRows = (current[field] || []).filter((_, currentIndex) => currentIndex !== index);

      return {
        ...current,
        [field]: nextRows.length ? nextRows : [createCaseStudyRow()],
      };
    });
  };

  const handleSingleImageUpload = async (field, file) => {
    if (!file) {
      return;
    }

    setError("");

    try {
      const imageData = await compressImageFile(file);
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
      const uploadedImages = await Promise.all(Array.from(files).map((file) => compressImageFile(file)));
      setForm((current) => ({
        ...current,
        gallery: joinLines([...(splitLines(current.gallery) || []), ...uploadedImages]),
      }));
    } catch (uploadError) {
      setError(uploadError.message || "Unable to load gallery images.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = buildPayload(entityType, form);
      const payloadSize = estimatePayloadSize(payload);

      if (payloadSize > MAX_ADMIN_PAYLOAD_BYTES) {
        throw new Error(
          entityType === "projects"
            ? "This case study is too large to save in one request. Reduce screenshot count or size, then try again."
            : "This entry is too large to save in one request. Reduce uploaded image sizes, then try again.",
        );
      }

      await onSave(payload);
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} maxWidthClass={modalMaxWidthClass} panelClassName="admin-modal-panel">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-muted">{sectionTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-secondary-button w-full text-xs sm:w-auto"
          >
            Close
          </button>
        </div>

        <form
          id="admin-entity-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {entityType === "services" ? (
              <SectionBlock
                title="Service Hero and Messaging"
                hint="Manage the service title, summary, and category data shown at the top of the page."
              />
            ) : null}

            {entityType === "courses" ? (
              <SectionBlock
                title="Training Module Header"
                hint="Configure the training title, level, duration, and summary shown in the module header."
              />
            ) : null}

            {entityType === "projects" ? (
              <SectionBlock
                title="Project Basics"
                hint="These fields control the project title, slug, and summary used across showcase cards."
              />
            ) : null}

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

            {entityType !== "vision-scenes" ? (
              <div className="md:col-span-2">
                <Field
                  label="Short description"
                  hint={
                    entityType === "projects"
                      ? "This summary is used in project cards and compact showcase previews."
                      : "Primary line used in cards and compact previews."
                  }
                >
                  <textarea
                    value={form.shortDescription || ""}
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    className={textareaClass}
                    required
                  />
                </Field>
              </div>
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

            {entityType === "tools" ? (
              <Field label="Category">
                <input
                  value={form.category || ""}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={textInputClass}
                  placeholder="2D Assets / 3D Assets / UI Packs / VFX & Particles / Dev Tools"
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

            {entityType === "courses" ? (
              <Field label="Level">
                <input
                  value={form.level || ""}
                  onChange={(event) => updateField("level", event.target.value)}
                  className={textInputClass}
                  placeholder="Beginner, Intermediate, Advanced"
                />
              </Field>
            ) : null}

            {entityType !== "vision-scenes" && entityType !== "projects" ? (
              <Field
                label={entityType === "courses" ? "Module card image" : "Card image"}
                hint={
                  entityType === "services"
                    ? "Used in service cards and listing previews (16:9 recommended)."
                    : entityType === "courses"
                    ? "Used in training module cards and list previews."
                    : "Used in listing cards (16:9 recommended)."
                }
              >
                <input
                  value={form.cardImage || ""}
                  onChange={(event) => updateField("cardImage", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("cardImage", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.cardImage} alt="Card image preview" className="h-44" />
              </Field>
            ) : null}

            {entityType !== "vision-scenes" && entityType !== "projects" ? (
              <Field
                label={entityType === "courses" ? "Top banner image" : "Carousel / banner image"}
                hint={
                  entityType === "services"
                    ? "Used for the top service banner image and spotlight placements."
                    : entityType === "courses"
                    ? "Used as the top training module banner image."
                    : "Used in hero carousel and feature panels."
                }
              >
                <input
                  value={form.carouselImage || ""}
                  onChange={(event) => updateField("carouselImage", event.target.value)}
                  className={textInputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSingleImageUpload("carouselImage", event.target.files?.[0])}
                  className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <ImagePreview src={form.carouselImage} alt="Carousel image preview" className="h-44" />
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

            {entityType === "services" ? (
              <SectionBlock
                title="Service Delivery Details"
                hint="These fields feed the long-form service details, delivery format, and highlight chips."
              />
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

            {entityType === "services" || entityType === "courses" ? (
              <div className="md:col-span-2">
                <Field label="Legacy summary field (optional)">
                  <textarea
                    value={form.summary || ""}
                    onChange={(event) => updateField("summary", event.target.value)}
                    className={textareaClass}
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

            {entityType === "tools" ? (
              <>
                <Field label="Price">
                  <input
                    value={form.price || ""}
                    onChange={(event) => updateField("price", event.target.value)}
                    className={textInputClass}
                    placeholder="Free / $19 / $49"
                  />
                </Field>

                <Field label="CTA label">
                  <input
                    value={form.ctaLabel || ""}
                    onChange={(event) => updateField("ctaLabel", event.target.value)}
                    className={textInputClass}
                    placeholder="Purchase / Use Tool"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="CTA URL">
                    <input
                      value={form.ctaUrl || ""}
                      onChange={(event) => updateField("ctaUrl", event.target.value)}
                      className={textInputClass}
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </>
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
                  <Field
                    label="Making of this project"
                    hint="Editorial copy shown at the top of the Making of this project section."
                  >
                    <textarea
                      value={form.making || ""}
                      onChange={(event) => updateField("making", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <SectionBlock
                  title="Showcase Media"
                  hint="Manage the service card image, the carousel image used in the top showcase slot, and the scrolling screenshot band."
                />

                <Field label="Card image" hint="Used for project cards and the banner image on the case study page.">
                  <input
                    value={form.cardImage || ""}
                    onChange={(event) => updateField("cardImage", event.target.value)}
                    className={textInputClass}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleSingleImageUpload("cardImage", event.target.files?.[0])}
                    className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <ImagePreview src={form.cardImage} alt="Card image preview" className="h-44" />
                </Field>

                <Field label="Carousel image" hint="Used in the smaller showcase panel beside the title and intro.">
                  <input
                    value={form.carouselImage || ""}
                    onChange={(event) => updateField("carouselImage", event.target.value)}
                    className={textInputClass}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleSingleImageUpload("carouselImage", event.target.files?.[0])}
                    className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <ImagePreview src={form.carouselImage} alt="Carousel image preview" className="h-44" />
                </Field>

                <SectionBlock
                  title="Case Study Editorial"
                  hint="These fields shape the detailed editorial section: the challenge, key solutions, supporting pillars, conclusion, and tech used."
                />

                <div className="md:col-span-2">
                  <Field
                    label="Case study title"
                    hint="Optional editorial title stored with the project's long-form case study content."
                  >
                    <input
                      value={form.caseStudyTitle || ""}
                      onChange={(event) => updateField("caseStudyTitle", event.target.value)}
                      className={textInputClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Screenshots"
                    hint="Enter one image key, URL, or upload files. Uploads are auto-resized to ~1600px and compressed for faster saves."
                  >
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
                              alt={`Screenshot preview ${index + 1}`}
                              fitClassName="object-contain"
                              className={isPortraitProjectGallery ? "h-72 object-contain bg-black/20 p-2" : "h-40"}
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
                  <Field
                    label="Screenshot layout"
                    hint="Choose how the screenshots should appear in the scrolling band on the case study page."
                  >
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          value: "portrait",
                          label: "Portrait",
                          description: "Best for Play Store or mobile app screens.",
                        },
                        {
                          value: "landscape",
                          label: "Landscape",
                          description: "Best for gameplay captures, desktop UI, or wide mockups.",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`rounded-[1rem] border px-4 py-4 transition ${
                            form.screenshotOrientation === option.value
                              ? "border-cyan-300/60 bg-cyan-400/10"
                              : "border-white/8 bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="project-screenshot-orientation"
                              value={option.value}
                              checked={form.screenshotOrientation === option.value}
                              onChange={(event) => updateField("screenshotOrientation", event.target.value)}
                              className="mt-1 h-4 w-4"
                            />
                            <div>
                              <p className="text-sm font-semibold text-white">{option.label}</p>
                              <p className="mt-1 text-xs leading-6 text-muted">{option.description}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Tech used"
                    hint="Enter one technology per line. These appear in the case study header card."
                  >
                    <textarea
                      value={form.technologies || ""}
                      onChange={(event) => updateField("technologies", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <SectionBlock
                  title="The Challenge"
                  hint="Add the main challenge description and the supporting bullet points shown underneath it."
                />

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      value={form.caseStudyChallengeDescription || ""}
                      onChange={(event) =>
                        updateField("caseStudyChallengeDescription", event.target.value)
                      }
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Bulleted points"
                    hint="Enter one supporting point per line."
                  >
                    <textarea
                      value={form.caseStudyChallengeBullets || ""}
                      onChange={(event) =>
                        updateField("caseStudyChallengeBullets", event.target.value)
                      }
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <SectionBlock
                  title="Key Features & Solutions"
                  hint="Each row becomes one feature and solution entry in the editorial table."
                />

                <CaseStudyRowTable
                  label="Feature and solution rows"
                  hint="Add the feature title and the matching solution description for each row."
                  rows={form.caseStudySolutions || []}
                  titleLabel="Feature title"
                  descriptionLabel="Solution description"
                  addLabel="Add feature row"
                  onAdd={() => addCaseStudyRow("caseStudySolutions")}
                  onChange={(index, key, value) =>
                    updateCaseStudyRow("caseStudySolutions", index, key, value)
                  }
                  onRemove={(index) => removeCaseStudyRow("caseStudySolutions", index)}
                />

                <SectionBlock
                  title="Core Experience Pillars"
                  hint="Add one title and description for each pillar card."
                />

                <CaseStudyRowTable
                  label="Pillar rows"
                  hint="Each row becomes one card in the core experience pillars section."
                  rows={form.caseStudyPillars || []}
                  titleLabel="Pillar title"
                  descriptionLabel="Pillar description"
                  addLabel="Add pillar"
                  onAdd={() => addCaseStudyRow("caseStudyPillars")}
                  onChange={(index, key, value) =>
                    updateCaseStudyRow("caseStudyPillars", index, key, value)
                  }
                  onRemove={(index) => removeCaseStudyRow("caseStudyPillars", index)}
                />

                <SectionBlock
                  title="Conclusion"
                  hint="Short closing line for the final editorial section."
                />

                <div className="md:col-span-2">
                  <Field label="Conclusion">
                    <input
                      value={form.caseStudyConclusion || ""}
                      onChange={(event) => updateField("caseStudyConclusion", event.target.value)}
                      className={textInputClass}
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

            {entityType === "tools" ? (
              <>
                <div className="md:col-span-2">
                  <Field label="Features" hint="Enter one feature per line.">
                    <textarea
                      value={form.features || ""}
                      onChange={(event) => updateField("features", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Tech used" hint="Enter one technology per line.">
                    <textarea
                      value={form.techUsed || ""}
                      onChange={(event) => updateField("techUsed", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Gallery images" hint="Enter one image key per line.">
                    <textarea
                      value={form.gallery || ""}
                      onChange={(event) => updateField("gallery", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {entityType === "courses" ? (
              <SectionBlock
                title="Training Content Details"
                hint="Manage curriculum and outcomes shown across training catalog and module detail pages."
              />
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

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </form>

        <div className="flex flex-col-reverse gap-3 border-t border-white/8 bg-surface/95 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="admin-danger-button w-full px-5 py-3 sm:w-auto"
            >
              Delete
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="admin-secondary-button w-full px-5 py-3 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isSaving}
            className="admin-save-button w-full disabled:opacity-70 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminEntityModal;

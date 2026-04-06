import { useEffect, useState } from "react";

import { resolveMedia } from "../assets/mediaMap";
import Modal from "./ui/Modal";

const textInputClass = "theme-input mt-2 w-full rounded-[1rem] px-4 py-3 text-sm text-white";
const textareaClass =
  "theme-input mt-2 min-h-[6.5rem] w-full rounded-[1rem] px-4 py-3 text-sm text-white";
const MAX_ADMIN_PAYLOAD_BYTES = 14 * 1024 * 1024;

const estimatePayloadSize = (payload) => {
  try {
    return new Blob([JSON.stringify(payload)]).size;
  } catch {
    return 0;
  }
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    {children}
  </label>
);

const createInitialForm = (value = {}) => ({
  title: value.title || "",
  slug: value.slug || "",
  shortDescription:
    value.shortDescription || value.tagline || value.summary || value.description || "",
  cardImage: value.cardImage || value.coverImage || value.image || "",
  carouselImage:
    value.carouselImage || value.heroImage || value.cardImage || value.coverImage || value.image || "",
});

const buildQuickPayload = (entityType, form) => {
  const base = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    shortDescription: form.shortDescription.trim(),
    cardImage: form.cardImage.trim(),
    carouselImage: form.carouselImage.trim(),
  };

  switch (entityType) {
    case "projects":
      return {
        ...base,
        tagline: base.shortDescription,
      };
    case "services":
      return {
        ...base,
        summary: base.shortDescription,
      };
    case "tools":
      return {
        ...base,
        image: base.cardImage,
      };
    case "courses":
      return {
        ...base,
        summary: base.shortDescription,
      };
    default:
      return base;
  }
};

const AdminQuickEditModal = ({
  title,
  entityType,
  initialValue,
  onClose,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState(() => createInitialForm(initialValue));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const modalMaxWidthClass = entityType === "services" || entityType === "courses" ? "max-w-4xl" : "max-w-3xl";
  const shortDescriptionLabel = entityType === "courses" ? "Module summary" : "Short description";
  const shortDescriptionHint =
    entityType === "services"
      ? "Used as the lead summary in service cards and service header."
      : entityType === "courses"
      ? "Used in training cards and module header summary."
      : null;

  useEffect(() => {
    setForm(createInitialForm(initialValue));
  }, [initialValue]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = buildQuickPayload(entityType, form);
      const payloadSize = estimatePayloadSize(payload);

      if (payloadSize > MAX_ADMIN_PAYLOAD_BYTES) {
        throw new Error("This entry is too large to save in one request. Reduce uploaded image sizes, then try again.");
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
            <p className="mt-1 text-sm text-muted">Quick card edit</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button w-full text-xs sm:w-auto">
            Close
          </button>
        </div>

        <form id="admin-quick-form" onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={textInputClass}
              required
            />
          </Field>

          <Field label="Slug" hint="Optional for existing items.">
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              className={textInputClass}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label={shortDescriptionLabel} hint={shortDescriptionHint}>
              <textarea
                value={form.shortDescription}
                onChange={(event) => updateField("shortDescription", event.target.value)}
                className={textareaClass}
                required
              />
            </Field>
          </div>

          <Field label="Card image" hint="Used in cards and previews.">
            <input
              value={form.cardImage}
              onChange={(event) => updateField("cardImage", event.target.value)}
              className={textInputClass}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleSingleImageUpload("cardImage", event.target.files?.[0])}
              className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {form.cardImage ? (
              <img
                src={resolveMedia(form.cardImage)}
                alt="Card image preview"
                className="mt-3 aspect-video w-full rounded-[1rem] border border-white/10 object-cover"
              />
            ) : null}
          </Field>

          <Field
            label={entityType === "courses" ? "Top banner image" : "Carousel / banner image"}
            hint={
              entityType === "services"
                ? "Used in the top service banner and spotlight placements."
                : entityType === "courses"
                ? "Used in the top training module banner."
                : "Used in hero carousel and cinematic panels."
            }
          >
            <input
              value={form.carouselImage}
              onChange={(event) => updateField("carouselImage", event.target.value)}
              className={textInputClass}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleSingleImageUpload("carouselImage", event.target.files?.[0])}
              className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {form.carouselImage ? (
              <img
                src={resolveMedia(form.carouselImage)}
                alt="Carousel image preview"
                className="mt-3 aspect-video w-full rounded-[1rem] border border-white/10 object-cover"
              />
            ) : null}
          </Field>
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
          <button type="button" onClick={onClose} className="admin-secondary-button w-full px-5 py-3 sm:w-auto">
            Cancel
          </button>
          <button
            type="submit"
            form="admin-quick-form"
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

export default AdminQuickEditModal;

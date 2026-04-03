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
    <Modal open onClose={onClose} maxWidthClass="max-w-3xl" panelClassName="admin-modal-panel">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-muted">Quick card edit</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
            Close
          </button>
        </div>

        <form id="admin-quick-form" onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6">
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
            <Field label="Short description">
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

          <Field label="Carousel image" hint="Used in hero carousel and cinematic panels.">
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

        <div className="flex justify-end gap-3 border-t border-white/8 bg-surface/95 px-6 py-5">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="admin-danger-button px-5 py-3"
            >
              Delete
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="admin-secondary-button px-5 py-3">
            Cancel
          </button>
          <button type="submit" form="admin-quick-form" disabled={isSaving} className="admin-save-button disabled:opacity-70">
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminQuickEditModal;

import { useEffect, useState } from "react";

import Modal from "./ui/Modal";

const textInputClass = "theme-input mt-2 w-full rounded-[1rem] px-4 py-3 text-sm text-white";
const textareaClass =
  "theme-input mt-2 min-h-[5rem] w-full rounded-[1rem] px-4 py-3 text-sm text-white";

/** Simple labeled field wrapper */
const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    {children}
  </label>
);

/** Parse a newline-separated textarea value into a string array */
const parseLines = (raw) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const createForm = (value = {}) => ({
  title: value.title || "",
  category: value.category || "",
  shortDescription: value.shortDescription || value.summary || "",
  highlights: (value.highlights || []).join("\n"),
});

/**
 * Modal used exclusively by the "What We Do" section on the homepage.
 * Covers the fields visible on those compact service cards:
 *   - Title
 *   - Category (eyebrow label)
 *   - Highlights (up to 2 pill tags)
 */
const WhatWeDoModal = ({ isAdd = false, initialValue = {}, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(() => createForm(initialValue));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync when the entity being edited changes
  useEffect(() => {
    setForm(createForm(initialValue));
    setError("");
  }, [initialValue]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await onSave({
        title: form.title.trim(),
        category: form.category.trim(),
        shortDescription: form.shortDescription.trim(),
        summary: form.shortDescription.trim(),
        highlights: parseLines(form.highlights),
        // Preserve existing slug on edit; generate a basic one for new
        ...(isAdd
          ? { slug: form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }
          : {}),
      });
      onClose();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} maxWidthClass="max-w-xl" panelClassName="admin-modal-panel">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              {isAdd ? "Add Capability" : "Edit Capability"}
            </h2>
            <p className="mt-1 text-sm text-muted">What We Do · homepage section</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
            Close
          </button>
        </div>

        {/* Form */}
        <form
          id="what-we-do-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6"
        >
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={textInputClass}
              placeholder="e.g. Game Development"
              required
            />
          </Field>

          <Field label="Category" hint="Eyebrow label shown above the title on the card.">
            <input
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className={textInputClass}
              placeholder="e.g. Capability"
            />
          </Field>

          <Field label="Short description" hint="Shown in the service detail page and carousel.">
            <textarea
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className={textareaClass}
            />
          </Field>

          <Field
            label="Highlights"
            hint="One highlight per line. First two are shown as pills on the card."
          >
            <textarea
              value={form.highlights}
              onChange={(e) => updateField("highlights", e.target.value)}
              className={textareaClass}
              placeholder={"Unity / Unreal Engine\nC# / C++\nMultiplatform builds"}
            />
          </Field>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/8 bg-surface/95 px-6 py-5">
          {onDelete ? (
            <button type="button" onClick={onDelete} className="admin-danger-button px-5 py-3">
              Delete
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="admin-secondary-button px-5 py-3">
            Cancel
          </button>
          <button
            type="submit"
            form="what-we-do-form"
            disabled={isSaving}
            className="admin-save-button disabled:opacity-70"
          >
            {isSaving ? "Saving…" : isAdd ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatWeDoModal;

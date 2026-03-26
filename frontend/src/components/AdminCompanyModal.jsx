import { useEffect, useState } from "react";

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");

const createInitialForm = (value = {}) => ({
  parentCompany: value.parentCompany || "",
  description: value.description || "",
  vision: value.vision || "",
  values: joinLines(value.values),
  timeline:
    Array.isArray(value.timeline) && value.timeline.length
      ? value.timeline.map((item) => ({
          date: item.date || "",
          title: item.title || "",
          description: item.description || "",
        }))
      : [{ date: "", title: "", description: "" }],
});

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const textInputClass = "theme-input mt-2 w-full rounded-[1rem] px-4 py-3 text-sm text-white";
const textareaClass =
  "theme-input mt-2 min-h-[7.5rem] w-full rounded-[1rem] px-4 py-3 text-sm text-white";

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-white">{label}</span>
    {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    {children}
  </label>
);

const AdminCompanyModal = ({ title, initialValue, onClose, onSave }) => {
  const [form, setForm] = useState(() => createInitialForm(initialValue));
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
    setForm(createInitialForm(initialValue));
  }, [initialValue]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateTimelineItem = (index, field, value) => {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const addTimelineItem = () => {
    setForm((current) => ({
      ...current,
      timeline: [...current.timeline, { date: "", title: "", description: "" }],
    }));
  };

  const removeTimelineItem = (index) => {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSave({
        parentCompany: form.parentCompany.trim(),
        description: form.description.trim(),
        vision: form.vision.trim(),
        values: splitLines(form.values),
        timeline: (form.timeline || [])
          .map((item) => ({
            date: item.date.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
          }))
          .filter((item) => item.date || item.title || item.description),
      });
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-shell">
      <div className="admin-modal-panel w-full max-w-5xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-muted">Company page content</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-5">
            <Field label="Parent company">
              <textarea
                value={form.parentCompany}
                onChange={(event) => updateField("parentCompany", event.target.value)}
                className={textareaClass}
                required
              />
            </Field>

            <Field label="ShonStudio overview">
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={textareaClass}
                required
              />
            </Field>

            <Field label="Vision statement">
              <textarea
                value={form.vision}
                onChange={(event) => updateField("vision", event.target.value)}
                className={textareaClass}
                required
              />
            </Field>

            <Field label="Values" hint="Enter one value per line.">
              <textarea
                value={form.values}
                onChange={(event) => updateField("values", event.target.value)}
                className={textareaClass}
              />
            </Field>

            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Timeline events</h3>
                  <p className="mt-1 text-sm text-muted">
                    Add the milestones shown on the Company timeline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="admin-secondary-button px-4 py-2"
                >
                  Add event
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {(form.timeline || []).map((item, index) => (
                  <div key={`${index}-${item.title}`} className="rounded-[1.15rem] border border-white/8 p-4">
                    <div className="grid gap-4 md:grid-cols-[9rem_1fr_auto]">
                      <Field label="Date">
                        <input
                          value={item.date}
                          onChange={(event) => updateTimelineItem(index, "date", event.target.value)}
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Title">
                        <input
                          value={item.title}
                          onChange={(event) => updateTimelineItem(index, "title", event.target.value)}
                          className={textInputClass}
                        />
                      </Field>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeTimelineItem(index)}
                          className="admin-danger-button px-4 py-3"
                          disabled={(form.timeline || []).length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <Field label="Description">
                      <textarea
                        value={item.description}
                        onChange={(event) => updateTimelineItem(index, "description", event.target.value)}
                        className={textareaClass}
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <div className="mt-6 flex justify-end gap-3 border-t border-white/8 pt-5">
            <button type="button" onClick={onClose} className="admin-secondary-button px-5 py-3">
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

export default AdminCompanyModal;

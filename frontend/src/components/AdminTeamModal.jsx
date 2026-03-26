import { useEffect, useState } from "react";

import { resolveMedia } from "../assets/mediaMap";

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");

const createInitialForm = (value = {}) => ({
  name: value.name || "",
  role: value.role || "",
  category: value.category || "developer",
  profileImage: value.profileImage || "",
  bio: value.bio || "",
  coreTech: joinLines(value.coreTech),
  skills: joinLines(value.skills),
  experience: value.experience || "",
  projects: joinLines(value.projects),
  education: value.education || "",
  contactEmail: value.contactLinks?.email || "",
  contactLinkedIn: value.contactLinks?.linkedIn || "",
  contactGitHub: value.contactLinks?.github || "",
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

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

const AdminTeamModal = ({ title, initialValue, onClose, onSave }) => {
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

  const handleImageUpload = async (file) => {
    if (!file) {
      return;
    }

    setError("");

    try {
      const imageData = await readFileAsDataUrl(file);
      updateField("profileImage", imageData);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to load image.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSave({
        name: form.name.trim(),
        role: form.role.trim(),
        category: form.category,
        profileImage: form.profileImage.trim(),
        bio: form.bio.trim(),
        coreTech: splitLines(form.coreTech),
        skills: splitLines(form.skills),
        experience: form.experience.trim(),
        projects: splitLines(form.projects),
        education: form.education.trim(),
        contactLinks: {
          email: form.contactEmail.trim(),
          linkedIn: form.contactLinkedIn.trim(),
          github: form.contactGitHub.trim(),
        },
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
      <div className="admin-modal-panel w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-muted">Team member details</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name">
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={textInputClass}
                required
              />
            </Field>

            <Field label="Role">
              <input
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                className={textInputClass}
                required
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className={textInputClass}
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
              </select>
            </Field>

            <Field label="Profile image key or URL">
              <input
                value={form.profileImage}
                onChange={(event) => updateField("profileImage", event.target.value)}
                className={textInputClass}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event.target.files?.[0])}
                className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {form.profileImage ? (
                <img
                  src={resolveMedia(form.profileImage)}
                  alt="Team member preview"
                  className="mt-3 h-44 w-full rounded-[1rem] border border-white/10 object-cover"
                />
              ) : null}
            </Field>

            <div className="md:col-span-2">
              <Field label="Bio">
                <textarea
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className={textareaClass}
                  required
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Core tech" hint="Enter one technology per line.">
                <textarea
                  value={form.coreTech}
                  onChange={(event) => updateField("coreTech", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Skills" hint="Enter one skill per line.">
                <textarea
                  value={form.skills}
                  onChange={(event) => updateField("skills", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Experience">
                <textarea
                  value={form.experience}
                  onChange={(event) => updateField("experience", event.target.value)}
                  className={textareaClass}
                  required
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Projects worked on" hint="Enter one project per line.">
                <textarea
                  value={form.projects}
                  onChange={(event) => updateField("projects", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Education">
                <textarea
                  value={form.education}
                  onChange={(event) => updateField("education", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>

            <Field label="Contact email">
              <input
                value={form.contactEmail}
                onChange={(event) => updateField("contactEmail", event.target.value)}
                className={textInputClass}
                type="email"
              />
            </Field>

            <Field label="LinkedIn URL">
              <input
                value={form.contactLinkedIn}
                onChange={(event) => updateField("contactLinkedIn", event.target.value)}
                className={textInputClass}
              />
            </Field>

            <Field label="GitHub URL">
              <input
                value={form.contactGitHub}
                onChange={(event) => updateField("contactGitHub", event.target.value)}
                className={textInputClass}
              />
            </Field>
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

export default AdminTeamModal;

import { useEffect, useState } from "react";

import { resolveMedia } from "../assets/mediaMap";
import Modal from "./ui/Modal";

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (items) => (Array.isArray(items) ? items.join("\n") : "");

const createWorkHistoryItem = (value = {}) => ({
  title: value.title || "",
  company: value.company || "",
  period: value.period || "",
  location: value.location || "",
  summary: value.summary || "",
  highlightsText: joinLines(value.highlights),
});

const createCaseStudyItem = (value = {}) => ({
  name: value.name || "",
  client: value.client || "",
  role: value.role || "",
  period: value.period || "",
  summary: value.summary || "",
  outcomesText: joinLines(value.outcomes),
  stackText: joinLines(value.stack),
  link: value.link || "",
});

const createEducationRecord = (value = {}) => ({
  institution: value.institution || "",
  degree: value.degree || "",
  period: value.period || "",
  details: value.details || "",
});

const createTestimonial = (value = {}) => ({
  author: value.author || "",
  role: value.role || "",
  company: value.company || "",
  quote: value.quote || "",
});

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
  resumeHeadline: value.resume?.headline || "",
  resumeLocation: value.resume?.location || "",
  resumeTotalExperience: value.resume?.totalExperience || "",
  resumeAvailability: value.resume?.availability || "",
  resumePreferredEngagement: value.resume?.preferredEngagement || "",
  resumeLanguages: joinLines(value.resume?.languages),
  resumeCertifications: joinLines(value.resume?.certifications),
  resumeAchievements: joinLines(value.resume?.achievements),
  workHistory:
    Array.isArray(value.resume?.workHistory) && value.resume.workHistory.length
      ? value.resume.workHistory.map((item) => createWorkHistoryItem(item))
      : [createWorkHistoryItem()],
  caseStudies:
    Array.isArray(value.resume?.caseStudies) && value.resume.caseStudies.length
      ? value.resume.caseStudies.map((item) => createCaseStudyItem(item))
      : [createCaseStudyItem()],
  educationRecords:
    Array.isArray(value.resume?.educationRecords) && value.resume.educationRecords.length
      ? value.resume.educationRecords.map((item) => createEducationRecord(item))
      : [createEducationRecord()],
  testimonials:
    Array.isArray(value.resume?.testimonials) && value.resume.testimonials.length
      ? value.resume.testimonials.map((item) => createTestimonial(item))
      : [createTestimonial()],
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

const SectionCard = ({ title, subtitle, children }) => (
  <div className="md:col-span-2 rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{title}</p>
        {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
      </div>
    </div>
    {children}
  </div>
);

const AdminTeamModal = ({ title, initialValue, onClose, onSave }) => {
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

  const updateArrayField = (field, index, key, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  };

  const addArrayItem = (field, factory) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], factory()],
    }));
  };

  const removeArrayItem = (field, index, factory) => {
    setForm((current) => {
      const nextItems = current[field].filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        [field]: nextItems.length ? nextItems : [factory()],
      };
    });
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
        resume: {
          headline: form.resumeHeadline.trim(),
          location: form.resumeLocation.trim(),
          totalExperience: form.resumeTotalExperience.trim(),
          availability: form.resumeAvailability.trim(),
          preferredEngagement: form.resumePreferredEngagement.trim(),
          languages: splitLines(form.resumeLanguages),
          certifications: splitLines(form.resumeCertifications),
          achievements: splitLines(form.resumeAchievements),
          workHistory: form.workHistory
            .map((item) => ({
              title: item.title.trim(),
              company: item.company.trim(),
              period: item.period.trim(),
              location: item.location.trim(),
              summary: item.summary.trim(),
              highlights: splitLines(item.highlightsText),
            }))
            .filter((item) => item.title || item.company || item.summary),
          caseStudies: form.caseStudies
            .map((item) => ({
              name: item.name.trim(),
              client: item.client.trim(),
              role: item.role.trim(),
              period: item.period.trim(),
              summary: item.summary.trim(),
              outcomes: splitLines(item.outcomesText),
              stack: splitLines(item.stackText),
              link: item.link.trim(),
            }))
            .filter((item) => item.name || item.summary || item.client),
          educationRecords: form.educationRecords
            .map((item) => ({
              institution: item.institution.trim(),
              degree: item.degree.trim(),
              period: item.period.trim(),
              details: item.details.trim(),
            }))
            .filter((item) => item.institution || item.degree || item.details),
          testimonials: form.testimonials
            .map((item) => ({
              author: item.author.trim(),
              role: item.role.trim(),
              company: item.company.trim(),
              quote: item.quote.trim(),
            }))
            .filter((item) => item.author || item.quote || item.company),
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
    <Modal open onClose={onClose} maxWidthClass="max-w-5xl" panelClassName="admin-modal-panel">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-muted">Team member and resume details</p>
          </div>
          <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
            Close
          </button>
        </div>

        <form id="admin-team-form" onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto p-6">
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
              <Field label="Bio summary">
                <textarea
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className={textareaClass}
                  required
                />
              </Field>
            </div>

            <SectionCard
              title="Resume headline"
              subtitle="Set top-level info visible in the detailed resume modal and PDF"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Professional headline" hint="Example: Senior Unity Engineer | XR Systems">
                  <input
                    value={form.resumeHeadline}
                    onChange={(event) => updateField("resumeHeadline", event.target.value)}
                    className={textInputClass}
                  />
                </Field>

                <Field label="Location">
                  <input
                    value={form.resumeLocation}
                    onChange={(event) => updateField("resumeLocation", event.target.value)}
                    className={textInputClass}
                  />
                </Field>

                <Field label="Total experience" hint="Example: 8+ years">
                  <input
                    value={form.resumeTotalExperience}
                    onChange={(event) => updateField("resumeTotalExperience", event.target.value)}
                    className={textInputClass}
                  />
                </Field>

                <Field label="Availability" hint="Example: 2 weeks notice">
                  <input
                    value={form.resumeAvailability}
                    onChange={(event) => updateField("resumeAvailability", event.target.value)}
                    className={textInputClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Preferred engagement" hint="Example: Full-time, contract, advisory">
                    <input
                      value={form.resumePreferredEngagement}
                      onChange={(event) => updateField("resumePreferredEngagement", event.target.value)}
                      className={textInputClass}
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Skills and credentials"
              subtitle="One item per line for cleaner chips and resume sections"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Core tech" hint="One technology per line">
                  <textarea
                    value={form.coreTech}
                    onChange={(event) => updateField("coreTech", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Skills" hint="One skill per line">
                  <textarea
                    value={form.skills}
                    onChange={(event) => updateField("skills", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Achievements" hint="One achievement per line">
                  <textarea
                    value={form.resumeAchievements}
                    onChange={(event) => updateField("resumeAchievements", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Certifications" hint="One certification per line">
                  <textarea
                    value={form.resumeCertifications}
                    onChange={(event) => updateField("resumeCertifications", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Languages" hint="One language per line">
                    <textarea
                      value={form.resumeLanguages}
                      onChange={(event) => updateField("resumeLanguages", event.target.value)}
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Work experience" subtitle="Add each role as a separate entry">
              <div className="space-y-4">
                {form.workHistory.map((item, index) => (
                  <div
                    key={`work-history-${index}`}
                    className="rounded-[1rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem("workHistory", index, createWorkHistoryItem)}
                        className="admin-secondary-button px-3 py-2 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <input
                          value={item.title}
                          onChange={(event) =>
                            updateArrayField("workHistory", index, "title", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Company">
                        <input
                          value={item.company}
                          onChange={(event) =>
                            updateArrayField("workHistory", index, "company", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Period">
                        <input
                          value={item.period}
                          onChange={(event) =>
                            updateArrayField("workHistory", index, "period", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Location">
                        <input
                          value={item.location}
                          onChange={(event) =>
                            updateArrayField("workHistory", index, "location", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Summary">
                          <textarea
                            value={item.summary}
                            onChange={(event) =>
                              updateArrayField("workHistory", index, "summary", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Highlights" hint="One highlight per line">
                          <textarea
                            value={item.highlightsText}
                            onChange={(event) =>
                              updateArrayField("workHistory", index, "highlightsText", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addArrayItem("workHistory", createWorkHistoryItem)}
                className="theme-button-secondary mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Add experience
              </button>
            </SectionCard>

            <SectionCard title="Project portfolio" subtitle="Case studies that hiring teams can evaluate quickly">
              <div className="space-y-4">
                {form.caseStudies.map((item, index) => (
                  <div
                    key={`case-study-${index}`}
                    className="rounded-[1rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem("caseStudies", index, createCaseStudyItem)}
                        className="admin-secondary-button px-3 py-2 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Project name">
                        <input
                          value={item.name}
                          onChange={(event) =>
                            updateArrayField("caseStudies", index, "name", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Client">
                        <input
                          value={item.client}
                          onChange={(event) =>
                            updateArrayField("caseStudies", index, "client", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Role">
                        <input
                          value={item.role}
                          onChange={(event) =>
                            updateArrayField("caseStudies", index, "role", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Period">
                        <input
                          value={item.period}
                          onChange={(event) =>
                            updateArrayField("caseStudies", index, "period", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Summary">
                          <textarea
                            value={item.summary}
                            onChange={(event) =>
                              updateArrayField("caseStudies", index, "summary", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Outcomes" hint="One result per line">
                          <textarea
                            value={item.outcomesText}
                            onChange={(event) =>
                              updateArrayField("caseStudies", index, "outcomesText", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Tech stack" hint="One technology per line">
                          <textarea
                            value={item.stackText}
                            onChange={(event) =>
                              updateArrayField("caseStudies", index, "stackText", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Case study link">
                          <input
                            value={item.link}
                            onChange={(event) =>
                              updateArrayField("caseStudies", index, "link", event.target.value)
                            }
                            className={textInputClass}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addArrayItem("caseStudies", createCaseStudyItem)}
                className="theme-button-secondary mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Add case study
              </button>
            </SectionCard>

            <SectionCard title="Education" subtitle="Formal education and relevant learning">
              <div className="space-y-4">
                {form.educationRecords.map((item, index) => (
                  <div
                    key={`education-${index}`}
                    className="rounded-[1rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem("educationRecords", index, createEducationRecord)}
                        className="admin-secondary-button px-3 py-2 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Institution">
                        <input
                          value={item.institution}
                          onChange={(event) =>
                            updateArrayField("educationRecords", index, "institution", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Degree / Program">
                        <input
                          value={item.degree}
                          onChange={(event) =>
                            updateArrayField("educationRecords", index, "degree", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Period">
                        <input
                          value={item.period}
                          onChange={(event) =>
                            updateArrayField("educationRecords", index, "period", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Details">
                          <textarea
                            value={item.details}
                            onChange={(event) =>
                              updateArrayField("educationRecords", index, "details", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addArrayItem("educationRecords", createEducationRecord)}
                className="theme-button-secondary mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Add education record
              </button>
            </SectionCard>

            <SectionCard
              title="Testimonials"
              subtitle="Quotes from clients, leads, or collaborators"
            >
              <div className="space-y-4">
                {form.testimonials.map((item, index) => (
                  <div
                    key={`testimonial-${index}`}
                    className="rounded-[1rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem("testimonials", index, createTestimonial)}
                        className="admin-secondary-button px-3 py-2 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Author name">
                        <input
                          value={item.author}
                          onChange={(event) =>
                            updateArrayField("testimonials", index, "author", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Author role">
                        <input
                          value={item.role}
                          onChange={(event) =>
                            updateArrayField("testimonials", index, "role", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <Field label="Organization">
                        <input
                          value={item.company}
                          onChange={(event) =>
                            updateArrayField("testimonials", index, "company", event.target.value)
                          }
                          className={textInputClass}
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Quote">
                          <textarea
                            value={item.quote}
                            onChange={(event) =>
                              updateArrayField("testimonials", index, "quote", event.target.value)
                            }
                            className={textareaClass}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addArrayItem("testimonials", createTestimonial)}
                className="theme-button-secondary mt-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                Add testimonial
              </button>
            </SectionCard>

            <SectionCard
              title="Legacy compatibility fields"
              subtitle="Optional fields kept to support older cards/data consumers"
            >
              <div className="grid gap-4">
                <Field label="Legacy experience text">
                  <textarea
                    value={form.experience}
                    onChange={(event) => updateField("experience", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Legacy projects list" hint="One project per line">
                  <textarea
                    value={form.projects}
                    onChange={(event) => updateField("projects", event.target.value)}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Legacy education text">
                  <textarea
                    value={form.education}
                    onChange={(event) => updateField("education", event.target.value)}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Contact links" subtitle="Public profile links shown in resume modal">
              <div className="grid gap-4 md:grid-cols-2">
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

                <div className="md:col-span-2">
                  <Field label="GitHub URL">
                    <input
                      value={form.contactGitHub}
                      onChange={(event) => updateField("contactGitHub", event.target.value)}
                      className={textInputClass}
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </form>

        <div className="flex justify-end gap-3 border-t border-white/8 bg-surface/95 px-6 py-5">
          <button type="button" onClick={onClose} className="admin-secondary-button px-5 py-3">
            Cancel
          </button>
          <button
            type="submit"
            form="admin-team-form"
            disabled={isSaving}
            className="admin-save-button disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminTeamModal;

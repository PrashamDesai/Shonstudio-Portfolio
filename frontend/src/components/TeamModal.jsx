import { motion } from "framer-motion";
import { FiDownload, FiExternalLink } from "react-icons/fi";

import { resolveMedia } from "../assets/mediaMap";
import { downloadTeamResumePdf } from "../utils/resumePdf";
import { normalizeTeamResume } from "../utils/teamResume";
import Modal from "./ui/Modal";

const contactConfig = [
  { key: "email", label: "Email", href: (value) => `mailto:${value}` },
  { key: "linkedIn", label: "LinkedIn", href: (value) => value },
  { key: "github", label: "GitHub", href: (value) => value },
];

const SectionTitle = ({ title, subtitle }) => (
  <div>
    <p className="text-[11px] uppercase tracking-[0.3em] text-accentSoft">{title}</p>
    {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
  </div>
);

const TeamModal = ({ member, onClose, isAdmin = false }) => {
  const profile = normalizeTeamResume(member || {});
  const skillMatrix = [...new Set([...(profile.coreTech || []), ...(profile.skills || [])])];

  return (
    <Modal open={Boolean(member)} onClose={onClose} maxWidthClass="max-w-6xl" panelClassName="admin-modal-panel">
      {member ? (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col overflow-hidden"
          >
            <div className="relative overflow-hidden border-b border-white/8 px-6 py-6 sm:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.16),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(122,92,255,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
              <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white/16 bg-white/[0.04] shadow-soft">
                    <img
                      src={resolveMedia(profile.profileImage)}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">
                      {profile.categoryLabel} team
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
                      {profile.name}
                    </h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-mutedDeep">
                      {profile.role}
                    </p>
                    <p className="mt-3 text-sm text-muted sm:text-base">
                      {profile.headline || profile.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => downloadTeamResumePdf(member)}
                      className="theme-button-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                    >
                      <FiDownload className="text-sm" />
                      Download Resume PDF
                    </button>
                  ) : null}

                  <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="space-y-6">
                  <div className="section-shell panel-glow overflow-hidden p-4">
                    <img
                      src={resolveMedia(profile.profileImage)}
                      alt={profile.name}
                      className="h-[20rem] w-full rounded-[1.4rem] border border-white/10 object-cover sm:h-[24rem]"
                    />
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle title="Professional summary" />
                    <p className="text-sm leading-7 text-muted sm:text-base">{profile.summary}</p>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle
                      title="Profile overview"
                      subtitle="Details that help hiring teams assess fit quickly"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-mutedDeep">Experience</p>
                        <p className="mt-2 text-sm text-white">
                          {profile.totalExperience || "Not specified"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-mutedDeep">Location</p>
                        <p className="mt-2 text-sm text-white">{profile.location || "Remote / Hybrid"}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-mutedDeep">Availability</p>
                        <p className="mt-2 text-sm text-white">{profile.availability || "On request"}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-mutedDeep">Engagement</p>
                        <p className="mt-2 text-sm text-white">
                          {profile.preferredEngagement || "Contract / Project-based"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle title="Contact" />
                    <div className="space-y-3">
                      {contactConfig
                        .filter(({ key }) => profile.contactLinks?.[key])
                        .map(({ key, label, href }) => (
                          <a
                            key={key}
                            href={href(profile.contactLinks[key])}
                            target={key === "email" ? undefined : "_blank"}
                            rel={key === "email" ? undefined : "noreferrer"}
                            className="theme-link block break-all text-sm"
                          >
                            {label}: {profile.contactLinks[key]}
                          </a>
                        ))}
                      {!contactConfig.some(({ key }) => profile.contactLinks?.[key]) ? (
                        <p className="text-sm text-muted">No contact links shared yet.</p>
                      ) : null}
                    </div>
                  </div>

                  {profile.certifications.length || profile.languages.length ? (
                    <div className="section-shell panel-glow space-y-4 p-6">
                      <SectionTitle title="Credentials" />
                      {profile.certifications.length ? (
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-mutedDeep">
                            Certifications
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.certifications.map((item) => (
                              <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {profile.languages.length ? (
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-mutedDeep">
                            Languages
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle title="Capability matrix" subtitle="Technologies and specialist strengths" />
                    <div className="flex flex-wrap gap-2">
                      {skillMatrix.map((item) => (
                        <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {profile.achievements.length ? (
                    <div className="section-shell panel-glow space-y-4 p-6">
                      <SectionTitle title="Key achievements" />
                      <div className="space-y-3">
                        {profile.achievements.map((item) => (
                          <div
                            key={item}
                            className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle title="Work experience" subtitle="Roles, scope, and impact" />
                    <div className="space-y-4">
                      {profile.workHistory.map((item, index) => (
                        <div
                          key={`${item.title}-${item.company}-${index}`}
                          className="rounded-[1.05rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className="font-display text-lg font-semibold tracking-tight text-white">
                              {item.title || "Role"}
                              {item.company ? `, ${item.company}` : ""}
                            </h4>
                            {(item.period || item.location) ? (
                              <p className="text-xs uppercase tracking-[0.2em] text-mutedDeep">
                                {[item.period, item.location].filter(Boolean).join(" | ")}
                              </p>
                            ) : null}
                          </div>
                          {item.summary ? (
                            <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                          ) : null}
                          {item.highlights?.length ? (
                            <div className="mt-3 space-y-2">
                              {item.highlights.map((highlight) => (
                                <p key={highlight} className="text-sm text-muted">
                                  - {highlight}
                                </p>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <SectionTitle title="Project portfolio" subtitle="Work examples relevant to hirers and clients" />
                    <div className="space-y-3">
                      {profile.caseStudies.map((item, index) => (
                        <div
                          key={`${item.name}-${item.client}-${index}`}
                          className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className="font-display text-lg font-semibold tracking-tight text-white">
                              {item.name || "Project"}
                            </h4>
                            {(item.role || item.period) ? (
                              <p className="text-xs uppercase tracking-[0.2em] text-mutedDeep">
                                {[item.role, item.period].filter(Boolean).join(" | ")}
                              </p>
                            ) : null}
                          </div>

                          {item.client ? <p className="mt-2 text-sm text-muted">Client: {item.client}</p> : null}
                          {item.summary ? (
                            <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
                          ) : null}

                          {item.stack?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.stack.map((tech) => (
                                <span key={tech} className="theme-chip rounded-full px-3 py-1 text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          ) : null}

                          {item.outcomes?.length ? (
                            <div className="mt-3 space-y-2">
                              {item.outcomes.map((outcome) => (
                                <p key={outcome} className="text-sm text-muted">
                                  - {outcome}
                                </p>
                              ))}
                            </div>
                          ) : null}

                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="theme-link mt-3 inline-flex items-center gap-2 text-sm"
                            >
                              View case study <FiExternalLink className="text-xs" />
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  {profile.educationRecords.length ? (
                    <div className="section-shell panel-glow space-y-4 p-6">
                      <SectionTitle title="Education" />
                      <div className="space-y-3">
                        {profile.educationRecords.map((item, index) => (
                          <div
                            key={`${item.institution}-${item.degree}-${index}`}
                            className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                          >
                            <h4 className="text-sm font-semibold text-white">
                              {[item.degree, item.institution].filter(Boolean).join(", ") ||
                                item.institution ||
                                "Education"}
                            </h4>
                            {item.period ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mutedDeep">
                                {item.period}
                              </p>
                            ) : null}
                            {item.details ? <p className="mt-2 text-sm text-muted">{item.details}</p> : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {profile.testimonials.length ? (
                    <div className="section-shell panel-glow space-y-4 p-6">
                      <SectionTitle title="Endorsements" subtitle="Client and team feedback" />
                      <div className="space-y-3">
                        {profile.testimonials.map((item, index) => (
                          <div
                            key={`${item.author}-${item.company}-${index}`}
                            className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                          >
                            <p className="text-sm italic leading-7 text-muted">"{item.quote}"</p>
                            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-mutedDeep">
                              {[item.author, item.role, item.company].filter(Boolean).join(" | ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
      ) : null}
    </Modal>
  );
};

export default TeamModal;

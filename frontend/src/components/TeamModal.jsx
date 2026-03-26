import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { resolveMedia } from "../assets/mediaMap";

const contactConfig = [
  { key: "email", label: "Email", href: (value) => `mailto:${value}` },
  { key: "linkedIn", label: "LinkedIn", href: (value) => value },
  { key: "github", label: "GitHub", href: (value) => value },
];

const TeamModal = ({ member, onClose }) => {
  useEffect(() => {
    if (!member) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member ? (
        <motion.div
          className="admin-modal-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="admin-modal-panel w-full max-w-5xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden border-b border-white/8 px-6 py-6 sm:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.16),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(122,92,255,0.14),transparent_24%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                    <img
                      src={resolveMedia(member.profileImage)}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">
                      {member.category === "developer" ? "Developing team" : "Designing team"}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
                      {member.name}
                    </h2>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-mutedDeep">
                      {member.role}
                    </p>
                  </div>
                </div>

                <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-6">
                  <div className="section-shell panel-glow overflow-hidden p-4">
                    <img
                      src={resolveMedia(member.profileImage)}
                      alt={member.name}
                      className="h-[20rem] w-full rounded-[1.4rem] border border-white/10 object-cover sm:h-[24rem]"
                    />
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Bio</p>
                    <p className="text-sm leading-7 text-muted sm:text-base">{member.bio}</p>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Contact</p>
                    <div className="space-y-3">
                      {contactConfig
                        .filter(({ key }) => member.contactLinks?.[key])
                        .map(({ key, label, href }) => (
                          <a
                            key={key}
                            href={href(member.contactLinks[key])}
                            target={key === "email" ? undefined : "_blank"}
                            rel={key === "email" ? undefined : "noreferrer"}
                            className="theme-link block break-all text-sm"
                          >
                            {label}: {member.contactLinks[key]}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Core tech</p>
                    <div className="flex flex-wrap gap-2">
                      {(member.coreTech || []).map((item) => (
                        <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(member.skills || []).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Experience</p>
                    <p className="text-sm leading-7 text-muted sm:text-base">{member.experience}</p>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">
                      Projects worked on
                    </p>
                    <div className="space-y-3">
                      {(member.projects || []).map((item) => (
                        <div
                          key={item}
                          className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="section-shell panel-glow space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Education</p>
                    <p className="text-sm leading-7 text-muted sm:text-base">{member.education}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default TeamModal;

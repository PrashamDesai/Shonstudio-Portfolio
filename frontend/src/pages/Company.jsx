import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useState } from "react";

import { pageTransition } from "../animations/variants";
import { companyProfile } from "../assets/mockData";
import AdminCompanyModal from "../components/AdminCompanyModal";
import SceneSection from "../components/SceneSection";
import SectionHeader from "../components/SectionHeader";
import Timeline from "../components/Timeline";
import { useAdmin } from "../context/AdminContext.jsx";
import { useSingleton } from "../hooks/usePageData";
import { useSmoothScroll } from "../hooks/useSmoothScroll.jsx";

const CompanyPage = () => {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const { data: company, error } = useSingleton("/company", companyProfile);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();
  const { smoothY } = useSmoothScroll();
  const prefersReducedMotion = useReducedMotion();

  const haloY = useTransform(smoothY, [0, 1800], [0, prefersReducedMotion ? -18 : -72]);
  const cardY = useTransform(smoothY, [0, 1800], [0, prefersReducedMotion ? -12 : -40]);

  const saveCompany = async (payload) => {
    await requestAdmin("/company", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    signalRefresh();
  };

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24"
    >
      <section className="relative overflow-hidden rounded-[2.35rem] border border-white/8 bg-surface/75 px-6 py-10 shadow-soft sm:px-8 lg:px-10 lg:py-12">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,212,255,0.16),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(122,92,255,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(0,255,198,0.08),transparent_22%)] opacity-90"
          style={{ y: haloY }}
        />
        <div className="hero-grid absolute inset-0 opacity-10" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="About the studio"
              title="The story behind ShonStudio."
              description="A concise narrative of our network, studio focus, and growth milestones."
              fullWidth
              actions={
                isAdmin ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(true)}
                    className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
                  >
                    Edit company page
                  </button>
                ) : null
              }
            />
            {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
          </div>

          <motion.div
            style={{ y: cardY }}
            className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-base/[0.24] p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(122,92,255,0.14),transparent_22%)]" />
            <div className="relative z-10 space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Studio signal</p>
              <p className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {company.vision}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <SceneSection
        panelClassName="px-6 py-10 sm:px-8 lg:px-12 lg:py-14"
        contentClassName="space-y-8"
        background={
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,212,255,0.14),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(122,92,255,0.12),transparent_28%)]" />
            <motion.div className="hero-grid absolute inset-0 opacity-12" style={{ y: haloY }} />
          </>
        }
      >
        <SectionHeader
          eyebrow="Studio overview"
          title="A connected company structure."
          description="The parent organization and ShonStudio division move as one aligned system."
          fullWidth
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Parent company</p>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{company.parentCompany}</p>
          </div>

          <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">ShonStudio</p>
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{company.description}</p>
          </div>
        </div>
      </SceneSection>

      <SceneSection
        panelClassName="px-6 py-10 sm:px-8 lg:px-12 lg:py-14"
        contentClassName="space-y-8"
        background={
          <>
            <motion.div
              className="absolute left-[-6%] top-[10%] h-56 w-56 rounded-full bg-accent/10 blur-3xl"
              style={{ y: haloY }}
            />
            <motion.div
              className="absolute right-[-4%] top-[24%] h-64 w-64 rounded-full bg-accentAlt/10 blur-3xl"
              style={{ y: cardY }}
            />
          </>
        }
      >
        <SectionHeader
          eyebrow="Timeline"
          title="Milestones that shaped the studio."
          description="A clean timeline of major steps in our evolution."
          fullWidth
        />

        <Timeline items={company.timeline} />
      </SceneSection>

      <SceneSection
        panelClassName="px-6 py-10 sm:px-8 lg:px-12 lg:py-16"
        contentClassName="space-y-10"
        background={
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.12),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(122,92,255,0.12),transparent_28%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className="eyebrow">Vision / values</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Values that drive how we ship.
            </h2>
            <p className="text-sm leading-7 text-muted sm:text-base">{company.vision}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(company.values || []).map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-5 py-5 text-sm leading-7 text-muted"
              >
                {value}
              </motion.div>
            ))}
          </div>
        </div>
      </SceneSection>

      {isEditingCompany ? (
        <AdminCompanyModal
          title="Edit company page"
          initialValue={company}
          onClose={() => setIsEditingCompany(false)}
          onSave={saveCompany}
        />
      ) : null}
    </motion.main>
  );
};

export default CompanyPage;

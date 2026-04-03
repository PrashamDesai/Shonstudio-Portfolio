import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { pageTransition } from "../animations/variants";
import AdminCompanyModal from "../components/AdminCompanyModal";
import { PageDataEmpty, PageDataLoader } from "../components/ApiState";
import CompanyBrandHero from "../components/CompanyBrandHero";
import SceneSection from "../components/SceneSection";
import SectionHeader from "../components/SectionHeader";
import { useAdmin } from "../context/AdminContext.jsx";
import { useSingleton } from "../hooks/usePageData";
import { useSmoothScroll } from "../hooks/useSmoothScroll.jsx";

const initialTimelineMetrics = {
  x: 0,
  start: 0,
  height: 0,
};

const StaticTimeline = ({ items = [] }) => {
  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const [timelineMetrics, setTimelineMetrics] = useState(initialTimelineMetrics);

  useLayoutEffect(() => {
    if (!items.length) {
      setTimelineMetrics(initialTimelineMetrics);
      return undefined;
    }

    const measure = () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const containerBounds = container.getBoundingClientRect();
      const points = dotRefs.current
        .slice(0, items.length)
        .map((dot) => {
          if (!dot) {
            return null;
          }

          const dotBounds = dot.getBoundingClientRect();

          return {
            x: dotBounds.left - containerBounds.left + dotBounds.width / 2,
            y: dotBounds.top - containerBounds.top + dotBounds.height / 2,
          };
        })
        .filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y));

      if (!points.length) {
        setTimelineMetrics(initialTimelineMetrics);
        return;
      }

      const start = points[0].y;
      const end = points[points.length - 1].y;

      setTimelineMetrics({
        x: points[0].x,
        start,
        height: Math.max(end - start, 0),
      });
    };

    dotRefs.current.length = items.length;
    const frameId = window.requestAnimationFrame(measure);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
      dotRefs.current.forEach((dot) => {
        if (dot) {
          resizeObserver.observe(dot);
        }
      });
    }

    window.addEventListener("resize", measure);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", measure);
      resizeObserver?.disconnect();
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      {timelineMetrics.height > 0 ? (
        <div
          className="pointer-events-none absolute z-0 w-px bg-white/12"
          style={{
            left: timelineMetrics.x,
            top: timelineMetrics.start,
            height: timelineMetrics.height,
            transform: "translateX(-50%)",
          }}
        />
      ) : null}

      <div className="space-y-8 sm:space-y-10">
        {items.map((item, index) => (
          <article
            key={`${item.date}-${item.title}`}
            className="grid grid-cols-[2.4rem_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[3.2rem_minmax(0,1fr)] sm:gap-6"
          >
            <div className="relative z-10 flex items-center justify-center self-stretch">
              <span
                ref={(node) => {
                  dotRefs.current[index] = node;
                }}
                className="block h-4 w-4 rounded-full border border-accent/80 bg-[rgba(85,203,255,0.22)] shadow-[0_0_0_4px_rgba(11,15,23,0.92),0_0_18px_rgba(85,203,255,0.18)]"
              />
            </div>

            <div className="section-shell panel-glow relative z-10 overflow-hidden px-6 py-6 sm:px-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(122,92,255,0.12),transparent_24%)] opacity-80" />
              <div className="relative z-10 grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">{item.date}</p>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const CompanyPage = () => {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const { data: company, loading, error } = useSingleton("/company");
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

  if (loading && !company) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataLoader label="Loading company profile..." />
      </main>
    );
  }

  if (!company) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataEmpty message={error || "No company profile available."} />
      </main>
    );
  }

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24"
    >
      <CompanyBrandHero />

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

        <StaticTimeline items={company.timeline || []} />
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

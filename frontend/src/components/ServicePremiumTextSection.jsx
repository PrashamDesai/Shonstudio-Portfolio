import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Reveal from "./Reveal";

const contentBySlug = {
  "unity-2d-games": {
    title: "2D Production Track",
    tagline: "Responsive gameplay loops with release-ready polish.",
    features: [
      {
        title: "Core Loop Clarity",
        detail: "Player actions, rewards, and progression tuned for retention.",
      },
      {
        title: "Level Cadence",
        detail: "Difficulty ramp and pacing aligned to session goals.",
      },
      {
        title: "Performance Safety",
        detail: "Stable build behavior across mobile and desktop targets.",
      },
      {
        title: "Release Polish",
        detail: "UI, feedback, and onboarding pass before deployment.",
      },
    ],
    model: [
      "Mechanics-first sprint before visual expansion.",
      "Level readability review before content scale-up.",
      "Performance pass before final QA handoff.",
    ],
    rhythm: [
      "Week 1-2: Core loop and controls.",
      "Week 3-4: Content, feedback, and balancing.",
      "Week 5+: Optimization and launch prep.",
    ],
    outcomes: [
      "A playable vertical slice with production-viable systems.",
      "A structured backlog for expansion and content updates.",
      "A launch-ready package with deployment checklist.",
    ],
  },
  "3d-games": {
    title: "3D Build Pipeline",
    tagline: "Scope-controlled worlds with stable delivery cadence.",
    features: [
      {
        title: "World Structure",
        detail: "Modular scene planning that scales without rework.",
      },
      {
        title: "Interaction Layer",
        detail: "Readable gameplay states across combat and traversal.",
      },
      {
        title: "Optimization Guardrails",
        detail: "Memory, frame budget, and load-time controls early.",
      },
      {
        title: "Vertical Slice Delivery",
        detail: "Pitch-ready segment that proves execution quality.",
      },
    ],
    model: [
      "Vertical slice architecture before full world expansion.",
      "Interaction clarity checks in each milestone.",
      "Performance and memory budget locked early.",
    ],
    rhythm: [
      "Phase 1: Systems and navigation foundation.",
      "Phase 2: Environment depth and gameplay pacing.",
      "Phase 3: QA, optimization, and shipping prep.",
    ],
    outcomes: [
      "A production-friendly 3D scene architecture.",
      "Stable feature set validated against gameplay goals.",
      "A release roadmap with technical risk visibility.",
    ],
  },
  "xr-games": {
    title: "XR Experience Framework",
    tagline: "Comfort-first interaction design with measurable outcomes.",
    features: [
      {
        title: "Comfort Baseline",
        detail: "Motion, pacing, and UI placement tuned for usability.",
      },
      {
        title: "Interaction Fidelity",
        detail: "Gesture and controller flows validated through testing.",
      },
      {
        title: "Task Guidance",
        detail: "In-experience prompts that reduce confusion in sessions.",
      },
      {
        title: "Device Readiness",
        detail: "Build optimization matched to target headset limits.",
      },
    ],
    model: [
      "Comfort and motion guidelines set on day one.",
      "Interaction testing loops with usability checkpoints.",
      "Device-aware optimization before pilot deployment.",
    ],
    rhythm: [
      "Sprint 1: Core interactions and scene flow.",
      "Sprint 2: Guidance, feedback, and task validation.",
      "Sprint 3: Device polish and launch support.",
    ],
    outcomes: [
      "A pilot-ready immersive experience with clear task flow.",
      "User-tested interaction model with comfort safeguards.",
      "A deployment plan aligned to hardware constraints.",
    ],
  },
  "teaching-modules": {
    title: "Learning Product Blueprint",
    tagline: "Clear instructional flow with interactive retention design.",
    features: [
      {
        title: "Curriculum Mapping",
        detail: "Learning goals mapped to practical module outputs.",
      },
      {
        title: "Interactive Structure",
        detail: "Hands-on activities aligned to progressive difficulty.",
      },
      {
        title: "Assessment Clarity",
        detail: "Outcome checkpoints tied to measurable improvement.",
      },
      {
        title: "Retention Design",
        detail: "Content sequencing optimized for completion and recall.",
      },
    ],
    model: [
      "Curriculum structure before visual execution.",
      "Module clarity testing with learner feedback.",
      "Iteration cycles driven by comprehension metrics.",
    ],
    rhythm: [
      "Stage 1: Learning goals and pathway design.",
      "Stage 2: Interactive module build and review.",
      "Stage 3: Assessment refinement and rollout.",
    ],
    outcomes: [
      "A complete learning flow from onboarding to outcomes.",
      "Assessment-ready content with instructional consistency.",
      "A scalable module format for future course expansion.",
    ],
  },
  "qa-testing": {
    title: "QA Delivery System",
    tagline: "Targeted testing loops that reduce release risk.",
    features: [
      {
        title: "Risk Prioritization",
        detail: "Test effort focused on release-critical failure paths.",
      },
      {
        title: "Regression Discipline",
        detail: "Stable verification across iterative development cycles.",
      },
      {
        title: "Bug Clarity",
        detail: "Actionable reports with reproducible steps and impact.",
      },
      {
        title: "Release Confidence",
        detail: "Final validation aligned to shipping criteria.",
      },
    ],
    model: [
      "Risk-based test strategy mapped to release goals.",
      "Regression lanes and bug severity discipline.",
      "Decision-ready reporting for production leads.",
    ],
    rhythm: [
      "Cycle 1: Baseline functional coverage.",
      "Cycle 2: Regression and edge-case hardening.",
      "Cycle 3: Release validation and sign-off.",
    ],
    outcomes: [
      "A structured QA matrix tied to product risk.",
      "Cleaner sprint handoffs with faster fix turnaround.",
      "Release sign-off backed by evidence, not guesswork.",
    ],
  },
  "game-audio-production": {
    title: "Game Audio Direction",
    tagline: "Sonic identity tuned to gameplay rhythm and impact.",
    features: [
      {
        title: "Sonic Identity",
        detail: "Audio tone system aligned to game world and pacing.",
      },
      {
        title: "Feedback Layer",
        detail: "High-signal SFX for actions, hits, and state changes.",
      },
      {
        title: "Adaptive Mix",
        detail: "Dynamic transitions for tension, flow, and downtime.",
      },
      {
        title: "Implementation Support",
        detail: "Integration guidance for clean in-engine playback.",
      },
    ],
    model: [
      "Audio identity pass before asset finalization.",
      "Feedback-first implementation for gameplay response.",
      "Mix balancing across critical play scenarios.",
    ],
    rhythm: [
      "Phase 1: Sonic palette and direction lock.",
      "Phase 2: SFX, ambience, and adaptive layers.",
      "Phase 3: Integration QA and mastering pass.",
    ],
    outcomes: [
      "A cohesive audio pack mapped to gameplay moments.",
      "Mix standards that hold across varied play sessions.",
      "A scalable pipeline for future content updates.",
    ],
  },
  "ad-design-for-games": {
    title: "Campaign Creative System",
    tagline: "Launch-ready ad visuals with consistent brand velocity.",
    features: [
      {
        title: "Message Framing",
        detail: "Clear value proposition translated into visual hooks.",
      },
      {
        title: "Concept Variants",
        detail: "Multiple ad directions aligned to audience segments.",
      },
      {
        title: "Channel Adaptation",
        detail: "Creative resized and tuned for each media surface.",
      },
      {
        title: "Launch Kit",
        detail: "Final asset system ready for campaign rollout.",
      },
    ],
    model: [
      "Offer clarity and visual hook set first.",
      "Concept variants tested for message precision.",
      "Production kit delivered for campaign scale.",
    ],
    rhythm: [
      "Step 1: Campaign concept and direction frames.",
      "Step 2: Asset production and channel variants.",
      "Step 3: Final delivery and iteration support.",
    ],
    outcomes: [
      "A campaign-ready visual system with channel consistency.",
      "High-impact creative that preserves brand tone.",
      "A reusable production template for future launches.",
    ],
  },
};

const defaultContent = {
  title: "Service Delivery Framework",
  tagline: "Focused execution with premium production discipline.",
  features: [
    {
      title: "Scope Alignment",
      detail: "Clear objectives translated into buildable milestones.",
    },
    {
      title: "Execution Quality",
      detail: "Production standards enforced through each cycle.",
    },
    {
      title: "Validation Loops",
      detail: "Feedback and QA embedded before launch stage.",
    },
    {
      title: "Launch Support",
      detail: "Final package delivered with handoff clarity.",
    },
  ],
  model: [
    "Clarity-first planning before build expansion.",
    "Iteration checkpoints for quality control.",
    "Release-ready handoff with measurable outcomes.",
  ],
  rhythm: [
    "Step 1: Scope and system definition.",
    "Step 2: Core production and testing.",
    "Step 3: Polish, QA, and launch readiness.",
  ],
  outcomes: [
    "A delivery plan tied to product and timeline goals.",
    "A production cycle with visible quality checkpoints.",
    "A release package prepared for confident rollout.",
  ],
};

const ServicePremiumTextSection = ({ service }) => {
  const slug = String(service?.slug || "").toLowerCase();
  const content = contentBySlug[slug] || defaultContent;

  return (
    <section className="mt-10 overflow-hidden rounded-[1.55rem] border border-white/10 bg-[radial-gradient(circle_at_18%_8%,rgba(85,203,255,0.18),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(137,109,255,0.2),transparent_34%),linear-gradient(155deg,rgba(10,15,25,0.92),rgba(14,22,35,0.9))] p-5 sm:p-7 lg:p-8">
      <Reveal>
        <div className="space-y-7">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accentSoft">Execution Model</p>
            <h2 className="font-display text-[clamp(2.2rem,6.2vw,4.2rem)] font-semibold leading-[0.92] tracking-tight text-white">
              {content.title}
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">{content.tagline}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.features.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, borderColor: "rgba(85,203,255,0.42)" }}
                className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
              >
                <p className="font-display text-2xl font-semibold tracking-tight text-white">{item.title}</p>
                <p className="mt-2 text-base leading-7 text-muted">{item.detail}</p>
              </motion.article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
            >
              <p className="font-display text-2xl font-semibold tracking-tight text-white">Production Model</p>
              <div className="mt-3 space-y-2">
                {content.model.map((point) => (
                  <p key={point} className="text-base text-muted">
                    {point}
                  </p>
                ))}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
            >
              <p className="font-display text-2xl font-semibold tracking-tight text-white">Delivery Rhythm</p>
              <div className="mt-3 space-y-2">
                {content.rhythm.map((point) => (
                  <p key={point} className="text-base text-muted">
                    {point}
                  </p>
                ))}
              </div>
            </motion.article>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
          >
            <p className="font-display text-2xl font-semibold tracking-tight text-white">Delivery Outcomes</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {content.outcomes.map((point) => (
                <p key={point} className="text-base text-muted">
                  {point}
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      </Reveal>

      <Reveal delay={0.12} className="mt-6 rounded-[1.1rem] border border-white/12 bg-white/[0.04] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Plan Your Build</p>
            <p className="mt-1 text-base text-muted">Define scope, delivery timeline, and launch targets.</p>
          </div>
          <Link
            to="/counselling"
            className="theme-button-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] sm:w-auto"
            data-cursor="link"
          >
            Book Strategy Call
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default ServicePremiumTextSection;
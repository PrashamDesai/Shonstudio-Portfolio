import { motion } from "framer-motion";

import { pageTransition } from "../animations/variants";
import ContactPanel from "../components/ContactPanel";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";

const counsellingSteps = [
  {
    step: "01",
    title: "Idea validation",
    description:
      "We pressure-test the idea early by checking audience fit, production scope, platform needs, and the clearest value proposition.",
  },
  {
    step: "02",
    title: "Design framing",
    description:
      "Core mechanics, experience goals, art direction, and milestone expectations are shaped into a focused design route.",
  },
  {
    step: "03",
    title: "Development planning",
    description:
      "We define the build approach, team needs, technical risks, and a practical production roadmap before expensive momentum starts.",
  },
  {
    step: "04",
    title: "Testing and refinement",
    description:
      "We validate feel, flow, usability, and feature readiness so the project matures with fewer surprises.",
  },
];

const CounsellingPage = () => (
  <motion.main
    variants={pageTransition}
    initial="initial"
    animate="enter"
    exit="exit"
    className="space-y-10 pb-24 sm:space-y-12"
  >
    <SectionHeader
      eyebrow="Client counselling"
      title="Strategic sessions before full production begins."
      description="We refine idea, scope, and priorities so your team moves forward with less risk."
    />

    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {counsellingSteps.map((item, index) => (
        <Reveal key={item.step} delay={index * 0.06}>
          <article className="section-shell panel-glow h-full p-5 sm:p-8">
            <p className="counselling-step-number text-sm uppercase tracking-[0.32em] sm:text-base">{item.step}</p>
            <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {item.title}
            </h3>
            <p className="mt-3 text-base leading-8 text-muted sm:text-lg">{item.description}</p>
          </article>
        </Reveal>
      ))}
    </section>

    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal>
        <div className="section-shell panel-glow h-full p-6 sm:p-8">
          <p className="eyebrow">How it helps</p>
          <div className="mt-6 space-y-5 text-base leading-8 text-muted sm:text-lg">
            <p>
              Counselling is built for teams that need a sharper direction before committing major
              production budget.
            </p>
            <p>
              We validate scope, identify early UX and technical risks, and shape a practical first
              release path.
            </p>
            <p>
              The outcome is a roadmap your stakeholders can approve quickly and your team can
              execute with confidence.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <ContactPanel />
      </Reveal>
    </section>
  </motion.main>
);

export default CounsellingPage;

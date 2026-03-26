import { motion } from "framer-motion";

import { pageTransition } from "../animations/variants";
import { counsellingSteps } from "../assets/mockData";
import ContactPanel from "../components/ContactPanel";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";

const CounsellingPage = () => (
  <motion.main
    variants={pageTransition}
    initial="initial"
    animate="enter"
    exit="exit"
    className="space-y-12 pb-24"
  >
    <SectionHeader
      eyebrow="Client counselling"
      title="A guided path for founders and teams who need clarity before full production begins."
      description="This page frames the studio as a practical creative partner: someone who can sharpen the idea, align scope, and reduce expensive uncertainty before a build accelerates."
    />

    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {counsellingSteps.map((item, index) => (
        <Reveal key={item.step} delay={index * 0.06}>
          <article className="section-shell panel-glow h-full p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">{item.step}</p>
            <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
          </article>
        </Reveal>
      ))}
    </section>

    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal>
        <div className="section-shell panel-glow h-full p-6 sm:p-8">
          <p className="eyebrow">How it helps</p>
          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <p>
              The counselling layer is for teams who know they want to build something but need a
              sharper point of view before spending deeper production time and budget.
            </p>
            <p>
              That can mean validating whether the idea is appropriately scoped, defining the
              minimal first version, or identifying where design, tech, UX, and testing risks will
              likely show up.
            </p>
            <p>
              The result is a clearer roadmap, better expectations, and a project story that
              clients or internal stakeholders can get behind faster.
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

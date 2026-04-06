import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Reveal from "./Reveal";

const featureBlocks = [
  {
    title: "Layered Depth",
    detail: "Parallax staging with clean combat readability.",
  },
  {
    title: "Frame Stability",
    detail: "Stable FPS during effects-heavy encounters.",
  },
  {
    title: "Cross-Platform",
    detail: "PC, console, and mobile deployment lanes.",
  },
  {
    title: "Visual Polish",
    detail: "Cinematic lighting with stylized motion cues.",
  },
];

const depthContent = [
  {
    title: "Production Model",
    points: [
      "Style frame lock before content scale-up.",
      "Gameplay readability pass before polish pass.",
      "Vertical slice gates for scope control.",
    ],
  },
  {
    title: "Delivery Rhythm",
    points: [
      "Week 1-2: Mechanics and camera language.",
      "Week 3-4: Environment depth and combat clarity.",
      "Week 5+: Optimization, QA, and release prep.",
    ],
  },
];

const microUxPoints = [
  "Hover: depth cards lift with directional glow.",
  "Scroll: staggered reveal with soft y-parallax.",
  "Transitions: cinematic ease curves for premium pace.",
];

const TwoPointFiveDServiceSection = () => (
  <section className="mt-10 overflow-hidden rounded-[1.55rem] border border-white/10 bg-[radial-gradient(circle_at_18%_8%,rgba(85,203,255,0.18),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(137,109,255,0.2),transparent_34%),linear-gradient(155deg,rgba(10,15,25,0.92),rgba(14,22,35,0.9))] p-5 sm:p-7 lg:p-8">
    <Reveal>
      <div className="space-y-7">
        <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accentSoft">2.5D Game Development</p>
            <h2 className="font-display text-[clamp(2.35rem,6.4vw,4.5rem)] font-semibold leading-[0.92] tracking-tight text-white">
              2.5D Worlds Built Sharp
            </h2>
            <p className="max-w-3xl text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
              Cinematic depth. Competitive clarity. Built to convert attention.
            </p>
            <p className="text-base uppercase tracking-[0.2em] text-mutedDeep">From vertical slice to launch cadence.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            {featureBlocks.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, borderColor: "rgba(85,203,255,0.42)" }}
                className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
              >
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-muted">{item.detail}</p>
              </motion.article>
            ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {depthContent.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1rem] border border-white/12 bg-black/25 p-5"
            >
              <p className="font-display text-2xl font-semibold tracking-tight text-white">{item.title}</p>
              <div className="mt-3 space-y-2">
                {item.points.map((point) => (
                  <p key={point} className="text-base text-muted">
                    {point}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="rounded-[1rem] border border-white/12 bg-black/25 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentSoft">Micro UX</p>
          <div className="mt-3 space-y-2">
            {microUxPoints.map((item) => (
              <p key={item} className="text-base text-muted">
                {item}
              </p>
            ))}
            </div>
        </div>
      </div>
    </Reveal>

    <Reveal delay={0.12} className="mt-6 rounded-[1.1rem] border border-white/12 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start a 2.5D Build</p>
          <p className="mt-1 text-base text-muted">Get a vertical slice direction in 72 hours.</p>
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

export default TwoPointFiveDServiceSection;
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(14px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.01,
    filter: "blur(10px)",
    transition: {
      duration: 0.42,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export const revealUp = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.97,
    filter: "blur(10px)",
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const staggerChildren = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

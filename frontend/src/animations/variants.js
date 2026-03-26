export const pageTransition = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.994,
    filter: "blur(6px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 1.002,
    filter: "blur(5px)",
    transition: {
      duration: 0.26,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export const revealUp = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
    filter: "blur(8px)",
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
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

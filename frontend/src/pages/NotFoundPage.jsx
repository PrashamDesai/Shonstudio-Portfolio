import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { pageTransition } from "../animations/variants";

const NotFoundPage = () => (
  <motion.main
    variants={pageTransition}
    initial="initial"
    animate="enter"
    exit="exit"
    className="grid min-h-[70vh] place-items-center py-16"
  >
    <div className="section-shell panel-glow max-w-2xl space-y-5 p-10 text-center">
      <p className="eyebrow mx-auto">404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        This page is off the route map.
      </h1>
      <p className="text-sm leading-7 text-muted">
        The URL is invalid or outdated. Jump back to the homepage and continue browsing.
      </p>
      <Link
        to="/"
        className="theme-button-primary inline-flex rounded-full px-5 py-3 text-sm font-semibold"
        data-cursor="link"
      >
        Return home
      </Link>
    </div>
  </motion.main>
);

export default NotFoundPage;

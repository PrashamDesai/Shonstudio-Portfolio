import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import studioLogo from "../assets/ShonStudio Logo.svg";
import { useTheme } from "../context/ThemeContext.jsx";
import MagneticButton from "./MagneticButton";

const primaryNavItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "Counselling", to: "/counselling" },
  { label: "Training", to: "/training" },
  { label: "Tools", to: "/tools" },
];

const aboutItems = [
  {
    label: "Company",
    to: "/company",
    description: "Studio story, parent network, and milestones.",
  },
  {
    label: "Team",
    to: "/team",
    description: "Developing and designing talent across the studio.",
  },
];

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -20,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -12,
    transition: {
      duration: 0.35,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ThemeToggleButton = ({ theme, onToggle, className = "" }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className={`theme-toggle ${className}`}
    data-cursor="link"
    data-cursor-label={theme === "dark" ? "Light mode" : "Dark mode"}
    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
  >
    <motion.svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: theme === "dark" ? 0 : 28, scale: theme === "dark" ? 1 : 0.92 }}
      transition={{ duration: 0.25 }}
    >
      {theme === "dark" ? (
        <>
          <path d="M12 3v2.4" />
          <path d="M12 18.6V21" />
          <path d="M3 12h2.4" />
          <path d="M18.6 12H21" />
          <path d="m5.64 5.64 1.7 1.7" />
          <path d="m16.66 16.66 1.7 1.7" />
          <path d="m16.66 7.34 1.7-1.7" />
          <path d="m5.64 18.36 1.7-1.7" />
          <circle cx="12" cy="12" r="3.6" />
        </>
      ) : (
        <path d="M21 12.7A9 9 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" />
      )}
    </motion.svg>
  </motion.button>
);

const DesktopNavItem = ({ item }) => (
  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
    <NavLink
      to={item.to}
      data-cursor="link"
      data-cursor-label="Open"
      className={({ isActive }) =>
        `group relative flex h-11 items-center rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors ${
          isActive ? "text-white" : "text-muted hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 rounded-full border border-accent/25 bg-theme-gradient opacity-80 shadow-glow"
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            />
          ) : null}
          <span className="absolute inset-x-3 bottom-[6px] h-px origin-left scale-x-0 bg-theme-gradient transition-transform duration-500 group-hover:scale-x-100" />
          <span className="relative z-10">{item.label}</span>
        </>
      )}
    </NavLink>
  </motion.div>
);

const DesktopAboutItem = ({ isActive, isOpen, onOpen, onClose }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.25 }}
    className="relative"
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
    onFocusCapture={onOpen}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        onClose();
      }
    }}
  >
    <button
      type="button"
      data-cursor="link"
      data-cursor-label="Open"
      className={`group relative flex h-11 items-center gap-2 rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors ${
        isActive ? "text-white" : "text-muted hover:text-white"
      }`}
    >
      {isActive ? (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full border border-accent/25 bg-theme-gradient opacity-80 shadow-glow"
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        />
      ) : null}
      <span className="absolute inset-x-3 bottom-[6px] h-px origin-left scale-x-0 bg-theme-gradient transition-transform duration-500 group-hover:scale-x-100" />
      <span className="relative z-10">About</span>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="relative z-10 h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </button>

    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-full z-20 w-[18rem] pt-3"
        >
          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-surface/95 shadow-soft backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(122,92,255,0.14),transparent_26%)]" />
            <div className="relative z-10 p-2">
              {aboutItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  data-cursor="link"
                  data-cursor-label="Open"
                  className="group block rounded-[1.2rem] px-4 py-3 transition hover:bg-white/[0.05]"
                >
                  <p className="font-display text-xl font-semibold tracking-tight text-white">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </motion.div>
);

const MobileAboutGroup = ({ isActive, isOpen, onToggle }) => (
  <motion.div variants={menuItemVariants}>
    <div
      className={`rounded-[1.75rem] border px-5 py-4 transition ${
        isActive
          ? "border-accent/24 bg-white/[0.05]"
          : "border-white/8 bg-white/[0.04] hover:border-accent/18 hover:bg-white/[0.06]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-white"
        data-cursor="link"
        data-cursor-label="Open"
      >
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">About</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-mutedDeep">
            Company and team
          </p>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none text-accentSoft"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
              {aboutItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-cursor="link"
                  data-cursor-label="Open"
                  className={({ isActive: isItemActive }) =>
                    `block rounded-[1.2rem] px-4 py-3 transition ${
                      isItemActive
                        ? "border border-accent/22 bg-white/[0.06]"
                        : "border border-transparent bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                    }`
                  }
                >
                  {({ isActive: isItemActive }) => (
                    <>
                      <p className="font-display text-lg font-semibold tracking-tight text-white">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-muted">
                        {isItemActive ? "Current route" : item.description}
                      </p>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  </motion.div>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAboutMobileOpen, setIsAboutMobileOpen] = useState(false);
  const location = useLocation();

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const glowX = useSpring(pointerX, { stiffness: 180, damping: 24, mass: 0.6 });
  const glowY = useSpring(pointerY, { stiffness: 180, damping: 24, mass: 0.6 });
  const orbitX = useTransform(glowX, [0, 100], [-10, 10]);
  const shellGlow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0,212,255,0.22), transparent 22%), radial-gradient(circle at 78% 18%, rgba(122,92,255,0.18), transparent 24%), radial-gradient(circle at 20% 100%, rgba(0,255,198,0.10), transparent 20%)`;
  const isAboutRouteActive = aboutItems.some((item) => location.pathname === item.to);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsAboutOpen(false);
    setIsAboutMobileOpen(false);
  }, [location.pathname]);

  const handleShellMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    pointerX.set(x);
    pointerY.set(y);
  };

  const resetShellMove = () => {
    pointerX.set(50);
    pointerY.set(50);
  };

  return (
    <header className="pointer-events-none relative z-[100] mb-2 sm:mb-3">
      <div className="mx-auto max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-10">
        <motion.div
          onMouseMove={handleShellMove}
          onMouseLeave={resetShellMove}
          animate={{
            scale: isScrolled ? 0.97 : 1,
            y: isScrolled ? -2 : 0,
            paddingTop: isScrolled ? 10 : 14,
            paddingBottom: isScrolled ? 10 : 14,
            backgroundColor: isScrolled
              ? "rgb(var(--surface-rgb) / 0.9)"
              : "rgb(var(--surface-rgb) / 0.62)",
            borderColor: isScrolled
              ? "rgb(var(--accent-primary-rgb) / 0.26)"
              : "rgb(var(--border-rgb) / 0.74)",
            boxShadow: isScrolled
              ? "0 24px 70px rgb(6 12 27 / 0.36), 0 0 0 1px rgb(var(--accent-primary-rgb) / 0.12), 0 0 34px rgb(var(--accent-secondary-rgb) / 0.2)"
              : "0 18px 42px rgb(6 12 27 / 0.24), 0 0 20px rgb(var(--accent-primary-rgb) / 0.12)",
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative overflow-visible rounded-[1.9rem] border px-4 sm:px-6"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.9rem]">
            <motion.div className="absolute inset-0 opacity-90" style={{ backgroundImage: shellGlow }} />
            <div className="absolute inset-[1px] rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] backdrop-blur-2xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <motion.div
              aria-hidden="true"
              style={{ x: orbitX }}
              className="absolute inset-y-3 left-5 w-24 rounded-full bg-gradient-to-r from-accent/12 to-accentAlt/12 blur-2xl"
            />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group flex items-center gap-3"
              data-cursor="link"
              data-cursor-label="Home"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-accent/20 bg-[linear-gradient(135deg,rgba(0,212,255,0.16),rgba(122,92,255,0.18),rgba(255,255,255,0.03))] text-sm font-semibold text-white shadow-glow">
                  <motion.span
                    animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.18, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl bg-accent/10"
                  />
                  <img
                    src={studioLogo}
                    alt="ShonStudio logo"
                    className="relative z-10 h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold tracking-[0.18em] text-white">
                    ShonStudio
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.36em] text-mutedDeep">
                    From Ideas to Immersion.
                  </p>
                </div>
              </motion.div>
            </Link>

            <nav className="hidden items-center gap-1 xl:flex">
              {primaryNavItems.map((item) => (
                <DesktopNavItem key={item.to} item={item} />
              ))}
              <DesktopAboutItem
                isActive={isAboutRouteActive}
                isOpen={isAboutOpen}
                onOpen={() => setIsAboutOpen(true)}
                onClose={() => setIsAboutOpen(false)}
              />
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggleButton theme={theme} onToggle={toggleTheme} className="hidden xl:grid" />

              <MagneticButton
                to="/counselling"
                cursorLabel="Open"
                className="theme-button-primary hidden h-11 items-center justify-center rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.24em] xl:inline-flex"
              >
                Start project
              </MagneticButton>

              <ThemeToggleButton theme={theme} onToggle={toggleTheme} className="xl:hidden" />

              <motion.button
                type="button"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsOpen((open) => !open)}
                className="group relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-elevated/70 xl:hidden"
                data-cursor="link"
                data-cursor-label="Menu"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.16),transparent_60%),radial-gradient(circle_at_80%_100%,rgba(122,92,255,0.14),transparent_50%)] opacity-80" />
                <div className="relative space-y-1.5">
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0, width: isOpen ? 20 : 18 }}
                    className="block h-px bg-white"
                  />
                  <motion.span
                    animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 8 : 0 }}
                    className="block h-px w-5 bg-white/85"
                  />
                  <motion.span
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0, width: isOpen ? 20 : 14 }}
                    className="ml-auto block h-px bg-white"
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed inset-0 z-[99] xl:hidden"
          >
            <motion.div className="absolute inset-0 bg-base/82 backdrop-blur-2xl" />
            <div className="relative flex h-full items-start px-4 pb-6 pt-4 sm:px-6">
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.5rem] border border-accent/16 bg-surface/95 p-6 shadow-soft"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(122,92,255,0.14),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(0,255,198,0.08),transparent_22%)]" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold tracking-[0.18em] text-white">
                      Navigation
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-mutedDeep">
                      System panel
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-elevated/80 text-white"
                      data-cursor="link"
                      data-cursor-label="Close"
                    >
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-12 flex flex-1 flex-col justify-between">
                  <div className="space-y-3">
                    {primaryNavItems.map((item) => (
                      <motion.div key={item.to} variants={menuItemVariants}>
                        <NavLink
                          to={item.to}
                          data-cursor="link"
                          data-cursor-label="Open"
                          className={({ isActive }) =>
                            `group flex items-center justify-between rounded-[1.75rem] border px-5 py-4 text-white transition ${
                              isActive
                                ? "border-accent/28 bg-theme-gradient shadow-glow"
                                : "border-white/8 bg-white/[0.04] hover:border-accent/18 hover:bg-white/[0.06]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div>
                                <p className="font-display text-2xl font-semibold tracking-tight">
                                  {item.label}
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-mutedDeep">
                                  {isActive ? "Current route" : "Navigate"}
                                </p>
                              </div>
                              <span className="text-sm text-accentSoft/80 transition group-hover:translate-x-1">
                                /
                              </span>
                            </>
                          )}
                        </NavLink>
                      </motion.div>
                    ))}

                    <MobileAboutGroup
                      isActive={isAboutRouteActive}
                      isOpen={isAboutMobileOpen}
                      onToggle={() => setIsAboutMobileOpen((current) => !current)}
                    />
                  </div>

                  <motion.div variants={menuItemVariants} className="mt-8">
                    <MagneticButton
                      to="/counselling"
                      cursorLabel="Open"
                      className="theme-button-primary inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-[11px] font-semibold uppercase tracking-[0.28em]"
                    >
                      Launch a project brief
                    </MagneticButton>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import brandMark from "../assets/brand-mark.svg";
import { useTheme } from "../context/ThemeContext.jsx";
import MagneticButton from "./MagneticButton";

const setNavHoverPoint = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--nav-glow-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--nav-glow-y", `${event.clientY - rect.top}px`);
};

const resetNavHoverPoint = (event) => {
  event.currentTarget.style.setProperty("--nav-glow-x", "50%");
  event.currentTarget.style.setProperty("--nav-glow-y", "50%");
};

const primaryNavItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "Counselling", to: "/counselling" },
  { label: "Training", to: "/training" },
  // TEMPORARY TOOLS HOLD:
  // Tools is hidden completely from navbar for now.
  // AI REVERT INSTRUCTIONS:
  // 1) Uncomment the line below.
  // 2) Keep the exact `to: "/tools"` route value.
  // { label: "Tools", to: "/tools" },
];

const aboutItems = [
  {
    label: "Company",
    to: "/company",
    description: "Studio story and milestones",
  },
  {
    label: "Team",
    to: "/team",
    description: "Developing and designing talent",
  },
];

const ThemeToggleButton = ({ theme, onToggle, className = "" }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className={`theme-toggle inline-flex items-center justify-center ${className}`}
    data-cursor="link"
    data-cursor-label={theme === "dark" ? "Light mode" : "Dark mode"}
    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    aria-pressed={theme === "light"}
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
  <NavLink
    to={item.to}
    data-cursor="link"
    data-cursor-label="Open"
    onMouseMove={setNavHoverPoint}
    onMouseLeave={resetNavHoverPoint}
    className={({ isActive }) =>
      `theme-nav-link group relative inline-flex h-11 items-center px-2 text-[12px] font-semibold uppercase tracking-[0.2em] transition ${
        isActive
          ? "theme-nav-link-active text-textPrimary"
          : "text-muted hover:text-textPrimary"
      }`
    }
  >
    {item.label}
  </NavLink>
);

const MobileMenuLink = ({ item, onClose }) => (
  <NavLink
    to={item.to}
    onClick={onClose}
    data-cursor="link"
    data-cursor-label="Open"
    className={({ isActive }) =>
      `group flex items-center justify-between rounded-[1.05rem] border px-4 py-3 transition ${
        isActive
          ? "border-accent/28 bg-theme-gradient text-[rgb(248,251,255)] shadow-glow"
          : "border-white/10 bg-white/[0.04] text-textPrimary hover:border-accent/16"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className="font-display text-lg font-semibold tracking-tight">{item.label}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-mutedDeep">
          {isActive ? "Current" : "Open"}
        </span>
      </>
    )}
  </NavLink>
);

const MobileAboutLink = ({ item, onClose }) => (
  <NavLink
    to={item.to}
    onClick={onClose}
    data-cursor="link"
    data-cursor-label="Open"
    className={({ isActive }) =>
      `rounded-[1.05rem] border px-4 py-3 transition ${
        isActive
          ? "border-accent/28 bg-white/[0.09]"
          : "border-white/10 bg-white/[0.04] hover:border-accent/16"
      }`
    }
  >
    <p className="font-display text-lg font-semibold tracking-tight text-textPrimary">{item.label}</p>
    <p className="mt-1 text-xs text-muted">{item.description}</p>
  </NavLink>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const isAboutRouteActive = aboutItems.some((item) => location.pathname === item.to);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAboutOpen(false);
  }, [location.pathname]);

  const navPalette =
    theme === "light"
      ? {
          scrolledBorder: "rgba(49, 117, 255, 0.34)",
          restingBorder: "rgba(111, 130, 168, 0.56)",
          scrolledBackground: "rgba(255, 255, 255, 0.9)",
          restingBackground: "rgba(255, 255, 255, 0.74)",
        }
      : {
          scrolledBorder: "rgba(85, 203, 255, 0.28)",
          restingBorder: "rgba(145, 163, 201, 0.68)",
          scrolledBackground: "rgba(20, 27, 40, 0.9)",
          restingBackground: "rgba(20, 27, 40, 0.74)",
        };

  return (
    <header className="pointer-events-none relative z-[100] mb-2">
      <div className="mx-auto max-w-[1760px] px-3 pt-3 sm:px-6 sm:pt-4 lg:px-10 2xl:px-12">
        <motion.div
          animate={{
            y: isScrolled ? -2 : 0,
            scale: isScrolled ? 0.985 : 1,
            paddingTop: isScrolled ? 10 : 12,
            paddingBottom: isScrolled ? 10 : 12,
            borderColor: isScrolled ? navPalette.scrolledBorder : navPalette.restingBorder,
            backgroundColor: isScrolled ? navPalette.scrolledBackground : navPalette.restingBackground,
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="theme-nav-panel pointer-events-auto relative overflow-visible rounded-[1.35rem] border px-3 backdrop-blur-2xl sm:rounded-[1.8rem] sm:px-5"
        >
          <div className="theme-nav-panel-glow pointer-events-none absolute inset-0 rounded-[inherit]" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="group inline-flex min-w-0 items-center gap-3"
              data-cursor="link"
              data-cursor-label="Home"
            >
              <span className="theme-nav-brand-mark grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-accent/24 sm:h-11 sm:w-11">
                <img src={brandMark} alt="ShonStudio logo" className="h-7 w-7 object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-base font-semibold tracking-[0.14em] text-textPrimary sm:text-lg sm:tracking-[0.18em]">
                  ShonStudio
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.32em] text-mutedDeep sm:block">
                  From Ideas to Immersion.
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-4 lg:flex xl:gap-5">
              {primaryNavItems.map((item) => (
                <DesktopNavItem key={item.to} item={item} />
              ))}

              <div
                className="relative"
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <button
                  type="button"
                  onMouseMove={setNavHoverPoint}
                  onMouseLeave={resetNavHoverPoint}
                  className={`theme-nav-link theme-nav-link-button inline-flex h-11 items-center gap-2 px-2 text-[12px] font-semibold uppercase tracking-[0.2em] transition ${
                    isAboutRouteActive
                      ? "theme-nav-link-active text-textPrimary"
                      : "text-muted hover:text-textPrimary"
                  }`}
                  data-cursor="link"
                  data-cursor-label="Open"
                >
                  About
                </button>

                <AnimatePresence>
                  {isAboutOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full z-[140] mt-2 w-[17rem] overflow-hidden rounded-[1.2rem] border border-white/12 bg-surface/95 p-2 shadow-soft backdrop-blur-2xl"
                    >
                      {aboutItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          data-cursor="link"
                          data-cursor-label="Open"
                          className={({ isActive }) =>
                            `block rounded-[0.95rem] px-3 py-2.5 transition ${
                              isActive
                                ? "border border-accent/24 bg-white/[0.08]"
                                : "border border-transparent hover:bg-white/[0.04]"
                            }`
                          }
                        >
                          <p className="font-display text-lg font-semibold tracking-tight text-textPrimary">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-muted">{item.description}</p>
                        </NavLink>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggleButton
                theme={theme}
                onToggle={toggleTheme}
                className="h-10 w-10 sm:h-11 sm:w-11"
              />

              <MagneticButton
                to="/counselling"
                cursorLabel="Open"
                className="theme-button-primary hidden h-10 items-center justify-center rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline-flex"
              >
                Start project
              </MagneticButton>

              <motion.button
                type="button"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="theme-nav-icon-button group relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border shadow-soft lg:hidden"
                data-cursor="link"
                data-cursor-label="Menu"
              >
                <div className="relative h-4 w-4">
                  <motion.span
                    animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -4 }}
                    className="absolute left-0 top-1/2 block h-px w-4 bg-current"
                  />
                  <motion.span
                    animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 4 }}
                    className="absolute left-0 top-1/2 block h-px w-4 bg-current"
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed inset-0 z-[99] lg:hidden"
          >
            <motion.button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="theme-nav-overlay absolute inset-0 backdrop-blur-xl"
              aria-label="Close menu overlay"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="theme-nav-drawer absolute inset-y-0 right-0 w-full max-w-[28rem] border-l p-4 shadow-soft"
            >
              <div className="theme-nav-drawer-glow absolute inset-0" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl font-semibold tracking-[0.08em] text-textPrimary">Menu</p>
                  <div className="flex items-center gap-2">
                    <ThemeToggleButton
                      theme={theme}
                      onToggle={toggleTheme}
                      className="h-10 w-10"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="theme-nav-icon-button group relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border"
                    >
                      <span className="relative h-4 w-4">
                        <span className="absolute left-0 top-1/2 block h-px w-4 rotate-45 bg-current" />
                        <span className="absolute left-0 top-1/2 block h-px w-4 -rotate-45 bg-current" />
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-6 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-mutedDeep">Navigate</p>
                    <div className="space-y-2">
                      {primaryNavItems.map((item) => (
                        <MobileMenuLink key={item.to} item={item} onClose={() => setIsMenuOpen(false)} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-mutedDeep">About</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {aboutItems.map((item) => (
                        <MobileAboutLink key={item.to} item={item} onClose={() => setIsMenuOpen(false)} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <MagneticButton
                    to="/counselling"
                    cursorLabel="Open"
                    className="theme-button-primary inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-[11px] font-semibold uppercase tracking-[0.22em]"
                  >
                    Launch project brief
                  </MagneticButton>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

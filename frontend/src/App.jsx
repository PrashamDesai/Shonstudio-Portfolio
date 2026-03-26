import { AnimatePresence, domAnimation, LazyMotion, LayoutGroup, MotionConfig } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminToolbar from "./components/AdminToolbar";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";
import { AdminProvider } from "./context/AdminContext.jsx";
import useScrollToTop from "./hooks/useScrollToTop";
import { SmoothScrollProvider } from "./hooks/useSmoothScroll.jsx";

const lazyWithPreload = (loadComponent) => {
  const Component = lazy(loadComponent);
  Component.preload = loadComponent;
  return Component;
};

const CounsellingPage = lazyWithPreload(() => import("./pages/CounsellingPage"));
const CompanyPage = lazyWithPreload(() => import("./pages/Company"));
const HomePage = lazyWithPreload(() => import("./pages/HomePage"));
const NotFoundPage = lazyWithPreload(() => import("./pages/NotFoundPage"));
const ProjectDetailPage = lazyWithPreload(() => import("./pages/ProjectDetailPage"));
const ProjectsPage = lazyWithPreload(() => import("./pages/ProjectsPage"));
const ServicesPage = lazyWithPreload(() => import("./pages/ServicesPage"));
const TeamPage = lazyWithPreload(() => import("./pages/Team"));
const TrainingPage = lazyWithPreload(() => import("./pages/TeachingPage"));
const ToolsPage = lazyWithPreload(() => import("./pages/ToolsPage"));

const preloadRouteComponents = () =>
  Promise.allSettled([
    HomePage.preload(),
    ProjectsPage.preload(),
    ProjectDetailPage.preload(),
    ServicesPage.preload(),
    CounsellingPage.preload(),
    CompanyPage.preload(),
    TeamPage.preload(),
    TrainingPage.preload(),
    ToolsPage.preload(),
    NotFoundPage.preload(),
  ]);

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center pb-24">
    <div className="section-shell panel-glow flex w-full max-w-3xl items-center justify-between gap-6 px-6 py-5 sm:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Loading page</p>
        <p className="mt-2 text-sm text-muted">
          Bringing the next section in without dropping the layout.
        </p>
      </div>
      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-14 animate-pulse rounded-full bg-theme-gradient" />
      </div>
    </div>
  </div>
);

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    void preloadRouteComponents();

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <AnimatePresence>{isLoading ? <LoadingScreen key="loader" /> : null}</AnimatePresence>

        {!isLoading ? (
          <AdminProvider>
            <SmoothScrollProvider>
              <LayoutGroup id="portfolio-layout">
                <div className="relative min-h-screen overflow-x-hidden bg-base text-white">
                  <div className="pointer-events-none fixed inset-0 -z-10 bg-mesh-radial opacity-80" />
                  <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.14),transparent_34%),radial-gradient(circle_at_78%_0%,rgba(122,92,255,0.12),transparent_26%)]" />
                  <ScrollProgressBar />
                  <CustomCursor />
                  <Navbar />
                  <AdminToolbar />
                  <div className="mx-auto min-h-screen max-w-[1600px] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
                    <Suspense fallback={<RouteFallback />}>
                      <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/projects" element={<ProjectsPage />} />
                          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                          <Route path="/services" element={<ServicesPage />} />
                          <Route path="/counselling" element={<CounsellingPage />} />
                          <Route path="/company" element={<CompanyPage />} />
                          <Route path="/team" element={<TeamPage />} />
                          <Route path="/training" element={<TrainingPage />} />
                          <Route path="/teaching" element={<Navigate to="/training" replace />} />
                          <Route path="/tools" element={<ToolsPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </AnimatePresence>
                    </Suspense>
                  </div>
                  <Footer />
                </div>
              </LayoutGroup>
            </SmoothScrollProvider>
          </AdminProvider>
        ) : null}
      </LazyMotion>
    </MotionConfig>
  );
};

export default App;

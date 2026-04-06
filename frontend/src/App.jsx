import { AnimatePresence, domAnimation, LazyMotion, LayoutGroup, MotionConfig } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";

import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import ScrollProgressBar from "./components/ScrollProgressBar";
import TabPageLoader from "./components/TabPageLoader";
import { AdminProvider } from "./context/AdminContext.jsx";
import useScrollToTop from "./hooks/useScrollToTop";
import { SmoothScrollProvider } from "./hooks/useSmoothScroll.jsx";

const INITIAL_LOADER_MIN_MS = 1200;

const lazyWithPreload = (loadComponent) => {
  const Component = lazy(loadComponent);
  Component.preload = loadComponent;
  return Component;
};

const CounsellingPage = lazyWithPreload(() => import("./pages/CounsellingPage"));
const CompanyPage = lazyWithPreload(() => import("./pages/Company"));
const HomePage = lazyWithPreload(() => import("./pages/HomePage"));
const LoadersLabPage = lazyWithPreload(() => import("./pages/LoadersLabPage"));
const NotFoundPage = lazyWithPreload(() => import("./pages/NotFoundPage"));
const ProjectPage = lazyWithPreload(() => import("./pages/ProjectPage"));
const ProjectsPage = lazyWithPreload(() => import("./pages/ProjectsPage"));
const ServicePage = lazyWithPreload(() => import("./pages/ServicePage"));
const ServicesPage = lazyWithPreload(() => import("./pages/ServicesPage"));
const TeamPage = lazyWithPreload(() => import("./pages/Team"));
const TrainingCatalogPage = lazyWithPreload(() => import("./pages/TeachingPage"));
const TrainingPage = lazyWithPreload(() => import("./pages/TrainingPage"));
const ToolCategoryPage = lazyWithPreload(() => import("./pages/ToolCategoryPage"));
const ToolsPage = lazyWithPreload(() => import("./pages/ToolsPage"));

const preloadRouteComponents = () => {
  const preloadCritical = Promise.allSettled([HomePage.preload(), ProjectsPage.preload()]);
  const preloadIdle = () =>
    Promise.allSettled([
      ProjectPage.preload(),
      ServicesPage.preload(),
      ServicePage.preload(),
      CounsellingPage.preload(),
      LoadersLabPage.preload(),
      CompanyPage.preload(),
      TeamPage.preload(),
      TrainingCatalogPage.preload(),
      TrainingPage.preload(),
      ToolsPage.preload(),
      ToolCategoryPage.preload(),
      NotFoundPage.preload(),
    ]);

  const idle = typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (callback) => setTimeout(callback, 1200);
  const cancelIdle =
    typeof window !== "undefined" && "cancelIdleCallback" in window
      ? window.cancelIdleCallback
      : clearTimeout;

  const idleHandle = idle(() => {
    void preloadIdle();
  });

  return () => cancelIdle(idleHandle);
};

const RouteFallback = () => (
  <TabPageLoader
    eyebrow="Loading page"
    title="Opening the next tab"
    message="Bringing the next section in without dropping the layout."
  />
);

const LegacyServiceRedirect = () => {
  const { slug } = useParams();

  return <Navigate to={slug ? `/services/${slug}` : "/services"} replace />;
};

const App = () => {
  const location = useLocation();
  const [isDocumentReady, setIsDocumentReady] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

    return document.readyState === "complete";
  });
  const [hasMinLoaderDurationElapsed, setHasMinLoaderDurationElapsed] = useState(false);

  useScrollToTop();

  useEffect(() => {
    const cancelPreload = preloadRouteComponents();
    const markDocumentReady = () => {
      setIsDocumentReady(true);
    };
    const timeoutId = window.setTimeout(() => {
      setHasMinLoaderDurationElapsed(true);
    }, INITIAL_LOADER_MIN_MS);

    if (typeof document !== "undefined" && document.readyState === "complete") {
      markDocumentReady();
    } else {
      window.addEventListener("load", markDocumentReady, { once: true });
    }

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("load", markDocumentReady);

      if (typeof cancelPreload === "function") {
        cancelPreload();
      }
    };
  }, []);

  const showInitialLoader = !isDocumentReady || !hasMinLoaderDurationElapsed;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <AdminProvider>
          <SmoothScrollProvider>
            <LayoutGroup id="portfolio-layout">
              <div className="relative min-h-screen overflow-x-hidden bg-base text-textPrimary">
                <div className="pointer-events-none fixed inset-0 -z-10 bg-mesh-radial opacity-80" />
                <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[24rem] bg-[radial-gradient(circle_at_top,rgb(var(--accent-primary-rgb)_/_0.16),transparent_34%),radial-gradient(circle_at_78%_0%,rgb(var(--accent-secondary-rgb)_/_0.14),transparent_26%)] sm:h-[38rem]" />
                <AnimatePresence mode="wait">
                  {showInitialLoader ? <LoadingScreen key="initial-loading-screen" /> : null}
                </AnimatePresence>
                <ScrollProgressBar />
                <CustomCursor />
                <Navbar />
                <div className="mx-auto min-h-screen max-w-[1760px] px-3 pt-4 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10 2xl:px-12">
                  <Suspense fallback={<RouteFallback />}>
                    <AnimatePresence initial={false} mode="sync">
                      <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dev/loaders" element={<LoadersLabPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/projects/:slug" element={<ProjectPage />} />
                        <Route path="/service" element={<LegacyServiceRedirect />} />
                        <Route path="/service/:slug" element={<LegacyServiceRedirect />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:slug" element={<ServicePage />} />
                        <Route path="/counselling" element={<CounsellingPage />} />
                        <Route path="/company" element={<CompanyPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/teams" element={<Navigate to="/team" replace />} />
                        <Route path="/training" element={<TrainingCatalogPage />} />
                        <Route path="/training/:slug" element={<TrainingPage />} />
                        <Route path="/teaching" element={<Navigate to="/training" replace />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/tools/category/:categorySlug" element={<ToolCategoryPage />} />
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
      </LazyMotion>
    </MotionConfig>
  );
};

export default App;

import { motion } from "framer-motion";

import { pageTransition } from "../animations/variants";
import BrandBounceLoader from "../components/BrandBounceLoader";
import LoadingScreen from "../components/LoadingScreen";
import MediaImage from "../components/MediaImage";
import TabPageLoader from "../components/TabPageLoader";
import { useSingleton } from "../hooks/usePageData";

const LoadersLabPage = () => {
  const { data: loaderApi, loading, error, refetch } = useSingleton("/dev/loaders", {
    initialData: null,
  });

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24"
    >
      <section className="section-shell panel-glow relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/75 px-6 py-8 sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(0,212,255,0.14),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(122,92,255,0.12),transparent_28%)]" />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">Temporary Dev Page</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Loader Lab
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Live preview for all loaders running continuously. This route is for development only.
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="theme-button-secondary rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            Refresh API
          </button>
        </div>

        <div className="relative z-10 mt-6 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          {loading && !loaderApi ? (
            <div className="flex items-center gap-3 text-sm text-muted">
              <BrandBounceLoader size="sm" label="Loading API state" forceAnimate />
              <span>Loading temporary API metadata...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Temporary API response</p>
              <pre className="max-h-[18rem] overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs leading-6 text-muted">
                {JSON.stringify(loaderApi, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <p className="eyebrow">Initial Loader Preview</p>
        <LoadingScreen embedded loopProgress className="min-h-[30rem]" />
      </section>

      <section className="space-y-4">
        <p className="eyebrow">Page Loader Preview</p>
        <TabPageLoader
          eyebrow="Route loading"
          title="Opening the next tab"
          message="Temporary preview mode: this loader keeps animating forever on this page."
          forceAnimate
          className="min-h-[30rem] pb-0"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 bg-surface/72 px-6 py-8 sm:px-8 sm:py-10">
        <p className="eyebrow">Component and Image Loaders</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">Bouncing brand logo</h2>
            <p className="mt-2 text-sm text-muted">Compact loader for cards, widgets, and buttons.</p>
            <div className="mt-6 flex items-end gap-6">
              <BrandBounceLoader size="sm" showLabel label="small" forceAnimate />
              <BrandBounceLoader size="md" showLabel label="medium" forceAnimate />
              <BrandBounceLoader size="lg" showLabel label="large" forceAnimate />
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">MediaImage forced loader</h2>
            <p className="mt-2 text-sm text-muted">
              This preview intentionally omits src so the component-level loading state stays visible.
            </p>
            <div className="mt-6 overflow-hidden rounded-[1.2rem] border border-white/10">
              <MediaImage
                src=""
                alt=""
                wrapperClassName="h-52 w-full"
                imgClassName="h-full w-full object-cover"
                skeletonClassName="bg-[linear-gradient(140deg,rgba(255,255,255,0.05),rgba(255,255,255,0.13),rgba(255,255,255,0.04))]"
                forceLoaderAnimation
              />
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default LoadersLabPage;

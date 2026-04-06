import TabPageLoader from "./TabPageLoader";
import BrandBounceLoader from "./BrandBounceLoader";

export const PageDataLoader = ({ label = "Loading content..." }) => (
  <TabPageLoader
    eyebrow="Loading content"
    title={label}
    message="Syncing the latest data from the studio backend."
    className="min-h-[46vh] pb-12"
  />
);

export const PageDataError = ({
  title = "Unable to load content",
  message = "Please try again in a moment.",
}) => (
  <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
    <h2 className="font-display text-2xl font-semibold tracking-tight text-white">{title}</h2>
    <p className="mt-3 text-sm leading-7 text-muted">{message}</p>
  </div>
);

export const PageDataEmpty = ({
  title = "No content available",
  message = "This section does not have published content yet.",
}) => (
  <div className="section-shell panel-glow rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8">
    <h2 className="font-display text-2xl font-semibold tracking-tight text-white">{title}</h2>
    <p className="mt-3 text-sm leading-7 text-muted">{message}</p>
  </div>
);

export const CardGridSkeleton = ({ count = 6, className = "h-72" }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className={`section-shell panel-glow flex items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.03] ${className}`}
      >
        <BrandBounceLoader size="md" label="Loading cards" />
      </div>
    ))}
  </div>
);

export const CardListSkeleton = ({ count = 3, className = "h-64 sm:h-80" }) => (
  <div className="flex w-full flex-col gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`skeleton-list-${index}`}
        className={`section-shell panel-glow flex w-full items-center justify-center rounded-[1.9rem] border border-white/10 bg-white/[0.03] ${className}`}
      >
        <BrandBounceLoader size="md" label="Loading list" />
      </div>
    ))}
  </div>
);

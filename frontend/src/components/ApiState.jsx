export const PageDataLoader = ({ label = "Loading content..." }) => (
  <div className="section-shell panel-glow flex min-h-[12rem] items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6">
    <div className="flex items-center gap-3 text-sm text-muted">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
      <span>{label}</span>
    </div>
  </div>
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
        className={`section-shell panel-glow animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.03] ${className}`}
      />
    ))}
  </div>
);

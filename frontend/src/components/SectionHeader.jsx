const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  actions = null,
  fullWidth = false,
}) => (
  <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : ""}`}>
    <div
      className={`space-y-5 ${
        actions
          ? "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:space-y-0"
          : ""
      }`}
    >
      <div className="space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        <h2
          className={`${fullWidth ? "" : "max-w-4xl"} font-display text-[clamp(1.9rem,6.8vw,3rem)] font-semibold leading-[1.02] tracking-tight text-textPrimary lg:text-5xl`}
        >
          {title}
        </h2>
        <p
          className={`${fullWidth ? "" : "max-w-2xl"} text-sm leading-7 text-muted sm:text-base sm:leading-8`}
        >
          {description}
        </p>
      </div>
      {actions ? (
        <div className="w-full pt-1 sm:w-auto sm:flex-shrink-0 [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto">
          {actions}
        </div>
      ) : null}
    </div>
  </div>
);

export default SectionHeader;

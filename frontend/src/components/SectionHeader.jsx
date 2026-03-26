const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  actions = null,
  fullWidth = false,
}) => (
  <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : ""}`}>
    <div className={`space-y-4 ${actions ? "lg:flex lg:items-start lg:justify-between lg:gap-6" : ""}`}>
      <div className="space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={`${fullWidth ? "" : "max-w-4xl"} font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl`}>
          {title}
        </h2>
        <p className={`${fullWidth ? "" : "max-w-2xl"} text-sm leading-7 text-muted sm:text-base`}>
          {description}
        </p>
      </div>
      {actions ? <div className="pt-1">{actions}</div> : null}
    </div>
  </div>
);

export default SectionHeader;

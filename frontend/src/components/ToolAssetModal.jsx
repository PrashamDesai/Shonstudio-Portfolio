import { resolveMedia } from "../assets/mediaMap";
import Modal from "./ui/Modal";

const ToolAssetModal = ({ tool, onClose }) => {
  const gallery = [
    tool?.carouselImage,
    tool?.cardImage,
    ...(tool?.gallery || []),
  ]
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);

  return (
    <Modal open={Boolean(tool)} onClose={onClose} maxWidthClass="max-w-5xl" panelClassName="admin-modal-panel">
      {tool ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-5 sm:flex-nowrap sm:px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{tool.category || "Tool"}</p>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{tool.title}</h2>
              <p className="text-sm text-mutedDeep">{tool.publisher || "ShonStudio"}</p>
            </div>
            <button type="button" onClick={onClose} className="admin-secondary-button w-full text-xs sm:w-auto">
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div>
                <img
                  src={resolveMedia(gallery[0] || tool.image)}
                  alt={tool.title}
                  className="aspect-video w-full rounded-[1.2rem] border border-white/10 object-cover"
                />

                {gallery.length > 1 ? (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {gallery.slice(1).map((image) => (
                      <img
                        key={image}
                        src={resolveMedia(image)}
                        alt={`${tool.title} preview`}
                        className="aspect-video w-full rounded-xl border border-white/10 object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Description</p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {tool.description || tool.shortDescription || "No description available."}
                  </p>
                </div>

                <div className="mt-5 rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Use case</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{tool.useCase || "No use case provided."}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Asset details</p>
                  <div className="mt-3 space-y-2 text-sm text-muted">
                    <p className="flex items-center justify-between gap-4">
                      <span>Type</span>
                      <span className="text-white">{tool.type || "Asset"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span>Latest version</span>
                      <span className="text-white">{tool.latestVersion || "1.0.0"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span>File size</span>
                      <span className="text-white">{tool.fileSize || "-"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-4">
                      <span>Rating</span>
                      <span className="text-white">
                        {tool.rating ? `${tool.rating}/5` : "New"}
                        {tool.reviewCount ? ` (${tool.reviewCount})` : ""}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Features</p>
                  <div className="mt-3 space-y-2">
                    {(tool.features || tool.tags || []).map((item) => (
                      <p key={item} className="text-sm text-muted">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Tech used</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(tool.techUsed || tool.tags || []).map((item) => (
                      <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 px-6 py-5 sm:px-8">
            <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
              <div className="rounded-[1rem] border border-white/20 bg-black/45 px-5 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/70">Price</p>
                <p className="mt-1 text-3xl font-black leading-none text-white sm:text-5xl">
                  {tool.price || "FREE"}
                </p>
              </div>
              <a
                href={tool.ctaUrl || "#"}
                className="theme-button-primary inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-base font-semibold sm:w-auto"
                target={tool.ctaUrl && tool.ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={tool.ctaUrl && tool.ctaUrl.startsWith("http") ? "noreferrer" : undefined}
              >
                {tool.ctaLabel || "Purchase"}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ToolAssetModal;


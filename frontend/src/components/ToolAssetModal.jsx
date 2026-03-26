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
    <Modal open={Boolean(tool)} onClose={onClose} maxWidthClass="max-w-3xl" panelClassName="admin-modal-panel">
      {tool ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{tool.category || "Tool"}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">{tool.title}</h2>
            </div>
            <button type="button" onClick={onClose} className="admin-secondary-button text-xs">
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
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

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Description</p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {tool.description || tool.shortDescription}
                </p>
              </div>
              <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Use case</p>
                <p className="mt-3 text-sm leading-7 text-muted">{tool.useCase}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accentSoft">Features</p>
                <div className="mt-3 space-y-2">
                  {(tool.features || tool.tags || []).map((item) => (
                    <p key={item} className="text-sm text-muted">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div>
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

          <div className="border-t border-white/8 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">
                {tool.price ? `Price: ${tool.price}` : "Price: Free"}
              </p>
              <a
                href={tool.ctaUrl || `/tools/${tool.slug}`}
                className="theme-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                {tool.ctaLabel || "Purchase / Use"}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ToolAssetModal;


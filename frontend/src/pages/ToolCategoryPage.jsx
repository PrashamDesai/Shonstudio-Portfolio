import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { toolTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { CardGridSkeleton, PageDataEmpty } from "../components/ApiState";
import ToolAssetModal from "../components/ToolAssetModal";
import {
  CATEGORY_DEFINITIONS,
  filterToolsByCategorySlug,
  getCategoryBySlug,
} from "../components/toolCatalog";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const PRICE_FILTER_OPTIONS = [
  { value: "all", label: "All prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
  { value: "under-20", label: "Under $20" },
  { value: "20-35", label: "$20 to $35" },
  { value: "above-35", label: "Above $35" },
];

const parsePriceValue = (rawPrice) => {
  if (!rawPrice) {
    return 0;
  }

  const normalized = String(rawPrice).trim().toLowerCase();
  if (!normalized || normalized.includes("free")) {
    return 0;
  }

  const matched = normalized.match(/\d+(\.\d+)?/);
  if (!matched) {
    return Number.NaN;
  }

  return Number(matched[0]);
};

const matchesPriceFilter = (tool, priceFilter) => {
  if (priceFilter === "all") {
    return true;
  }

  const price = parsePriceValue(tool?.price);
  const isFree = price === 0;
  const isPaid = Number.isFinite(price) && price > 0;

  if (priceFilter === "free") {
    return isFree;
  }

  if (priceFilter === "paid") {
    return isPaid;
  }

  if (!Number.isFinite(price)) {
    return false;
  }

  if (priceFilter === "under-20") {
    return price > 0 && price < 20;
  }

  if (priceFilter === "20-35") {
    return price >= 20 && price <= 35;
  }

  if (priceFilter === "above-35") {
    return price > 35;
  }

  return true;
};

const ToolCategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [editingTool, setEditingTool] = useState(null);
  const [quickEditingTool, setQuickEditingTool] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(categorySlug);
  const [priceFilter, setPriceFilter] = useState("all");
  const { data: tools, loading, error } = useCollection("/tools");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const category = getCategoryBySlug(categorySlug);
  const categoryTools = useMemo(
    () => filterToolsByCategorySlug(tools, categorySlug),
    [categorySlug, tools],
  );
  const filteredTools = useMemo(
    () => categoryTools.filter((tool) => matchesPriceFilter(tool, priceFilter)),
    [categoryTools, priceFilter],
  );

  useEffect(() => {
    setSelectedCategorySlug(categorySlug);
  }, [categorySlug]);

  const saveTool = async (payload) => {
    if (editingTool?._id) {
      await requestAdmin(`/tools/${editingTool._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }
    signalRefresh();
  };

  const saveQuickTool = async (payload) => {
    if (!quickEditingTool?._id) {
      return;
    }

    await requestAdmin(`/tools/${quickEditingTool._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteTool = async (tool) => {
    if (!tool?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${tool.title}"?`);
    if (!confirmed) {
      return;
    }

    await requestAdmin(`/tools/${tool._id}`, {
      method: "DELETE",
    });
    signalRefresh();
  };

  if (!category) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Category not found</h1>
          <Link to="/tools" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to tools
          </Link>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24"
    >
      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Tool category</p>
            <h1 className="font-display text-[clamp(2rem,8vw,3.25rem)] font-semibold tracking-tight text-white sm:text-5xl">
              {category.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">{category.description}</p>
            <p className="text-sm text-mutedDeep">
              {filteredTools.length === categoryTools.length
                ? `${filteredTools.length} items`
                : `${filteredTools.length} of ${categoryTools.length} items`}
            </p>
            {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              to="/tools"
              className="theme-button-secondary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
            >
              All categories
            </Link>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setEditingTool({ ...toolTemplate, category: category.title })}
                className="theme-button-primary w-full rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                Add tool
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:max-w-2xl md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-xs uppercase tracking-[0.24em] text-accentSoft">Change category</span>
            <select
              value={selectedCategorySlug}
              onChange={(event) => {
                const nextCategorySlug = event.target.value;
                setSelectedCategorySlug(nextCategorySlug);
                if (nextCategorySlug !== categorySlug) {
                  navigate(`/tools/category/${nextCategorySlug}`);
                }
              }}
              className="theme-select-surface w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
            >
              {CATEGORY_DEFINITIONS.map((item) => (
                <option key={item.slug} value={item.slug} className="theme-select-option">
                  {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-muted">
            <span className="text-xs uppercase tracking-[0.24em] text-accentSoft">Price filter</span>
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value)}
              className="theme-select-surface w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
            >
              {PRICE_FILTER_OPTIONS.map((item) => (
                <option key={item.value} value={item.value} className="theme-select-option">
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading && !tools.length ? (
        <CardGridSkeleton count={6} className="h-80" />
      ) : filteredTools.length ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <motion.article
              key={tool.slug || tool.id || tool.title}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="section-shell panel-glow group relative overflow-hidden"
            >
              {isAdmin && tool._id ? (
                <AdminEntityActions
                  onEdit={() => setQuickEditingTool(tool)}
                  onDelete={() => deleteTool(tool)}
                />
              ) : null}

              <button
                type="button"
                onClick={() => setSelectedTool(tool)}
                className="flex h-full w-full flex-col text-left"
                data-cursor="link"
                data-cursor-label="Open"
              >
                <div className="relative overflow-hidden border-b border-white/10">
                  <img
                    src={resolveMedia(tool.cardImage || tool.image)}
                    alt={tool.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="theme-image-overlay-bottom pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/85">{tool.type || "Asset"}</p>
                    <div className="theme-image-hover-ribbon rounded-xl border border-white/25 px-3 py-2 text-right shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/70">Price</p>
                      <p className="text-xl font-black leading-none text-white sm:text-3xl">
                        {tool.price || "FREE"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">{tool.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    {tool.shortDescription || tool.description || "Production-ready asset for delivery workflows."}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs text-mutedDeep">
                    <span>{tool.publisher || "ShonStudio"}</span>
                    <span>
                      {tool.rating ? `${tool.rating} star` : "New"}
                      {tool.reviewCount ? ` (${tool.reviewCount})` : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(tool.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="theme-chip rounded-full px-3 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </section>
      ) : categoryTools.length ? (
        <PageDataEmpty message="No assets match the selected price filter." />
      ) : (
        <PageDataEmpty message="No content available in this category." />
      )}

      {editingTool ? (
        <AdminEntityModal
          title={editingTool._id ? "Edit tool" : "Add tool"}
          entityType="tools"
          initialValue={editingTool}
          onClose={() => setEditingTool(null)}
          onSave={saveTool}
          onDelete={
            editingTool._id
              ? async () => {
                  await deleteTool(editingTool);
                  setEditingTool(null);
                  navigate("/tools");
                }
              : undefined
          }
        />
      ) : null}

      {quickEditingTool ? (
        <AdminQuickEditModal
          title="Quick edit tool card"
          entityType="tools"
          initialValue={quickEditingTool}
          onClose={() => setQuickEditingTool(null)}
          onSave={saveQuickTool}
          onDelete={async () => {
            await deleteTool(quickEditingTool);
            setQuickEditingTool(null);
          }}
        />
      ) : null}

      <ToolAssetModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </motion.main>
  );
};

export default ToolCategoryPage;

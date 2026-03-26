import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { toolTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "../components/AdminEntityActions";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { CardGridSkeleton, PageDataEmpty } from "../components/ApiState";
import HeroCarousel from "../components/HeroCarousel";
import {
  filterToolsByCategorySlug,
  getCategoryBySlug,
  mapToolForCarousel,
} from "../components/toolCatalog";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ToolCategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [editingTool, setEditingTool] = useState(null);
  const [quickEditingTool, setQuickEditingTool] = useState(null);
  const { data: tools, loading, error } = useCollection("/tools");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const category = getCategoryBySlug(categorySlug);
  const categoryTools = useMemo(
    () => filterToolsByCategorySlug(tools, categorySlug),
    [categorySlug, tools],
  );
  const carouselItems = useMemo(
    () => categoryTools.map((tool, index) => mapToolForCarousel(tool, index)),
    [categoryTools],
  );

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
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Category not found</h1>
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Tool category</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {category.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">{category.description}</p>
            <p className="text-sm text-mutedDeep">{categoryTools.length} items</p>
            {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="theme-button-secondary rounded-full px-5 py-3 text-sm font-semibold"
            >
              All categories
            </Link>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setEditingTool({ ...toolTemplate, category: category.title })}
                className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Add tool
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {carouselItems.length ? (
        <section className="relative h-[20rem] sm:h-[24rem]">
          <HeroCarousel categories={[{ key: "tools", label: "Tools", items: carouselItems }]} />
        </section>
      ) : null}

      {loading && !tools.length ? (
        <CardGridSkeleton count={6} className="h-80" />
      ) : categoryTools.length ? (
        <section className="flex w-full flex-col gap-6">
          {categoryTools.map((tool) => (
            <motion.article
              key={tool.slug}
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

              <Link
                to={`/tools/${tool.slug}`}
                className="flex flex-col sm:flex-row h-full sm:h-80 w-full text-left"
                data-cursor="link"
                data-cursor-label="Open"
              >
                <div className="overflow-hidden border-b border-white/10 sm:w-1/3 sm:border-b-0 sm:border-r">
                  <img
                    src={resolveMedia(tool.cardImage || tool.image)}
                    alt={tool.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="space-y-3 p-6 sm:w-2/3 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{tool.type}</p>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-white">{tool.title}</h3>
                  <p className="text-sm leading-7 text-muted">{tool.shortDescription || tool.description}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </section>
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
    </motion.main>
  );
};

export default ToolCategoryPage;

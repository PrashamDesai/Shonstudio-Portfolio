import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { toolTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import AdminEntityModal from "../components/AdminEntityModal";
import { CardListSkeleton, PageDataEmpty } from "../components/ApiState";
import HeroCarousel from "../components/HeroCarousel";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { getToolCategoriesWithCounts, mapToolForCarousel } from "../components/toolCatalog";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ToolsPage = () => {
  const [editingTool, setEditingTool] = useState(null);
  const { data: tools, loading, error, isEmpty } = useCollection("/tools");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const categoryCards = useMemo(() => getToolCategoriesWithCounts(tools), [tools]);
  const carouselItems = useMemo(
    () => tools.map((tool, index) => mapToolForCarousel(tool, index)),
    [tools],
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

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-10 pb-24"
    >
      <SectionHeader
        eyebrow="Tools and assets"
        title="Studio tooling organized like a production marketplace."
        description="Browse by category, then drill into individual assets and utilities built for real delivery workflows."
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setEditingTool(toolTemplate)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Add tool
            </button>
          ) : null
        }
      />

      {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}


      {loading && !tools.length ? (
        <CardListSkeleton count={3} className="h-80" />
      ) : isEmpty ? (
        <PageDataEmpty message="No tools available." />
      ) : (
        <section className="flex w-full flex-col gap-6">
          {categoryCards.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.05}>
              <motion.article
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="section-shell panel-glow group relative overflow-hidden transition duration-300 hover:shadow-hoverGlow"
                data-cursor="large"
                data-cursor-label="Open"
              >
                <Link
                  to={`/tools/category/${category.slug}`}
                  className="flex flex-col sm:flex-row h-full sm:h-80"
                  data-cursor="link"
                  data-cursor-label="Open"
                  aria-label={`Open ${category.title}`}
                >
                  <div className="overflow-hidden border-b border-white/8 sm:w-1/3 sm:border-b-0 sm:border-r">
                    <img
                      src={resolveMedia(category.featuredImage)}
                      alt={category.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-6 sm:w-2/3 flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Category</p>
                      <span className="theme-chip rounded-full px-3 py-1 text-xs">
                        {category.count} items
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {category.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted">{category.description}</p>
                  </div>
                </Link>
              </motion.article>
            </Reveal>
          ))}
        </section>
      )}

      {editingTool ? (
        <AdminEntityModal
          title={editingTool._id ? "Edit tool" : "Add tool"}
          entityType="tools"
          initialValue={editingTool}
          onClose={() => setEditingTool(null)}
          onSave={saveTool}
          onDelete={editingTool._id ? () => deleteTool(editingTool) : undefined}
        />
      ) : null}
    </motion.main>
  );
};

export default ToolsPage;

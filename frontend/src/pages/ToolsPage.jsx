import { motion } from "framer-motion";
import { useState } from "react";

import { toolTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { tools as toolFallback } from "../assets/mockData";
import AdminEntityModal from "../components/AdminEntityModal";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import ToolCard from "../components/ToolCard";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ToolsPage = () => {
  const [editingTool, setEditingTool] = useState(null);
  const { data: tools, error } = useCollection("/tools", toolFallback);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

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
        title="Studio tooling built for faster delivery."
        description="Reusable systems, production assets, and internal tools that improve build speed and quality."
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool, index) => (
          <Reveal key={tool.slug} delay={index * 0.05}>
            <ToolCard
              tool={tool}
              adminActions={
                isAdmin && tool._id
                  ? {
                      onEdit: () => setEditingTool(tool),
                      onDelete: () => deleteTool(tool),
                    }
                  : null
              }
            />
          </Reveal>
        ))}
      </div>

      {editingTool ? (
        <AdminEntityModal
          title={editingTool._id ? "Edit tool" : "Add tool"}
          entityType="tools"
          initialValue={editingTool}
          onClose={() => setEditingTool(null)}
          onSave={saveTool}
        />
      ) : null}
    </motion.main>
  );
};

export default ToolsPage;

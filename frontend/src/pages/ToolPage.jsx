import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import { useAdmin } from "../context/AdminContext.jsx";
import { useItem } from "../hooks/usePageData";

const ToolPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: tool, loading, error, notFound } = useItem(slug ? `/tools/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const [editingTool, setEditingTool] = useState(null);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveTool = async (payload) => {
    if (!editingTool?._id) {
      return;
    }

    await requestAdmin(`/tools/${editingTool._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteTool = async () => {
    if (!editingTool?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${editingTool.title}"?`);
    if (!confirmed) {
      return;
    }

    await requestAdmin(`/tools/${editingTool._id}`, {
      method: "DELETE",
    });
    signalRefresh();
    setEditingTool(null);
    navigate("/tools");
  };

  if (loading && !tool) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataLoader label="Loading tool..." />
      </main>
    );
  }

  if (error && !tool && !notFound) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Unable to load tool</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
          <Link to="/tools" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to tools
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !tool) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Tool not found</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This tool does not exist or is not published yet.
          </p>
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
      <section className="section-shell panel-glow overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={resolveMedia(tool.carouselImage || tool.cardImage || tool.image)}
          alt={tool.title}
          className="h-64 sm:h-80 lg:h-96 w-full object-cover"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">{tool.type || "Tool"}</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {tool.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              {tool.shortDescription || tool.description || "No summary available."}
            </p>
          </div>
          {isAdmin && tool._id ? (
            <button
              type="button"
              onClick={() => setEditingTool(tool)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Description</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {tool.description || "No description available."}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Use case</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {tool.useCase || "No use case provided."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(tool.tags || []).length ? (
            tool.tags.map((item) => (
              <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                {item}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted">No tags available.</p>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-mutedDeep">{error}</p> : null}
      </section>

      {editingTool ? (
        <AdminEntityModal
          title="Edit tool"
          entityType="tools"
          initialValue={editingTool}
          onClose={() => setEditingTool(null)}
          onSave={saveTool}
          onDelete={deleteTool}
        />
      ) : null}
    </motion.main>
  );
};

export default ToolPage;

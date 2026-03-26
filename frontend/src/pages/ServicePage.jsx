import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import { useAdmin } from "../context/AdminContext.jsx";
import { useItem } from "../hooks/usePageData";

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: service, loading, error, notFound } = useItem(slug ? `/services/${slug}` : "", {
    enabled: Boolean(slug),
  });
  const [editingService, setEditingService] = useState(null);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveService = async (payload) => {
    if (!editingService?._id) {
      return;
    }

    await requestAdmin(`/services/${editingService._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    signalRefresh();
  };

  const deleteService = async () => {
    if (!editingService?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${editingService.title}"?`);
    if (!confirmed) {
      return;
    }

    await requestAdmin(`/services/${editingService._id}`, {
      method: "DELETE",
    });
    signalRefresh();
    setEditingService(null);
    navigate("/services");
  };

  if (loading && !service) {
    return (
      <main className="space-y-8 pb-24">
        <PageDataLoader label="Loading service..." />
      </main>
    );
  }

  if (error && !service && !notFound) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Unable to load service</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
          <Link to="/services" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to services
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !service) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-white">Service not found</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This service does not exist or is not published yet.
          </p>
          <Link to="/services" className="theme-link mt-6 inline-flex text-sm" data-cursor="link">
            Return to services
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
          src={resolveMedia(service.carouselImage || service.cardImage)}
          alt={service.title}
          className="h-64 sm:h-80 lg:h-96 w-full object-cover"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">
              {service.category || "Service"}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {service.title}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
              {service.shortDescription || service.summary || "No summary available."}
            </p>
          </div>
          {isAdmin && service._id ? (
            <button
              type="button"
              onClick={() => setEditingService(service)}
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
              {service.description || "No description available."}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Delivery format</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {service.deliveryFormat || "No delivery format provided."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(service.highlights || []).length ? (
            service.highlights.map((item) => (
              <span key={item} className="theme-chip rounded-full px-3 py-1 text-xs">
                {item}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted">No highlights available.</p>
          )}
        </div>

        {error ? <p className="mt-4 text-sm text-mutedDeep">{error}</p> : null}
      </section>

      {editingService ? (
        <AdminEntityModal
          title="Edit service"
          entityType="services"
          initialValue={editingService}
          onClose={() => setEditingService(null)}
          onSave={saveService}
          onDelete={deleteService}
        />
      ) : null}
    </motion.main>
  );
};

export default ServicePage;

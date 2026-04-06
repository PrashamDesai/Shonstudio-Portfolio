import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { pageTransition } from "../animations/variants";
import { resolveMedia } from "../assets/mediaMap";
import { PageDataLoader } from "../components/ApiState";
import AdminEntityModal from "../components/AdminEntityModal";
import ServicePremiumTextSection from "../components/ServicePremiumTextSection";
import TwoPointFiveDServiceSection from "../components/TwoPointFiveDServiceSection";
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
        <div className="section-shell mx-auto max-w-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Unable to load service</h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{error}</p>
          <Link to="/services" className="theme-link mt-7 inline-flex text-base" data-cursor="link">
            Return to services
          </Link>
        </div>
      </main>
    );
  }

  if (notFound || !service) {
    return (
      <main className="py-24">
        <div className="section-shell mx-auto max-w-3xl p-6 text-center sm:p-10">
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Service not found</h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            This service does not exist or is not published yet.
          </p>
          <Link to="/services" className="theme-link mt-7 inline-flex text-base" data-cursor="link">
            Return to services
          </Link>
        </div>
      </main>
    );
  }

  const serviceSignature = `${String(service?.title || "")} ${String(service?.slug || "")}`.toLowerCase();
  const isTwoPointFiveDService =
    serviceSignature.includes("2.5d") ||
    serviceSignature.includes("2-5d") ||
    serviceSignature.includes("2 5d") ||
    serviceSignature.includes("2.5 d");

  return (
    <motion.main
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-8 pb-24 sm:space-y-10"
    >
      <section className="section-shell panel-glow overflow-hidden rounded-[2rem] border border-white/10">
        <img
          src={resolveMedia(service.carouselImage || service.cardImage)}
          alt={service.title}
          className="h-52 w-full object-cover sm:h-80 lg:h-[30rem]"
        />
      </section>

      <section className="section-shell panel-glow rounded-[2rem] border border-white/10 p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-base">
              {service.category || "Service"}
            </p>
            <h1 className="font-display text-[clamp(2.45rem,9.5vw,5.1rem)] font-semibold tracking-tight text-white lg:text-7xl">
              {service.title}
            </h1>
            <p className="max-w-4xl text-lg leading-8 text-muted sm:text-2xl sm:leading-10">
              {service.shortDescription || service.summary || "No summary available."}
            </p>
          </div>
          {isAdmin && service._id ? (
            <button
              type="button"
              onClick={() => setEditingService(service)}
              className="theme-button-primary w-full rounded-full px-6 py-3.5 text-base font-semibold sm:w-auto"
            >
              Edit full details
            </button>
          ) : null}
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Description</p>
            <p className="mt-4 text-lg leading-9 text-muted sm:text-xl sm:leading-10">
              {service.description || "No description available."}
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-accentSoft">Delivery format</p>
            <p className="mt-4 text-lg leading-9 text-muted sm:text-xl sm:leading-10">
              {service.deliveryFormat || "No delivery format provided."}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {(service.highlights || []).length ? (
            service.highlights.map((item) => (
              <span key={item} className="theme-chip rounded-full px-4 py-2 text-xs sm:text-sm">
                {item}
              </span>
            ))
          ) : (
            <p className="text-base text-muted sm:text-lg">No highlights available.</p>
          )}
        </div>

        {isTwoPointFiveDService ? <TwoPointFiveDServiceSection /> : <ServicePremiumTextSection service={service} />}

        {error ? <p className="mt-5 text-base text-mutedDeep sm:text-lg">{error}</p> : null}
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

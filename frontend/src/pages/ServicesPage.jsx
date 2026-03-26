import { motion } from "framer-motion";
import { useState } from "react";

import { serviceTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import { services as serviceFallback } from "../assets/mockData";
import AdminEntityModal from "../components/AdminEntityModal";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import ServiceCard from "../components/ServiceCard";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ServicesPage = () => {
  const [editingService, setEditingService] = useState(null);
  const { data: services, error } = useCollection("/services", serviceFallback);
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const saveService = async (payload) => {
    if (editingService?._id) {
      await requestAdmin(`/services/${editingService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    signalRefresh();
  };

  const deleteService = async (service) => {
    if (!service?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${service.title}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/services/${service._id}`, {
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
        eyebrow="Services"
        title="Services designed for product momentum."
        description="Clear service lanes across game development, immersive systems, and launch-ready design."
        actions={
          isAdmin ? (
            <button
              type="button"
              onClick={() => setEditingService(serviceTemplate)}
              className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
            >
              Add service
            </button>
          ) : null
        }
      />

      {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.04}>
            <ServiceCard
              service={service}
              adminActions={
                isAdmin && service._id
                  ? {
                      onEdit: () => setEditingService(service),
                      onDelete: () => deleteService(service),
                    }
                  : null
              }
            />
          </Reveal>
        ))}
      </div>

      {editingService ? (
        <AdminEntityModal
          title={editingService._id ? "Edit service" : "Add service"}
          entityType="services"
          initialValue={editingService}
          onClose={() => setEditingService(null)}
          onSave={saveService}
        />
      ) : null}
    </motion.main>
  );
};

export default ServicesPage;

import { motion } from "framer-motion";
import { useState } from "react";

import { serviceTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import AdminEntityModal from "../components/AdminEntityModal";
import AdminQuickEditModal from "../components/AdminQuickEditModal";
import { CardListSkeleton, PageDataEmpty } from "../components/ApiState";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import ServiceCard from "../components/ServiceCard";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const ServicesPage = () => {
  const [editingService, setEditingService] = useState(null);
  const [quickEditingService, setQuickEditingService] = useState(null);
  const { data: services, loading, error, isEmpty } = useCollection("/services");
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

  const saveQuickService = async (payload) => {
    if (!quickEditingService?._id) {
      return;
    }

    await requestAdmin(`/services/${quickEditingService._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
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

      {loading && !services.length ? (
        <CardListSkeleton count={6} className="h-72" />
      ) : isEmpty ? (
        <PageDataEmpty message="No services available." />
      ) : (
        <div className="flex w-full flex-col gap-6">
          {services.map((service, index) => (
            <Reveal key={service.slug || service._id || index} delay={index * 0.04}>
              <ServiceCard
                service={service}
                adminActions={
                  isAdmin && service._id
                    ? {
                        onEdit: () => setQuickEditingService(service),
                        onDelete: () => deleteService(service),
                      }
                    : null
                }
              />
            </Reveal>
          ))}
        </div>
      )}

      {editingService ? (
        <AdminEntityModal
          title={editingService._id ? "Edit service" : "Add service"}
          entityType="services"
          initialValue={editingService}
          onClose={() => setEditingService(null)}
          onSave={saveService}
          onDelete={editingService._id ? () => deleteService(editingService) : undefined}
        />
      ) : null}

      {quickEditingService ? (
        <AdminQuickEditModal
          title="Quick edit service card"
          entityType="services"
          initialValue={quickEditingService}
          onClose={() => setQuickEditingService(null)}
          onSave={saveQuickService}
          onDelete={async () => {
            await deleteService(quickEditingService);
            setQuickEditingService(null);
          }}
        />
      ) : null}
    </motion.main>
  );
};

export default ServicesPage;

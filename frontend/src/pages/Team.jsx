import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { teamTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import AdminTeamModal from "../components/AdminTeamModal";
import { CardGridSkeleton, PageDataEmpty } from "../components/ApiState";
import TeamModal from "../components/TeamModal";
import TeamSection from "../components/TeamSection";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "developer", label: "Developing" },
  { value: "designer", label: "Designing" },
];

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: teamMembers, loading, error, isEmpty } = useCollection("/team");
  const { isAdmin, requestAdmin, signalRefresh } = useAdmin();

  const groupedMembers = useMemo(
    () => ({
      developer: teamMembers.filter((member) => member.category === "developer"),
      designer: teamMembers.filter((member) => member.category === "designer"),
    }),
    [teamMembers],
  );

  const saveTeamMember = async (payload) => {
    if (editingMember?._id) {
      await requestAdmin(`/team/${editingMember._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await requestAdmin("/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    signalRefresh();
  };

  const deleteTeamMember = async (member) => {
    if (!member?._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${member.name}"?`);

    if (!confirmed) {
      return;
    }

    await requestAdmin(`/team/${member._id}`, {
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
      className="space-y-8 pb-24"
    >
      <section className="relative overflow-hidden rounded-[2.35rem] border border-white/8 bg-surface/75 px-6 py-10 shadow-soft sm:px-8 lg:px-10 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,212,255,0.16),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(122,92,255,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(0,255,198,0.08),transparent_22%)] opacity-90" />
        <div className="hero-grid absolute inset-0 opacity-10" />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5">
              <p className="eyebrow">Team</p>
              <h1 className="max-w-5xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Cross-functional specialists behind every release.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
                Explore the team by discipline, then open profile modals for skills, stack, and
                project contributions.
              </p>
              {error ? <p className="text-sm text-mutedDeep">{error}</p> : null}
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => setEditingMember(teamTemplate)}
                className="theme-button-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Add team member
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                  activeFilter === option.value
                    ? "border-accent/28 bg-theme-gradient text-white shadow-glow"
                    : "border-white/10 bg-white/[0.04] text-muted hover:border-accent/20 hover:text-textPrimary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading && !teamMembers.length ? (
        <CardGridSkeleton count={6} className="h-72" />
      ) : isEmpty ? (
        <PageDataEmpty message="No team members available." />
      ) : (
        <>
          {(activeFilter === "all" || activeFilter === "developer") ? (
            <TeamSection
              eyebrow="Developing"
              title="Developing team"
              description="Engineers focused on gameplay systems, architecture, and immersive interaction."
              members={groupedMembers.developer}
              onOpenMember={setSelectedMember}
              isAdmin={isAdmin}
              onEditMember={setEditingMember}
              onDeleteMember={deleteTeamMember}
            />
          ) : null}

          {(activeFilter === "all" || activeFilter === "designer") ? (
            <TeamSection
              eyebrow="Designing"
              title="Designing team"
              description="Designers shaping product experience, interface quality, and visual direction."
              members={groupedMembers.designer}
              onOpenMember={setSelectedMember}
              isAdmin={isAdmin}
              onEditMember={setEditingMember}
              onDeleteMember={deleteTeamMember}
            />
          ) : null}
        </>
      )}

      <TeamModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        isAdmin={isAdmin}
      />

      {editingMember ? (
        <AdminTeamModal
          title={editingMember._id ? "Edit team member" : "Add team member"}
          initialValue={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={saveTeamMember}
        />
      ) : null}
    </motion.main>
  );
};

export default TeamPage;

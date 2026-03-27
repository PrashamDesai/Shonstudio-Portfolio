import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { teamTemplate } from "../admin/entityTemplates";
import { pageTransition } from "../animations/variants";
import AdminTeamModal from "../components/AdminTeamModal";
import { PageDataEmpty } from "../components/ApiState";
import TeamModal from "../components/TeamModal";
import TeamSection from "../components/TeamSection";
import { useAdmin } from "../context/AdminContext.jsx";
import { useCollection } from "../hooks/usePageData";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "developer", label: "Developing" },
  { value: "designer", label: "Designing" },
];

const TeamCardsSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`team-skeleton-${index}`}
        className="section-shell panel-glow relative flex min-h-[31rem] animate-pulse flex-col overflow-hidden"
      >
        <div className="relative h-36 overflow-hidden border-b border-white/8 bg-white/[0.04]">
          <div className="absolute left-4 top-4 h-5 w-24 rounded-full bg-white/10" />
          <div className="absolute -left-7 top-7 h-16 w-16 rounded-full border border-white/10" />
          <div className="absolute right-6 top-5 h-8 w-8 rounded-full border border-white/10" />
          <div className="absolute right-16 bottom-5 h-14 w-14 rounded-full border border-white/10" />
        </div>

        <div className="absolute left-1/2 top-36 -translate-x-1/2 -translate-y-1/2">
          <div className="h-24 w-24 rounded-full border-2 border-white/20 bg-white/10 ring-4 ring-base/80" />
        </div>

        <div className="flex flex-1 flex-col space-y-5 p-6 pt-16">
          <div className="flex flex-col items-center">
            <div className="h-7 w-44 rounded-lg bg-white/10" />
            <div className="mt-3 h-4 w-32 rounded-lg bg-white/10" />
            <div className="mt-5 w-full space-y-3">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-11/12 rounded bg-white/10" />
              <div className="h-3 w-5/6 rounded bg-white/10" />
              <div className="h-3 w-4/6 rounded bg-white/10" />
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((__, chipIndex) => (
              <div
                key={`team-skeleton-chip-${index}-${chipIndex}`}
                className="h-6 w-20 rounded-full bg-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

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
        <TeamCardsSkeleton count={activeFilter === "all" ? 6 : 3} />
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

import Reveal from "./Reveal";
import TeamCard from "./TeamCard";

const TeamSection = ({
  eyebrow,
  title,
  description,
  members = [],
  onOpenMember,
  isAdmin = false,
  onEditMember,
  onDeleteMember,
}) => {
  if (!members.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-mutedDeep">
            {members.length} members
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member, index) => (
          <Reveal key={member._id || member.name} delay={index * 0.05}>
            <TeamCard
              member={member}
              onOpen={onOpenMember}
              adminActions={
                isAdmin
                  ? {
                      onEdit: () => onEditMember(member),
                      onDelete: () => onDeleteMember(member),
                    }
                  : null
              }
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;

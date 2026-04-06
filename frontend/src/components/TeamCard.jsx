import { motion } from "framer-motion";

import { resolveMedia } from "../assets/mediaMap";
import { getTeamCategoryLabel } from "../utils/teamResume";
import AdminEntityActions from "./AdminEntityActions";

const getInitials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "TM";

const TeamCard = ({ member, onOpen, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative flex h-full min-h-[28rem] cursor-pointer flex-col overflow-hidden sm:min-h-[31rem]"
    onClick={() => onOpen(member)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen(member);
      }
    }}
    tabIndex={0}
    role="button"
    aria-label={`Open profile for ${member.name}`}
    data-cursor="large"
    data-cursor-label="Profile"
  >
    {adminActions ? (
      <AdminEntityActions onEdit={adminActions.onEdit} onDelete={adminActions.onDelete} />
    ) : null}

    <div className="relative">
      <div className="relative h-32 overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_16%_20%,rgba(0,212,255,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(122,92,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] sm:h-36">
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-base/72 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-accentSoft backdrop-blur-xl">
          {getTeamCategoryLabel(member.category)}
        </div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-7 top-7 h-16 w-16 rounded-full border border-white/10" />
          <div className="absolute right-6 top-5 h-8 w-8 rounded-full border border-white/10" />
          <div className="absolute right-16 bottom-5 h-14 w-14 rounded-full border border-white/10" />
        </div>
      </div>

      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-white/20 bg-surface shadow-[0_12px_30px_rgba(0,0,0,0.35)] ring-4 ring-base/80 sm:h-24 sm:w-24">
          {member.profileImage ? (
            <motion.img
              src={resolveMedia(member.profileImage)}
              alt={member.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <span className="font-display text-xl font-semibold tracking-[0.08em] text-white/90">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-1 flex-col space-y-4 p-5 pt-14 sm:space-y-5 sm:p-6 sm:pt-16">
      <div>
        <h3 className="text-center font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {member.name}
        </h3>
        <p className="mt-2 text-center text-sm uppercase tracking-[0.22em] text-mutedDeep">{member.role}</p>
        <p className="mt-3 min-h-[6.2rem] overflow-hidden text-sm leading-7 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] sm:mt-4 sm:min-h-[7rem]">
          {member.bio}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {(member.coreTech || []).slice(0, 4).map((tech) => (
          <span key={tech} className="theme-chip rounded-full px-3 py-1 text-xs">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </motion.article>
);

export default TeamCard;

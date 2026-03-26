import { motion } from "framer-motion";

import { resolveMedia } from "../assets/mediaMap";
import AdminEntityActions from "./AdminEntityActions";

const categoryLabelMap = {
  developer: "Developing",
  designer: "Designing",
};

const TeamCard = ({ member, onOpen, adminActions = null }) => (
  <motion.article
    whileHover={{ y: -8, scale: 1.01 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="section-shell panel-glow group relative cursor-pointer overflow-hidden"
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

    <div className="relative h-56 overflow-hidden border-b border-white/8">
      <motion.img
        src={resolveMedia(member.profileImage)}
        alt={member.name}
        className="h-full w-full object-cover"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/18 to-transparent" />
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-base/72 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-accentSoft backdrop-blur-xl">
        {categoryLabelMap[member.category] || member.category}
      </div>
    </div>

    <div className="space-y-5 p-6">
      <div>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
          {member.name}
        </h3>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-mutedDeep">{member.role}</p>
        <p className="mt-4 text-sm leading-7 text-muted">{member.bio}</p>
      </div>

      <div className="flex flex-wrap gap-2">
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

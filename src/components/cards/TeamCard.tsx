import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FolderKanban, ArrowUpRight, Building2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Team } from '@/types';

interface TeamCardProps {
  team: Team;
  index?: number;
}

export function TeamCard({ team, index = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="card-hover group relative overflow-hidden rounded-2xl surface p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-accent/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <Link to={`/teams/${team.id}`} className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/60 text-brand-accent dark:bg-mint-600/15">
              <Users size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[var(--text-primary)] group-hover:text-brand-accent">
                {team.name}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-[var(--text-secondary)]">
                <Building2 size={11} /> {team.departmentName}
              </p>
            </div>
          </div>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-[var(--text-secondary)]">{team.description}</p>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-[var(--bg-subtle)] p-3">
          <Avatar name={team.leadName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">{team.leadName}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Team Lead</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border-default)] pt-4">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-[var(--text-muted)]" />
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{team.memberCount}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FolderKanban size={15} className="text-[var(--text-muted)]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--text-primary)]">{team.projectName}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Project</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

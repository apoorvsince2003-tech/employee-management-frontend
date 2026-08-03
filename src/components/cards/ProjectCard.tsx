import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FolderKanban, ArrowUpRight, User } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn, formatCompactCurrency, formatDate } from '@/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const budgetUsed = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="card-hover group relative overflow-hidden rounded-2xl surface p-5"
    >
      <Link to={`/projects/${project.id}`} className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/60 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300">
              <FolderKanban size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[var(--text-primary)] group-hover:text-brand-accent">
                {project.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{project.code}</p>
            </div>
          </div>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-[var(--text-secondary)]">{project.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <StatusBadge status={project.status} />
          <StatusBadge status={project.priority} dot={false} />
        </div>

        {/* progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Progress</span>
            <span className="font-semibold text-[var(--text-primary)]">{project.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
              className={cn('h-full rounded-full', progressColor(project.progress))}
            />
          </div>
        </div>

        {/* budget */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Budget</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {formatCompactCurrency(project.spent)} / {formatCompactCurrency(project.budget)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
            <div
              className={cn('h-full rounded-full', budgetUsed > 90 ? 'bg-error-500' : 'bg-mint-400')}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--border-default)] pt-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <User size={12} /> {project.leadName}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> {formatDate(project.startDate)} → {formatDate(project.endDate)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function progressColor(p: number): string {
  if (p >= 75) return 'bg-success-500';
  if (p >= 40) return 'bg-brand-accent';
  if (p >= 15) return 'bg-warning-500';
  return 'bg-[var(--text-muted)]';
}

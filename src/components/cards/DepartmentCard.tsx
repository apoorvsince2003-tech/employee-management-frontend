import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, FolderKanban, ArrowUpRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Department } from '@/types';
import { formatCompactCurrency, formatDate } from '@/utils';

interface DepartmentCardProps {
  department: Department;
  activeProjects?: number;
  index?: number;
}

export function DepartmentCard({ department, activeProjects = 0, index = 0 }: DepartmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="card-hover group relative overflow-hidden rounded-2xl surface p-5"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
        style={{ backgroundColor: department.color }}
      />
      <Link to={`/departments/${department.id}`} className="relative">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: department.color }}
          >
            {department.code}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--text-primary)] group-hover:text-brand-accent">
              {department.name}
            </p>
            <p className="truncate text-xs text-[var(--text-secondary)]">{department.description}</p>
          </div>
          <ArrowUpRight
            size={18}
            className="ml-auto shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Avatar name={department.headName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[var(--text-primary)]">{department.headName}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Department Head</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--border-default)] pt-4">
          <Stat icon={<Users size={14} />} label="Members" value={String(department.employeeCount)} />
          <Stat icon={<FolderKanban size={14} />} label="Projects" value={String(activeProjects)} />
          <Stat icon={<Calendar size={14} />} label="Est." value={formatDate(department.establishedDate).split(',')[0]} />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Annual budget</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {formatCompactCurrency(department.budget)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-subtle)] px-2.5 py-2">
      <span className="flex items-center gap-1 text-[var(--text-muted)]">{icon}</span>
      <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-[10px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

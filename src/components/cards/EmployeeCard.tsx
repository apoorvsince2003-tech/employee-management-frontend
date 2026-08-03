import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Briefcase } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ActionMenu } from '@/components/shared/ActionMenu';
import type { ActionMenuItem } from '@/components/shared/ActionMenu';
import type { Employee } from '@/types';
import { cn } from '@/utils';

interface EmployeeCardProps {
  employee: Employee;
  index?: number;
  actions?: ActionMenuItem[];
}

export function EmployeeCard({ employee, index = 0, actions }: EmployeeCardProps) {
  const name = `${employee.firstName} ${employee.lastName}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="card-hover group relative flex flex-col rounded-2xl surface p-5"
    >
      <div className="flex items-start justify-between">
        <Link to={`/employees/${employee.id}`} className="flex items-center gap-3">
          <Avatar name={name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-accent">
              {name}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">{employee.employeeCode}</p>
          </div>
        </Link>
        {actions && <ActionMenu items={actions} />}
      </div>

      <Link to={`/employees/${employee.id}`} className="mt-4 flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{employee.designation}</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{employee.departmentName}</p>

        <div className="mt-3 space-y-1.5">
          <MetaRow icon={<Mail size={13} />} text={employee.email} />
          <MetaRow icon={<MapPin size={13} />} text={employee.location} />
          <MetaRow icon={<Briefcase size={13} />} text={employee.employmentType} />
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-default)] pt-3">
        <StatusBadge status={employee.status} />
        <Link
          to={`/employees/${employee.id}`}
          className="text-xs font-semibold text-brand-accent hover:underline"
        >
          View profile
        </Link>
      </div>
    </motion.div>
  );
}

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <p className={cn('flex items-center gap-2 truncate text-xs text-[var(--text-secondary)]')}>
      <span className="text-[var(--text-muted)]">{icon}</span>
      <span className="truncate">{text}</span>
    </p>
  );
}

import { Badge } from '@/components/ui/Badge';
import { EMPLOYEE_STATUS, PROJECT_STATUS, LEAVE_STATUS } from '@/constants';
import type { EmployeeStatus, ProjectStatus, LeaveStatus } from '@/constants';

type BadgeTone = 'neutral' | 'accent' | 'primary' | 'success' | 'warning' | 'error' | 'info';

const employeeStatusTone: Record<EmployeeStatus, BadgeTone> = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'neutral',
  Probation: 'info',
};

const projectStatusTone: Record<ProjectStatus, BadgeTone> = {
  Planning: 'info',
  'In Progress': 'accent',
  'On Hold': 'warning',
  Completed: 'success',
  Cancelled: 'error',
};

const leaveStatusTone: Record<LeaveStatus, BadgeTone> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  Cancelled: 'neutral',
};

const promotionStatusTone: Record<string, BadgeTone> = {
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
};

const salaryStatusTone: Record<string, BadgeTone> = {
  Paid: 'success',
  Pending: 'warning',
  Processing: 'info',
};

const revisionTypeTone: Record<string, BadgeTone> = {
  Increment: 'success',
  Decrement: 'error',
};

const priorityTone: Record<string, BadgeTone> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Critical: 'error',
};

interface StatusBadgeProps {
  status: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, dot = true, size = 'sm' }: StatusBadgeProps) {
  const tone = resolveTone(status);
  return (
    <Badge tone={tone} dot={dot} size={size}>
      {status}
    </Badge>
  );
}

function resolveTone(status: string): BadgeTone {
  if ((Object.values(EMPLOYEE_STATUS) as string[]).includes(status)) {
    return employeeStatusTone[status as EmployeeStatus] ?? 'neutral';
  }
  if ((Object.values(PROJECT_STATUS) as string[]).includes(status)) {
    return projectStatusTone[status as ProjectStatus] ?? 'neutral';
  }
  if ((Object.values(LEAVE_STATUS) as string[]).includes(status)) {
    return leaveStatusTone[status as LeaveStatus] ?? 'neutral';
  }
  if (status in promotionStatusTone) return promotionStatusTone[status];
  if (status in salaryStatusTone) return salaryStatusTone[status];
  if (status in revisionTypeTone) return revisionTypeTone[status];
  if (status in priorityTone) return priorityTone[status];
  return 'neutral';
}

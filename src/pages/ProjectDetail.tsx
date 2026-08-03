import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Calendar,
  DollarSign,
  User,
  Users,
  Building2,
  ArrowUpRight,
  Plus,
  Flag,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService, teamService, employeeService, departmentService } from '@/services';
import type { Project, Team, Employee, Department } from '@/types';
import { ProfileHeader, MetaItem } from '@/components/shared/ProfileHeader';
import { Timeline } from '@/components/shared/Timeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardHeader, Button, Avatar, Badge } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeCard } from '@/components/cards/EmployeeCard';
import { cn, formatCurrency, formatCompactCurrency, formatDate } from '@/utils';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [lead, setLead] = useState<Employee | null>(null);
  const [members, setMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return () => {};
    let active = true;
    setLoading(true);
    setError(null);
    projectService
      .getById(id)
      .then(async (p) => {
        if (!active || !p) return;
        setProject(p);
        const teamData = await teamService.list();
        if (!active) return;
        const t = teamData.find((x) => x.id === p.teamId) ?? null;
        setTeam(t);
        if (t) {
          const [empList, dept] = await Promise.all([
            employeeService.byTeam(t.id),
            t.departmentId ? departmentService.getById(t.departmentId) : Promise.resolve(null),
          ]);
          if (!active) return;
          setMembers(empList);
          setDepartment(dept);
        }
        if (p.leadId) {
          employeeService.getById(p.leadId).then((l) => active && setLead(l)).catch(() => {});
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load project.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), [id]);

  if (loading) return <LoadingState label="Loading project…" />;
  if (error || !project) {
    return (
      <ErrorState
        title="Project not found"
        description={error ?? "This project doesn't exist or has been removed."}
        onRetry={load}
        action={<Link to="/projects"><Button variant="subtle" size="sm">Back to projects</Button></Link>}
      />
    );
  }

  const budgetUsed = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
  const milestones = buildMilestones(project);

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={project.name}
        subtitle={project.description}
        backLink="/projects"
        backLabel="Back to projects"
        badges={
          <>
            <StatusBadge status={project.status} />
            <StatusBadge status={project.priority} dot={false} />
            <Badge tone="neutral">{project.code}</Badge>
          </>
        }
        meta={
          <>
            <MetaItem icon={<Users size={14} />} label={project.teamName} />
            <MetaItem icon={<User size={14} />} label={project.leadName} />
            <MetaItem icon={<Calendar size={14} />} label={`${formatDate(project.startDate)} → ${formatDate(project.endDate)}`} />
          </>
        }
        avatar={false}
        actions={<Button size="sm" leftIcon={<Plus size={15} />} onClick={() => toast('Add task — coming soon')}>Add Task</Button>}
      >
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ProjectStat icon={<FolderKanban size={16} />} label="Progress" value={`${project.progress}%`} />
          <ProjectStat icon={<DollarSign size={16} />} label="Budget used" value={`${budgetUsed}%`} />
          <ProjectStat icon={<Users size={16} />} label="Team size" value={String(members.length)} />
          <ProjectStat icon={<Flag size={16} />} label="Priority" value={project.priority} />
        </div>
      </ProfileHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Progress & Budget" subtitle="Delivery and financial tracking" />
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Project completion</span>
                <span className="font-semibold text-[var(--text-primary)]">{project.progress}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', progressColor(project.progress))}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Budget utilization</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {formatCompactCurrency(project.spent)} / {formatCompactCurrency(project.budget)}
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={cn('h-full rounded-full', budgetUsed > 90 ? 'bg-error-500' : 'bg-mint-400')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-[var(--border-default)] pt-4">
              <BudgetRow label="Allocated budget" value={formatCurrency(project.budget)} />
              <BudgetRow label="Spent to date" value={formatCurrency(project.spent)} />
              <BudgetRow label="Remaining" value={formatCurrency(project.budget - project.spent)} />
              <BudgetRow label="Burn rate" value={`${budgetUsed}%`} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Details" />
          <div className="mt-4 space-y-3">
            <DetailRow icon={<Clock size={15} />} label="Status" value={<StatusBadge status={project.status} />} />
            <DetailRow icon={<Flag size={15} />} label="Priority" value={<StatusBadge status={project.priority} dot={false} />} />
            <DetailRow icon={<Calendar size={15} />} label="Start date" value={formatDate(project.startDate)} />
            <DetailRow icon={<Calendar size={15} />} label="End date" value={formatDate(project.endDate)} />
            <DetailRow icon={<Users size={15} />} label="Team" value={team?.name ?? '—'} link={team ? `/teams/${team.id}` : undefined} />
            <DetailRow icon={<Building2 size={15} />} label="Department" value={department?.name ?? '—'} link={department ? `/departments/${department.id}` : undefined} />
          </div>
        </Card>
      </div>

      {lead && (
        <Card>
          <CardHeader title="Project Manager" subtitle="Lead and ownership" />
          <Link to={`/employees/${lead.id}`} className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
            <Avatar name={`${lead.firstName} ${lead.lastName}`} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[var(--text-primary)]">{lead.firstName} {lead.lastName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{lead.designation}</p>
            </div>
            <ArrowUpRight size={18} className="text-[var(--text-muted)]" />
          </Link>
        </Card>
      )}

      <Card>
        <CardHeader title="Project Timeline" subtitle="Key milestones and phases" />
        <div className="mt-5">
          <Timeline items={milestones} />
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Team Members</h2>
          <Badge tone="neutral">{members.length}</Badge>
        </div>
        {members.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((emp, i) => (
              <EmployeeCard key={emp.id} employee={emp} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Users size={22} />} title="No members assigned" description="This project has no team members yet." />
        )}
      </div>
    </div>
  );
}

function buildMilestones(project: Project) {
  const items = [
    { id: 'm1', date: formatDate(project.startDate), title: 'Project kickoff', subtitle: 'Planning and scope alignment', icon: <Flag size={16} />, iconColor: '#0EA5E9', done: true },
  ];
  if (project.progress >= 25) items.push({ id: 'm2', date: 'Phase 1 complete', title: 'Foundation delivered', subtitle: 'Core infrastructure ready', icon: <FolderKanban size={16} />, iconColor: '#00BFA6', done: true });
  if (project.progress >= 50) items.push({ id: 'm3', date: 'Midpoint review', title: '50% milestone reached', subtitle: 'Halfway checkpoint passed', icon: <Clock size={16} />, iconColor: '#F79009', done: project.progress >= 50 });
  if (project.progress >= 75) items.push({ id: 'm4', date: 'Phase 2 complete', title: 'Feature-complete', subtitle: 'All features implemented', icon: <FolderKanban size={16} />, iconColor: '#00BFA6', done: project.progress >= 75 });
  items.push({ id: 'm5', date: formatDate(project.endDate), title: 'Project delivery', subtitle: 'Final delivery and handoff', icon: <Flag size={16} />, iconColor: project.status === 'Completed' ? '#12B76A' : '#6A9891', done: project.status === 'Completed' });
  return items.map(({ done, ...rest }) => ({
    ...rest,
    meta: done ? <Badge tone="success" dot>Completed</Badge> : <Badge tone="warning" dot>Pending</Badge>,
  }));
}

function ProjectStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-brand-accent">{icon}</span>
      <p className="mt-2 text-lg font-bold text-brand-secondary">{value}</p>
      <p className="text-xs text-mint-200/70">{label}</p>
    </div>
  );
}

function BudgetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-subtle)] p-3">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: React.ReactNode; link?: string }) {
  const content = (
    <div className="flex items-center justify-between rounded-xl px-1 py-1.5">
      <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="text-[var(--text-muted)]">{icon}</span>
        {label}
      </span>
      <span className={cn('text-sm font-medium text-[var(--text-primary)]', link && 'hover:text-brand-accent')}>{value}</span>
    </div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

function progressColor(p: number): string {
  if (p >= 75) return 'bg-success-500';
  if (p >= 40) return 'bg-brand-accent';
  if (p >= 15) return 'bg-warning-500';
  return 'bg-[var(--text-muted)]';
}

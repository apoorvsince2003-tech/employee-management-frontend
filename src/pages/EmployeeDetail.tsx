import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Users,
  FolderKanban,
  CalendarDays,
  TrendingUp,
  CalendarCheck,
  Contact,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Mail as MailIcon,
} from 'lucide-react';
import {
  employeeService,
  teamService,
  projectService,
  departmentService,
  leaveService,
  attendanceService,
  salaryService,
  promotionService,
} from '@/services';
import type {
  Employee,
  Department,
  Team,
  Project,
  LeaveRequest,
  AttendanceRecord,
  SalaryRecord,
  SalaryRevision,
  Promotion,
} from '@/types';
import { ProfileHeader, MetaItem } from '@/components/shared/ProfileHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Timeline } from '@/components/shared/Timeline';
import { Tabs } from '@/components/ui/Tabs';
import { Card, CardHeader, Button, Badge, Avatar } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, formatCurrency, formatDate, relativeTime } from '@/utils';

type TabId = 'overview' | 'personal' | 'work' | 'projects' | 'salary' | 'promotions' | 'attendance' | 'leaves';

const tabItems = [
  { id: 'overview' as TabId, label: 'Overview', icon: <User size={15} /> },
  { id: 'personal' as TabId, label: 'Personal', icon: <Contact size={15} /> },
  { id: 'work' as TabId, label: 'Work', icon: <Briefcase size={15} /> },
  { id: 'projects' as TabId, label: 'Projects', icon: <FolderKanban size={15} /> },
  { id: 'salary' as TabId, label: 'Salary', icon: <DollarSign size={15} /> },
  { id: 'promotions' as TabId, label: 'Promotions', icon: <TrendingUp size={15} /> },
  { id: 'attendance' as TabId, label: 'Attendance', icon: <CalendarCheck size={15} /> },
  { id: 'leaves' as TabId, label: 'Leave', icon: <CalendarDays size={15} /> },
];

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabId>('overview');

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [manager, setManager] = useState<Employee | null>(null);
  const [reports, setReports] = useState<Employee[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [employeeTeams, setEmployeeTeams] = useState<Team[]>([]);
  const [employeeProjects, setEmployeeProjects] = useState<Project[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>([]);
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return () => {};
    let active = true;
    setLoading(true);
    setError(null);

    employeeService
      .getById(id)
      .then(async (emp) => {
        if (!active || !emp) return;
        setEmployee(emp);
        const tenure = 0;
        void tenure;
        // Load related entities in parallel.
        const teamIds = emp.teamIds ?? [];
        const [allTeams, allProjects, dept, reportsList] = await Promise.all([
          teamService.list(),
          projectService.list(),
          emp.departmentId ? departmentService.getById(emp.departmentId) : Promise.resolve(null),
          employeeService.reports(emp.id),
        ]);
        if (!active) return;
        const teams = allTeams.filter((t) => teamIds.includes(t.id));
        setEmployeeTeams(teams);
        setEmployeeProjects(allProjects.filter((p) => teams.some((t) => t.id === p.teamId)));
        setDepartment(dept);
        setReports(reportsList);
        if (emp.managerId) {
          employeeService.getById(emp.managerId).then((m) => active && setManager(m)).catch(() => {});
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load employee.');
        setLoading(false);
      });

    // Independent per-employee collections.
    leaveService.byEmployee(id).then((r) => active && setLeaves(r)).catch(() => {});
    attendanceService.byEmployee(id)
  .then((r) => {
    if (active) setAttendance(r);
  })
  .catch(() => {});
    salaryService.historyByEmployee(id).then((r) => active && setSalaryHistory(r)).catch(() => {});
    salaryService.revisionsByEmployee(id).then((r) => active && setRevisions(r)).catch(() => {});
    promotionService.byEmployee(id).then((r) => active && setPromotions(r)).catch(() => {});

    return () => {
      active = false;
    };
  }

  useEffect(() => load(), [id]);

  if (loading) return <LoadingState label="Loading profile…" />;
  if (error || !employee) {
    return (
      <ErrorState
        title="Employee not found"
        description={error ?? "This employee profile doesn't exist or has been removed."}
        onRetry={load}
        action={<Link to="/employees"><Button variant="subtle" size="sm">Back to directory</Button></Link>}
      />
    );
  }

  const name = `${employee.firstName} ${employee.lastName}`;
  const tenure = Math.round((Date.now() - +new Date(employee.joinDate)) / (365.25 * 86400000) * 10) / 10;

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={name}
        subtitle={employee.designation}
        backLink="/employees"
        backLabel="Back to employees"
        badges={
          <>
            <StatusBadge status={employee.status} />
            <Badge tone="neutral">{employee.employmentType}</Badge>
            <Badge tone="primary">{employee.employeeCode}</Badge>
          </>
        }
        meta={
          <>
            <MetaItem icon={<Building2 size={14} />} label={employee.departmentName} />
            <MetaItem icon={<MapPin size={14} />} label={employee.location} />
            <MetaItem icon={<Calendar size={14} />} label={`Joined ${formatDate(employee.joinDate)}`} />
          </>
        }
        actions={
          <>
            <a href={`mailto:${employee.email}`}>
              <Button variant="outline" size="sm" leftIcon={<MailIcon size={15} />}>Message</Button>
            </a>
            <Button size="sm" leftIcon={<Pencil size={15} />}>Edit</Button>
          </>
        }
      />

      <Tabs items={tabItems} value={tab} onChange={(v) => setTab(v as TabId)} />

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === 'overview' && (
          <OverviewTab employee={employee} department={department ?? undefined} manager={manager ?? undefined} reports={reports} tenure={tenure} leaves={leaves} promotions={promotions} revisions={revisions} teamCount={employeeTeams.length} />
        )}
        {tab === 'personal' && <PersonalTab employee={employee} />}
        {tab === 'work' && <WorkTab employee={employee} department={department ?? undefined} manager={manager ?? undefined} reports={reports} teams={employeeTeams} tenure={tenure} />}
        {tab === 'projects' && <ProjectsTab projects={employeeProjects} />}
        {tab === 'salary' && <SalaryTab history={salaryHistory} revisions={revisions} currentSalary={employee.salary} />}
        {tab === 'promotions' && <PromotionsTab promotions={promotions} />}
        {tab === 'attendance' && <AttendanceTab records={attendance} />}
        {tab === 'leaves' && <LeavesTab leaves={leaves} />}
      </motion.div>
    </div>
  );
}

function OverviewTab({ employee, department, manager, reports, tenure, leaves, promotions, revisions, teamCount }: {
  employee: Employee;
  department?: Department;
  manager?: Employee;
  reports: Employee[];
  tenure: number;
  leaves: LeaveRequest[];
  promotions: Promotion[];
  revisions: SalaryRevision[];
  teamCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="At a glance" subtitle="Key employee summary" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={<Calendar size={16} />} label="Tenure" value={`${tenure} yrs`} />
          <MiniStat icon={<DollarSign size={16} />} label="Salary" value={formatCurrency(employee.salary)} />
          <MiniStat icon={<Users size={16} />} label="Direct reports" value={String(reports.length)} />
          <MiniStat icon={<FolderKanban size={16} />} label="Projects" value={String(teamCount)} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<Mail size={15} />} label="Email" value={employee.email} />
          <InfoRow icon={<Phone size={15} />} label="Phone" value={employee.phone} />
          <InfoRow icon={<Building2 size={15} />} label="Department" value={department?.name ?? employee.departmentName} link={department ? `/departments/${department.id}` : undefined} />
          <InfoRow icon={<User size={15} />} label="Reports to" value={manager ? `${manager.firstName} ${manager.lastName}` : '—'} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Quick stats" />
        <div className="mt-4 space-y-3">
          <StatLine label="Leave requests" value={leaves.length} tone="info" />
          <StatLine label="Promotions" value={promotions.length} tone="success" />
          <StatLine label="Salary revisions" value={revisions.length} tone="accent" />
          <StatLine label="Employment type" value={employee.employmentType} />
          <StatLine label="Status" value={employee.status} />
        </div>
      </Card>

      {reports.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader title="Direct reports" subtitle={`${reports.length} team members report to ${employee.firstName}`} />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((r) => (
              <Link key={r.id} to={`/employees/${r.id}`} className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] p-3 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
                <Avatar name={`${r.firstName} ${r.lastName}`} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{r.firstName} {r.lastName}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{r.designation}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function PersonalTab({ employee }: { employee: Employee }) {
  return (
    <Card>
      <CardHeader title="Personal information" subtitle="Contact and identity details" />
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoRow icon={<User size={16} />} label="Full name" value={`${employee.firstName} ${employee.lastName}`} />
        <InfoRow icon={<Contact size={16} />} label="Employee code" value={employee.employeeCode} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={employee.email} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={employee.phone} />
        <InfoRow icon={<MapPin size={16} />} label="Location" value={employee.location} />
        <InfoRow icon={<Calendar size={16} />} label="Join date" value={formatDate(employee.joinDate, 'long')} />
      </div>
    </Card>
  );
}

function WorkTab({ employee, department, manager, reports, teams, tenure }: {
  employee: Employee;
  department?: Department;
  manager?: Employee;
  reports: Employee[];
  teams: Team[];
  tenure: number;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Work information" subtitle="Role, team and reporting structure" />
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <InfoRow icon={<Briefcase size={16} />} label="Designation" value={employee.designation} />
          <InfoRow icon={<Building2 size={16} />} label="Department" value={department?.name ?? employee.departmentName} link={department ? `/departments/${department.id}` : undefined} />
          <InfoRow icon={<User size={16} />} label="Manager" value={manager ? `${manager.firstName} ${manager.lastName}` : 'No manager'} link={manager ? `/employees/${manager.id}` : undefined} />
          <InfoRow icon={<Users size={16} />} label="Direct reports" value={String(reports.length)} />
          <InfoRow icon={<Calendar size={16} />} label="Tenure" value={`${tenure} years`} />
          <InfoRow icon={<Briefcase size={16} />} label="Employment type" value={employee.employmentType} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Teams" subtitle={`${teams.length} team membership${teams.length === 1 ? '' : 's'}`} />
        <div className="mt-4 space-y-2">
          {teams.map((t) => (
            <Link key={t.id} to={`/teams/${t.id}`} className="flex items-center justify-between rounded-xl border border-[var(--border-default)] p-3 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.departmentName} · {t.memberCount} members</p>
              </div>
              <ArrowUpRight size={16} className="text-[var(--text-muted)]" />
            </Link>
          ))}
          {teams.length === 0 && <p className="py-4 text-center text-sm text-[var(--text-muted)]">Not assigned to any team.</p>}
        </div>
      </Card>
    </div>
  );
}

function ProjectsTab({ projects }: { projects: Project[] }) {
  return (
    <Card>
      <CardHeader title="Projects" subtitle={`${projects.length} active project${projects.length === 1 ? '' : 's'}`} />
      <div className="mt-4 space-y-2">
        {projects.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{p.name}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{p.code} · {p.teamName}</p>
              <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <div className="h-full rounded-full bg-brand-accent" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <StatusBadge status={p.status} />
              <span className="text-xs text-[var(--text-muted)]">{p.progress}%</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="py-6 text-center text-sm text-[var(--text-muted)]">No projects assigned.</p>}
      </div>
    </Card>
  );
}

function SalaryTab({ history, revisions, currentSalary }: { history: SalaryRecord[]; revisions: SalaryRevision[]; currentSalary: number }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><MiniStat icon={<DollarSign size={16} />} label="Current salary" value={formatCurrency(currentSalary)} /></Card>
        <Card><MiniStat icon={<TrendingUp size={16} />} label="Revisions" value={String(revisions.length)} /></Card>
        <Card><MiniStat icon={<Calendar size={16} />} label="Pay records" value={String(history.length)} /></Card>
      </div>

      <Card>
        <CardHeader title="Salary revision timeline" subtitle="Increment and decrement history" />
        <div className="mt-5">
          {revisions.length > 0 ? (
            <Timeline
              items={revisions.map((r) => ({
                id: r.id,
                title: `${r.type} — ${r.changePercent > 0 ? '+' : ''}${r.changePercent}%`,
                subtitle: `${formatCurrency(r.previousSalary)} → ${formatCurrency(r.newSalary)}`,
                description: r.reason,
                date: formatDate(r.effectiveDate),
                icon: r.type === 'Increment' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />,
                iconColor: r.type === 'Increment' ? '#12B76A' : '#F04438',
                meta: <Badge tone={r.type === 'Increment' ? 'success' : 'error'}>{formatCurrency(r.changeAmount)}</Badge>,
              }))}
            />
          ) : (
            <EmptyState title="No salary revisions" description="This employee has no recorded salary changes." />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Pay history" subtitle="Monthly payroll records" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                <th className="pb-2 pr-4">Period</th>
                <th className="pb-2 pr-4">Base</th>
                <th className="pb-2 pr-4">Bonus</th>
                <th className="pb-2 pr-4">Net</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{h.payPeriod}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatCurrency(h.baseSalary)}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatCurrency(h.bonus)}</td>
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{formatCurrency(h.netSalary)}</td>
                  <td className="py-3"><StatusBadge status={h.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PromotionsTab({ promotions }: { promotions: Promotion[] }) {
  return (
    <Card>
      <CardHeader title="Promotion history" subtitle="Career progression timeline" />
      <div className="mt-5">
        {promotions.length > 0 ? (
          <Timeline
            items={[...promotions].sort((a, b) => +new Date(b.effectiveDate) - +new Date(a.effectiveDate)).map((p) => ({
              id: p.id,
              title: `${p.fromDesignation} → ${p.toDesignation}`,
              subtitle: p.departmentName,
              description: p.reason,
              date: formatDate(p.effectiveDate),
              icon: <TrendingUp size={16} />,
              iconColor: '#00BFA6',
              meta: (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="success">+{formatCurrency(p.salaryIncrease)}</Badge>
                  <StatusBadge status={p.status} />
                </div>
              ),
            }))}
          />
        ) : (
          <EmptyState title="No promotions yet" description="This employee has no recorded promotions." />
        )}
      </div>
    </Card>
  );
}

function AttendanceTab({ records }: { records: AttendanceRecord[] }) {
  const present = records.filter((r) => r.status === 'Present' || r.status === 'Remote').length;
  const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><MiniStat icon={<CalendarCheck size={16} />} label="Attendance rate" value={`${rate}%`} /></Card>
        <Card><MiniStat icon={<Clock size={16} />} label="Avg hours" value={records.length ? `${(records.reduce((s, r) => s + r.workHours, 0) / records.length).toFixed(1)}h` : '—'} /></Card>
        <Card><MiniStat icon={<CalendarDays size={16} />} label="Records" value={String(records.length)} /></Card>
      </div>
      <Card>
        <CardHeader title="Recent attendance" subtitle="Last 7 working days" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Check in</th>
                <th className="pb-2 pr-4">Check out</th>
                <th className="pb-2 pr-4">Hours</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice().reverse().map((r) => (
                <tr key={r.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="py-3 pr-4 text-[var(--text-primary)]">{formatDate(r.date)}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{r.checkIn}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{r.checkOut}</td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)]">{r.workHours}h</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function LeavesTab({ leaves }: { leaves: LeaveRequest[] }) {
  const used = leaves.filter((l) => l.status === 'Approved').reduce((s, l) => s + l.days, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><MiniStat icon={<CalendarDays size={16} />} label="Days used" value={String(used)} /></Card>
        <Card><MiniStat icon={<Clock size={16} />} label="Pending" value={String(leaves.filter((l) => l.status === 'Pending').length)} /></Card>
        <Card><MiniStat icon={<CalendarCheck size={16} />} label="Total requests" value={String(leaves.length)} /></Card>
      </div>
      <Card>
        <CardHeader title="Leave history" />
        <div className="mt-4 space-y-2">
          {leaves.map((l) => (
            <div key={l.id} className="flex flex-col gap-2 rounded-xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="primary">{l.type}</Badge>
                  <StatusBadge status={l.status} />
                </div>
                <p className="mt-2 text-sm text-[var(--text-primary)]">{formatDate(l.startDate)} → {formatDate(l.endDate)}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{l.days} day{l.days === 1 ? '' : 's'} · {l.reason}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{relativeTime(l.appliedDate)}</span>
            </div>
          ))}
          {leaves.length === 0 && <p className="py-6 text-center text-sm text-[var(--text-muted)]">No leave history.</p>}
        </div>
      </Card>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-subtle)] p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-secondary/60 text-brand-accent dark:bg-mint-600/15">{icon}</span>
      <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: string; link?: string }) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl px-1 py-1.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className={cn('truncate text-sm font-medium text-[var(--text-primary)]', link && 'hover:text-brand-accent')}>{value}</p>
      </div>
    </div>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

function StatLine({ label, value, tone }: { label: string; value: string | number; tone?: 'info' | 'success' | 'accent' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <Badge tone={tone ?? 'neutral'}>{value}</Badge>
    </div>
  );
}

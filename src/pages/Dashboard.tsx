import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Building,
  Users,
  UserCheck,
  CalendarDays,
  UserPlus,
  FolderKanban,
  Clock,
  DollarSign,
  TrendingUp,
  Bell,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card, CardHeader, Badge } from '@/components/ui';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { UpcomingHolidays } from '@/components/dashboard/UpcomingHolidays';
import {
  DepartmentDistributionChart,
  EmploymentTypeChart,
  SalaryAreaChart,
  PromotionLineChart,
  LeaveTrendChart,
  AttendanceRadialChart,
  ChartCard,
} from '@/components/charts/DashboardCharts';
import {
  employeeService,
  departmentService,
  projectService,
  salaryService,
  leaveService,
  promotionService,
  attendanceService,
  holidayService,
  activityService,
} from '@/services';
import type { EmployeeStats, EmploymentDist } from '@/services/employeeService';
import type { DepartmentDist } from '@/services/departmentService';
import type { PayrollTrendPoint, SalaryTotals } from '@/services/salaryService';
import type { PromotionTrendPoint } from '@/services/promotionService';
import type { LeaveTrendPoint } from '@/services/leaveService';
import { formatCompactCurrency, relativeTime, cn } from '@/utils';
import type { Holiday, Activity, Notification } from '@/types';

interface DashboardData {
  stats: EmployeeStats;
  activeProjects: number;
  pendingLeaves: number;
  onLeaveCount: number;
  departmentDist: DepartmentDist[];
  employmentDist: EmploymentDist[];
  payroll: PayrollTrendPoint[];
  promotions: PromotionTrendPoint[];
  leaveTrend: LeaveTrendPoint[];
  attendanceRate: number;
  salaryTotals: SalaryTotals;
  departmentCount: number;
  totalHead: number;
  holidays: Holiday[];
  activities: Activity[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([
      employeeService.stats().catch(() => ({ total: 0, active: 0, newJoiners: 0, onLeave: 0 })),
      employeeService.employmentDist().catch(() => []),
      projectService.activeCount().catch(() => 0),
      leaveService.pendingCount().catch(() => 0),
      leaveService.onLeaveCount().catch(() => 0),
      departmentService.distribution().catch(() => []),
      salaryService.trend().catch(() => []),
      promotionService.trend().catch(() => []),
      leaveService.trend().catch(() => []),
      attendanceService.trend().catch(() => []),
      salaryService.totals().catch(() => ({ monthlyPayroll: 0, headcount: 0, averageSalary: 0, bonusPool: 0 })),
      holidayService.upcoming(5).catch(() => []),
      activityService.recent(8).catch(() => []),
    ])
      .then(
        ([
          rawStats,
          rawEmploymentDist,
          activeProjects,
          pendingLeaves,
          onLeaveCount,
          rawDepartmentDist,
          rawPayroll,
          rawPromotions,
          rawLeaveTrend,
          rawAttendanceTrend,
          rawSalaryTotals,
          rawHolidays,
          rawActivities,
        ]) => {
          if (!active) return;

          const departmentDist = Array.isArray(rawDepartmentDist) ? rawDepartmentDist : [];
          const employmentDist = Array.isArray(rawEmploymentDist) ? rawEmploymentDist : [];
          const payroll = Array.isArray(rawPayroll) ? rawPayroll : [];
          const promotions = Array.isArray(rawPromotions) ? rawPromotions : [];
          const leaveTrend = Array.isArray(rawLeaveTrend) ? rawLeaveTrend : [];
          const attendanceTrend = Array.isArray(rawAttendanceTrend) ? rawAttendanceTrend : [];
          const holidays = Array.isArray(rawHolidays) ? rawHolidays : [];
          const activities = Array.isArray(rawActivities) ? rawActivities : [];

          const stats: EmployeeStats = {
            total: rawStats?.total ?? 0,
            active: rawStats?.active ?? 0,
            newJoiners: rawStats?.newJoiners ?? 0,
            onLeave: rawStats?.onLeave ?? 0,
          };

          const salaryTotals: SalaryTotals = {
            monthlyPayroll: rawSalaryTotals?.monthlyPayroll ?? 0,
            headcount: rawSalaryTotals?.headcount ?? 0,
            averageSalary: rawSalaryTotals?.averageSalary ?? 0,
            bonusPool: rawSalaryTotals?.bonusPool ?? 0,
          };

          const totalHead = departmentDist.reduce((s, d) => s + (d?.value || 0), 0);
          const attendanceRate =
            attendanceTrend.length > 0 && attendanceTrend[attendanceTrend.length - 1]?.rate
              ? attendanceTrend[attendanceTrend.length - 1].rate
              : 0;

          setData({
            stats,
            activeProjects: typeof activeProjects === 'number' ? activeProjects : 0,
            pendingLeaves: typeof pendingLeaves === 'number' ? pendingLeaves : 0,
            onLeaveCount: typeof onLeaveCount === 'number' ? onLeaveCount : 0,
            departmentDist,
            employmentDist,
            payroll,
            promotions,
            leaveTrend,
            attendanceRate,
            salaryTotals,
            departmentCount: departmentDist.length,
            totalHead,
            holidays,
            activities,
          });
          setLoading(false);
        },
      )
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard…" />;
  if (error || !data)
    return (
      <ErrorState
        title="Couldn't load the dashboard"
        description={error ?? 'Please try again in a moment.'}
        onRetry={load}
      />
    );

  const activePercent = data.stats.total > 0 ? Math.round((data.stats.active / data.stats.total) * 100) : 0;
  const presentCount = Math.max(0, data.stats.active - data.onLeaveCount);

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" subtitle="Frequently used shortcuts" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          <button
            onClick={() => navigate('/employees/new')}
            className="rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <Plus className="mx-auto text-blue-600 mb-2" size={28} />
            <p className="font-semibold">Add Employee</p>
          </button>
          <button
            onClick={() => navigate('/departments')}
            className="rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <Building className="mx-auto text-green-600 mb-2" size={28} />
            <p className="font-semibold">Departments</p>
          </button>
          <button
            onClick={() => navigate('/teams/new')}
            className="rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <Users className="mx-auto text-purple-600 mb-2" size={28} />
            <p className="font-semibold">Add Team</p>
          </button>
          <button
            onClick={() => navigate('/projects/new')}
            className="rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <FolderKanban className="mx-auto text-orange-600 mb-2" size={28} />
            <p className="font-semibold">New Project</p>
          </button>
          <button
            onClick={() => navigate('/notices/new')}
            className="rounded-xl border p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <Bell className="mx-auto text-red-600 mb-2" size={28} />
            <p className="font-semibold">New Notice</p>
          </button>
        </div>
      </Card>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          index={0}
          icon={<Users size={20} />}
          label="Total Employees"
          value={data.stats.total}
          supportingText="Across all departments"
          trend={{ value: '4.2%', direction: 'up' }}
          accentColor="#00BFA6"
          to="/employees"
        />
        <StatCard
          index={1}
          icon={<UserCheck size={20} />}
          label="Active Employees"
          value={data.stats.active}
          supportingText={`${activePercent}% of workforce`}
          trend={{ value: '1.8%', direction: 'up' }}
          accentColor="#12B76A"
          to="/employees"
        />
        <StatCard
          index={2}
          icon={<CalendarDays size={20} />}
          label="On Leave"
          value={data.onLeaveCount}
          supportingText="Currently on approved leave"
          trend={{ value: '0.5%', direction: 'down' }}
          accentColor="#F79009"
          to="/leaves"
        />
        <StatCard
          index={3}
          icon={<UserPlus size={20} />}
          label="New Joiners"
          value={data.stats.newJoiners}
          supportingText="Joined in last 60 days"
          trend={{ value: '12%', direction: 'up' }}
          accentColor="#0EA5E9"
          to="/employees"
        />
        <StatCard
          index={4}
          icon={<FolderKanban size={20} />}
          label="Active Projects"
          value={data.activeProjects}
          supportingText="In progress this quarter"
          trend={{ value: '2', direction: 'up' }}
          accentColor="#0F2A2A"
          to="/projects"
        />
        <StatCard
          index={5}
          icon={<Clock size={20} />}
          label="Pending Leave Requests"
          value={data.pendingLeaves}
          supportingText="Awaiting approval"
          trend={{ value: '3', direction: 'up' }}
          accentColor="#F04438"
          to="/leaves"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Department Distribution"
          subtitle={`${data.totalHead} employees across ${data.departmentCount} departments`}
          className="lg:col-span-1"
          height={300}
          to="/departments"
        >
          <DepartmentDistributionChart data={data.departmentDist} />
        </ChartCard>

        <ChartCard
          title="Salary Overview"
          subtitle="Monthly payroll spend"
          className="lg:col-span-2"
          height={300}
          to="/salary"
          action={<Badge tone="accent">{formatCompactCurrency(data.salaryTotals.monthlyPayroll)}</Badge>}
        >
          <SalaryAreaChart data={data.payroll} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Employment Type Distribution"
          subtitle="Workforce composition"
          height={280}
          to="/employees"
        >
          <EmploymentTypeChart data={data.employmentDist} />
        </ChartCard>

        <ChartCard
          title="Promotion Trends"
          subtitle="Promotions over the last 8 months"
          height={280}
          to="/promotions"
        >
          <PromotionLineChart data={data.promotions} />
        </ChartCard>

        <ChartCard
          title="Leave Trends"
          subtitle="Leave applications by type"
          height={280}
          to="/leaves"
        >
          <LeaveTrendChart data={data.leaveTrend} />
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentActivities activities={data.activities} />

        <div className="space-y-4">
          <UpcomingHolidays holidays={data.holidays} />

          <Card>
            <CardHeader
              title={
                <button onClick={() => navigate('/attendance')} className="group/title inline-flex items-center gap-1.5 text-left">
                  <span className="text-base font-semibold text-[var(--text-primary)] transition-colors group-hover/title:text-brand-accent">Attendance Rate</span>
                  <ArrowUpRight size={15} className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover/title:translate-x-0.5 group-hover/title:opacity-100" />
                </button>
              }
              subtitle="Today's workforce attendance"
            />
            <div className="relative mt-2" style={{ height: 180 }}>
              <AttendanceRadialChart rate={data.attendanceRate} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-[var(--text-primary)]">
                  {data.attendanceRate}%
                </span>
                <span className="text-xs text-[var(--text-muted)]">present today</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Present" value={presentCount} tone="success" />
              <MiniStat label="Remote" value={Math.round(data.stats.total * 0.22)} tone="info" />
              <MiniStat label="Late" value={0} tone="warning" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title={
                <button onClick={() => navigate('/salary')} className="group/title inline-flex items-center gap-1.5 text-left">
                  <span className="text-base font-semibold text-[var(--text-primary)] transition-colors group-hover/title:text-brand-accent">Salary Snapshot</span>
                  <ArrowUpRight size={15} className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover/title:translate-x-0.5 group-hover/title:opacity-100" />
                </button>
              }
              subtitle="Current payroll cycle"
              action={<Badge tone="success">Paid</Badge>}
            />
            <dl className="mt-4 space-y-3">
              <SnapshotRow icon={<DollarSign size={15} />} label="Monthly payroll" value={formatCompactCurrency(data.salaryTotals.monthlyPayroll)} />
              <SnapshotRow icon={<Users size={15} />} label="Paid headcount" value={String(data.salaryTotals.headcount)} />
              <SnapshotRow icon={<TrendingUp size={15} />} label="Average salary" value={formatCompactCurrency(data.salaryTotals.averageSalary)} />
              <SnapshotRow icon={<DollarSign size={15} />} label="Bonus pool" value={formatCompactCurrency(data.salaryTotals.bonusPool)} />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: 'success' | 'info' | 'warning' }) {
  const tones = {
    success: 'text-success-600 dark:text-success-100',
    info: 'text-sky-600 dark:text-sky-100',
    warning: 'text-warning-600 dark:text-warning-100',
  };
  return (
    <div className="rounded-xl bg-[var(--bg-subtle)] py-2">
      <p className={`text-base font-bold ${tones[tone]}`}>{value}</p>
      <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function SnapshotRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="text-[var(--text-muted)]">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
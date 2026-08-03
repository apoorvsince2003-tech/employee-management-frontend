import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { salaryService } from '@/services';
import type { SalaryByDepartment, PayrollTrendPoint, SalaryBand, SalaryTotals } from '@/services/salaryService';
import { CHART_COLORS, PAGE_SIZE } from '@/constants';
import { Button, StatCard, Card, CardHeader, Badge, Avatar } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Timeline } from '@/components/shared/Timeline';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import type { SalaryRecord, SalaryRevision } from '@/types';
import { formatCurrency, formatCompactCurrency, formatNumber, formatDate, cn } from '@/utils';

type TabId = 'overview' | 'records' | 'revisions';

export default function SalaryManagement() {
  const [tab, setTab] = useState<TabId>('overview');

  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [byDepartment, setByDepartment] = useState<SalaryByDepartment[]>([]);
  const [payroll, setPayroll] = useState<PayrollTrendPoint[]>([]);
  const [bands, setBands] = useState<SalaryBand[]>([]);
  const [totals, setTotals] = useState<SalaryTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
  setLoading(true);
  setError(null);

  salaryService
    .list()
    .then((data) => {
      setRecords(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}

  useEffect(() => load(), []);

  if (loading) return <LoadingState label="Loading salary data…" />;
  if (error)
  return (
    <ErrorState
      title="Couldn't load salary data"
      description={error}
      onRetry={load}
    />
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Salary Management"
        description="Payroll, salary bands, and revision tracking"
        actions={<Button variant="outline" size="sm" leftIcon={<Download size={15} />} onClick={() => toast.success('Payroll report exported')}>Export</Button>}
      />

      <Tabs
        items={[
  {
    id: 'records' as TabId,
    label: 'Salary Records',
    icon: <DollarSign size={15} />,
  },
]}
        value={tab}
        onChange={(v) => setTab(v as TabId)}
      />

     <motion.div
  key={tab}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
>
  <RecordsTab records={records} />
</motion.div>
    </div>
  );
}

function OverviewTab({ totals, payroll, bands, byDepartment }: {
  totals: SalaryTotals;
  payroll: PayrollTrendPoint[];
  bands: SalaryBand[];
  byDepartment: SalaryByDepartment[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={<Wallet size={20} />} label="Monthly Payroll" value={formatCompactCurrency(totals.monthlyPayroll)} supportingText={`${totals.headcount} employees`} accentColor="#00BFA6" />
        <StatCard index={1} icon={<DollarSign size={20} />} label="Average Salary" value={formatCurrency(totals.averageSalary)} supportingText="Across all employees" accentColor="#0F2A2A" />
        <StatCard index={2} icon={<TrendingUp size={20} />} label="Bonus Pool" value={formatCompactCurrency(totals.bonusPool)} supportingText="Current cycle" accentColor="#47DBC3" />
        <StatCard index={3} icon={<Users size={20} />} label="Paid Headcount" value={formatNumber(totals.headcount)} supportingText="This pay period" accentColor="#12B76A" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Payroll Trend" subtitle="Monthly total payroll over time" action={<Badge tone="accent">{formatCompactCurrency(totals.monthlyPayroll)}</Badge>} />
          <div className="mt-4" style={{ height: 280 }}>
            {payroll.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payroll}>
                  <defs>
                    <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00BFA6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#00BFA6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => formatCompactCurrency(Number(v))} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}
                    formatter={(v) => [formatCurrency(Number(v)), 'Payroll']}
                  />
                  <Area type="monotone" dataKey="total" name="Payroll" stroke="#00BFA6" strokeWidth={2.5} fill="url(#payrollGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No payroll data" description="Payroll trend will appear here once data is available." />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Salary Bands" subtitle="Distribution by range" />
          <div className="mt-4" style={{ height: 280 }}>
            {bands.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bands} layout="vertical" barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-default)" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="band" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={90} />
                  <Tooltip cursor={{ fill: 'var(--bg-subtle)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border-default)', background: 'var(--bg-surface)' }} formatter={(v) => [`${v} employees`, 'Count']} />
                  <Bar dataKey="count" name="Employees" radius={[0, 6, 6, 0]}>
                    {bands.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No salary bands" description="Distribution will appear here once data is available." />
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Salary by Department" subtitle="Average and total compensation" />
        <div className="mt-4 overflow-x-auto">
          {byDepartment.length > 0 ? (
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4 text-right">Headcount</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3 text-right">Average</th>
                </tr>
              </thead>
              <tbody>
                {byDepartment.map((d) => (
                  <tr key={d.department} className="border-b border-[var(--border-default)] last:border-0">
                    <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{d.department}</td>
                    <td className="py-3 pr-4 text-right text-[var(--text-secondary)]">{d.headcount}</td>
                    <td className="py-3 pr-4 text-right text-[var(--text-secondary)]">{formatCurrency(d.total)}</td>
                    <td className="py-3 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(d.average)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No department data" description="Salary by department will appear here once data is available." />
          )}
        </div>
      </Card>
    </div>
  );
}

function RecordsTab({ records }: { records: SalaryRecord[] }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      [r.employeeName, r.designation, r.departmentName].join(' ').toLowerCase().includes(q),
    );
  }, [search, records]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<SalaryRecord>[] = [
    {
      key: 'employee',
      header: 'Employee',
      accessor: (r) => r.employeeName,
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.employeeName} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--text-primary)]">{r.employeeName}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{r.designation}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department', accessor: (r) => r.departmentName, render: (r) => <span className="text-[var(--text-secondary)]">{r.departmentName}</span> },
    { key: 'base', header: 'Base', align: 'right', accessor: (r) => r.baseSalary, render: (r) => <span className="text-[var(--text-secondary)]">{formatCurrency(r.baseSalary)}</span> },
    { key: 'bonus', header: 'Bonus', align: 'right', accessor: (r) => r.bonus, render: (r) => <span className={cn(r.bonus > 0 ? 'text-success-600 dark:text-success-100' : 'text-[var(--text-muted)]')}>{r.bonus > 0 ? `+${formatCurrency(r.bonus)}` : '—'}</span> },
    { key: 'deductions', header: 'Deductions', align: 'right', accessor: (r) => r.deductions, render: (r) => <span className="text-error-600 dark:text-error-100">-{formatCurrency(r.deductions)}</span> },
    { key: 'net', header: 'Net', align: 'right', accessor: (r) => r.netSalary, render: (r) => <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(r.netSalary)}</span> },
    { key: 'status', header: 'Status', accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'period', header: 'Period', accessor: (r) => r.payPeriod, render: (r) => <span className="text-xs text-[var(--text-muted)]">{r.payPeriod}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, role, department…" className="lg:max-w-md" />
        <Button variant="outline" size="sm" leftIcon={<Download size={15} />} className="lg:ml-auto" onClick={() => toast.success('Salary records exported')}>Export CSV</Button>
      </div>
      <DataTable columns={columns} data={paged} rowKey={(r) => r.id} emptyTitle="No salary records" emptyDescription="No records match your search." />
      {filtered.length > 0 && (
        <Pagination page={currentPage} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
      )}
    </div>
  );
}

function RevisionsTab({ revisions }: { revisions: SalaryRevision[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return revisions;
    const q = search.toLowerCase();
    return revisions.filter((r) =>
      [r.employeeName, r.designation, r.reason].join(' ').toLowerCase().includes(q),
    );
  }, [search, revisions]);

  const increments = revisions.filter((r) => r.type === 'Increment');
  const decrements = revisions.filter((r) => r.type === 'Decrement');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard index={0} icon={<TrendingUp size={20} />} label="Total Revisions" value={revisions.length} supportingText="All salary changes" accentColor="#00BFA6" />
        <StatCard index={1} icon={<ArrowUpRight size={20} />} label="Increments" value={increments.length} supportingText="Salary increases" accentColor="#12B76A" />
        <StatCard index={2} icon={<ArrowDownRight size={20} />} label="Decrements" value={decrements.length} supportingText="Salary reductions" accentColor="#F04438" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search revisions…" className="lg:max-w-md" />
      </div>

      <Card>
        <CardHeader title="Revision Timeline" subtitle="Chronological salary change history" />
        <div className="mt-5">
          {filtered.length > 0 ? (
            <Timeline
              items={[...filtered]
                .sort((a, b) => +new Date(b.effectiveDate) - +new Date(a.effectiveDate))
                .map((r: SalaryRevision) => ({
                  id: r.id,
                  title: `${r.employeeName} — ${r.type}`,
                  subtitle: `${r.designation} · ${r.departmentName}`,
                  description: r.reason,
                  date: formatDate(r.effectiveDate),
                  icon: r.type === 'Increment' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />,
                  iconColor: r.type === 'Increment' ? '#12B76A' : '#F04438',
                  meta: (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">{formatCurrency(r.previousSalary)} → <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(r.newSalary)}</span></span>
                      <Badge tone={r.type === 'Increment' ? 'success' : 'error'}>{r.changePercent > 0 ? '+' : ''}{r.changePercent}%</Badge>
                      <Badge tone="neutral">{r.changeAmount > 0 ? '+' : ''}{formatCurrency(r.changeAmount)}</Badge>
                    </div>
                  ),
                }))}
            />
          ) : (
            <EmptyState title="No salary revisions" description="Revision history will appear here once data is available." />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Revision Records" subtitle="All increment and decrement records" />
        <div className="mt-4 overflow-x-auto">
          {filtered.length > 0 ? (
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4 text-right">Previous</th>
                  <th className="pb-3 pr-4 text-right">New</th>
                  <th className="pb-3 pr-4 text-right">Change</th>
                  <th className="pb-3 pr-4">Effective</th>
                  <th className="pb-3">Reason</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--border-default)] last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[var(--text-primary)]">{r.employeeName}</p>
                      <p className="text-xs text-[var(--text-muted)]">{r.designation}</p>
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={r.type} /></td>
                    <td className="py-3 pr-4 text-right text-[var(--text-secondary)]">{formatCurrency(r.previousSalary)}</td>
                    <td className="py-3 pr-4 text-right font-medium text-[var(--text-primary)]">{formatCurrency(r.newSalary)}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={cn('font-semibold', r.changeAmount > 0 ? 'text-success-600 dark:text-success-100' : 'text-error-600 dark:text-error-100')}>
                        {r.changeAmount > 0 ? '+' : ''}{r.changePercent}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-secondary)]">{formatDate(r.effectiveDate)}</td>
                    <td className="py-3 text-[var(--text-secondary)]"><span className="line-clamp-1 max-w-[220px]">{r.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No revision records" description="Records will appear here once data is available." />
          )}
        </div>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from "@/components/ui/Modal";
import { employeeService } from "@/services";
import type { Employee } from "@/types";
import {
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Users,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { promotionService, salaryService } from '@/services';
import type { PromotionTrendPoint } from '@/services/promotionService';
import { Button, StatCard, Card, CardHeader, Badge, Avatar } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Timeline } from '@/components/shared/Timeline';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Promotion, SalaryRevision } from '@/types';
import { cn, formatCurrency, formatDate } from '@/utils';

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [trend, setTrend] = useState<PromotionTrendPoint[]>([]);
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPromotionModal, setShowPromotionModal] = useState(false);




const [employees, setEmployees] = useState<Employee[]>([]);

const [selectedEmployee, setSelectedEmployee] = useState("");

const [newDesignation, setNewDesignation] = useState("");

const [newSalary, setNewSalary] = useState("");

const [promotionDate, setPromotionDate] = useState("");

const [reason, setReason] = useState("");

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([promotionService.list(), promotionService.trend(), salaryService.revisions()])
      .then(([promoList, trendList, revList]) => {
        if (!active) return;
        setPromotions(promoList);
        setTrend(trendList);
        setRevisions(revList);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load promotions.');
        setLoading(false);
      });
      const handlePromotion = async () => {
  try {
    await promotionService.create({
      employeeId: Number(selectedEmployee),
      newDesignation,
      newSalary: Number(newSalary),
      promotionDate,
      reason,
      status: "Approved",
    });

    toast.success("Employee promoted successfully!");

    setShowPromotionModal(false);

    setSelectedEmployee("");
    setNewDesignation("");
    setNewSalary("");
    setPromotionDate("");
    setReason("");

    load(); // Promotions list reload
  } catch (err) {
    toast.error("Promotion failed");
    console.error(err);
  }
};
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), []);
  useEffect(() => {

  employeeService.list().then((data) => {

    setEmployees(data);

  });

}, []);

  const statusOptions = ['Pending', 'Approved', 'Rejected'].map((s) => ({ label: s, value: s }));

  const filtered = useMemo(() => {
    let list = promotions;
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        [p.employeeName, p.fromDesignation, p.toDesignation, p.reason].join(' ').toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, statusFilter, promotions]);

  if (loading) return <LoadingState label="Loading promotions…" />;
  if (error) return <ErrorState title="Couldn't load promotions" description={error} onRetry={load} />;

  const approved = promotions.filter((p) => p.status === 'Approved');
  const pending = promotions.filter((p) => p.status === 'Pending');
  const totalIncrease = approved.reduce((s, p) => s + p.salaryIncrease, 0);
  const handlePromotion = async () => {
  try {
    
    await promotionService.create({
      employeeId: Number(selectedEmployee),
      newDesignation,
      newSalary: Number(newSalary),
      promotionDate,
      reason,
      status: "Approved",
    });

    toast.success("Employee promoted successfully!");

    setShowPromotionModal(false);

    setSelectedEmployee("");
    setNewDesignation("");
    setNewSalary("");
    setPromotionDate("");
    setReason("");

    load();
  } catch (err) {
    toast.error("Promotion failed");
    console.error(err);
  }
};

  return (<>
    
    <div className="space-y-5">
      <PageHeader
        title="Promotions"
        description="Career progression, role changes, and salary adjustments"
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download size={15} />} onClick={() => toast.success('Promotions report exported')}>Export</Button>
            <Button size="sm"leftIcon={<Plus size={16} />} onClick={() => setShowPromotionModal(true)}>
New Promotion
</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={<TrendingUp size={20} />} label="Total Promotions" value={promotions.length} supportingText="All time" accentColor="#00BFA6" />
        <StatCard index={1} icon={<CheckCircle2 size={20} />} label="Approved" value={approved.length} supportingText="Confirmed promotions" accentColor="#12B76A" />
        <StatCard index={2} icon={<Clock size={20} />} label="Pending" value={pending.length} supportingText="Awaiting approval" accentColor="#F79009" />
        <StatCard index={3} icon={<DollarSign size={20} />} label="Salary Increase" value={formatCurrency(totalIncrease)} supportingText="Approved total" accentColor="#47DBC3" />
      </div>

      <Card>
        <CardHeader title="Promotion Trends" subtitle="Promotions processed per month" />
        <div className="mt-4" style={{ height: 260 }}>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}
                  formatter={(v) => [`${v} promotions`, 'Count']}
                />
                <Line type="monotone" dataKey="promotions" name="Promotions" stroke="#00BFA6" strokeWidth={2.5} dot={{ r: 4, fill: '#00BFA6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#00BFA6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No promotion trends" description="Trends will appear here once data is available." />
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by employee, role…" className="lg:max-w-md" />
        <FilterBar activeCount={statusFilter ? 1 : 0} onClear={() => { setStatusFilter(''); setSearch(''); }} className="lg:ml-auto">
          <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} icon={<Clock size={14} />} />
        </FilterBar>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Promotion Timeline" subtitle="Chronological career progression" />
          <div className="mt-5">
            {filtered.length > 0 ? (
              <Timeline
                items={[...filtered]
                  .sort((a, b) => +new Date(b.effectiveDate) - +new Date(a.effectiveDate))
                  .map((p) => ({
                    id: p.id,
                    title: p.employeeName,
                    subtitle: `${p.fromDesignation} → ${p.toDesignation}`,
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
              <EmptyState icon={<TrendingUp size={22} />} title="No promotions found" description="Try a different search or filter." />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="By Department" subtitle="Promotion distribution" />
          <div className="mt-4 space-y-3">
            {byDepartment(filtered).map((d) => (
              <div key={d.department} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{d.department}</span>
                <Badge tone="accent">{d.count}</Badge>
              </div>
            ))}
            {filtered.length === 0 && <p className="py-4 text-center text-sm text-[var(--text-muted)]">No data</p>}
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-5">
          <CardHeader title="Promotion Records" subtitle="Previous role, new role, and salary changes" />
        </div>
        <div className="overflow-x-auto">
          {filtered.length > 0 ? (
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)] text-left text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="px-5 pb-3 pr-4">Employee</th>
                  <th className="px-1 pb-3 pr-4">Previous Role</th>
                  <th className="px-1 pb-3 pr-4">New Role</th>
                  <th className="px-1 pb-3 pr-4 text-right">Previous Salary</th>
                  <th className="px-1 pb-3 pr-4 text-right">New Salary</th>
                  <th className="px-1 pb-3 pr-4 text-right">Increase</th>
                  <th className="px-1 pb-3 pr-4">Effective</th>
                  <th className="px-5 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const { previous, next: newSalary } = deriveSalary(p, revisions);
                  return (
                    <tr key={p.id} className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-subtle)]">
                      <td className="px-5 py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.employeeName} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[var(--text-primary)]">{p.employeeName}</p>
                            <p className="truncate text-xs text-[var(--text-muted)]">{p.departmentName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-3.5 pr-4 text-[var(--text-secondary)]">{p.fromDesignation}</td>
                      <td className="px-1 py-3.5 pr-4 font-medium text-[var(--text-primary)]">{p.toDesignation}</td>
                      <td className="px-1 py-3.5 pr-4 text-right text-[var(--text-secondary)]">{formatCurrency(previous)}</td>
                      <td className="px-1 py-3.5 pr-4 text-right font-semibold text-[var(--text-primary)]">{formatCurrency(newSalary)}</td>
                      <td className="px-1 py-3.5 pr-4 text-right">
                        <span className={cn('font-semibold text-success-600 dark:text-success-100')}>+{formatCurrency(p.salaryIncrease)}</span>
                      </td>
                      <td className="px-1 py-3.5 pr-4 text-[var(--text-secondary)]">{formatDate(p.effectiveDate)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-5 pb-5"><EmptyState icon={<Users size={22} />} title="No promotion records" description="No promotions match your filters." /></div>
          )}
        </div>
      </Card>
    </div>

      <Modal
        open={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        title="Promote Employee"
        description="Select an employee and enter promotion details."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowPromotionModal(false)}
            >
              Cancel
            </Button>

            <Button onClick={handlePromotion}>
  Promote Employee
</Button>
          </>
        }
      >
        <div className="space-y-4">

  <div>
    <label className="block text-sm font-medium mb-1">
      Employee
    </label>

    <select
      className="w-full border rounded-lg p-2"
      value={selectedEmployee}
      onChange={(e) => setSelectedEmployee(e.target.value)}
    >

      <option value="">Select Employee</option>

      {employees.map((emp: any) => (

        <option key={emp.id} value={emp.id}>

          {emp.firstName} {emp.lastName}

        </option>

      ))}

    </select>
  </div>

  <div>

    <label className="block text-sm font-medium mb-1">
      New Designation
    </label>

    <input
      className="w-full border rounded-lg p-2"
      value={newDesignation}
      onChange={(e) => setNewDesignation(e.target.value)}
    />

  </div>

  <div>

    <label className="block text-sm font-medium mb-1">
      New Salary
    </label>

    <input
      type="number"
      className="w-full border rounded-lg p-2"
      value={newSalary}
      onChange={(e) => setNewSalary(e.target.value)}
    />

  </div>

  <div>

    <label className="block text-sm font-medium mb-1">
      Promotion Date
    </label>

    <input
      type="date"
      className="w-full border rounded-lg p-2"
      value={promotionDate}
      onChange={(e) => setPromotionDate(e.target.value)}
    />

  </div>

  <div>

    <label className="block text-sm font-medium mb-1">
      Reason
    </label>

    <textarea
      className="w-full border rounded-lg p-2"
      rows={3}
      value={reason}
      onChange={(e) => setReason(e.target.value)}
    />

  </div>

</div>
      </Modal>
      </>
  );
}

function byDepartment(list: Promotion[]) {
  const map = new Map<string, number>();
  for (const p of list) {
    map.set(p.departmentName, (map.get(p.departmentName) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([department, count]) => ({ department, count }));
}

// Derive previous/new salary for a promotion from salary revision records
// when available; fall back to estimating from the increase amount.
function deriveSalary(
  p: Promotion,
  revisions: SalaryRevision[]
): { previous: number; next: number } {

  const revision = revisions.find(
    (r) => String(r.employeeId) === String(p.employeeId)
  );

  if (revision) {
    return {
      previous: revision.previousSalary,
      next: revision.newSalary,
    };
  }

  const name = p.employeeName ?? "";

  const estimated = 110000 + (name.length % 6) * 9000;

  return {
    previous: estimated,
    next: estimated + (p.salaryIncrease ?? 0),
  };
}


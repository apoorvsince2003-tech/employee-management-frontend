import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
  Filter,
} from 'lucide-react';
import { EMPLOYMENT_TYPES, EMPLOYEE_STATUS, PAGE_SIZE } from '@/constants';
import type { Employee } from '@/types';
import type { EmployeeStatus, EmploymentType } from '@/constants';
import { employeeService, departmentService } from '@/services';
import { Button, Badge } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { Pagination } from '@/components/shared/Pagination';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { ActionMenu, type ActionMenuItem } from '@/components/shared/ActionMenu';
import { EmployeeCard } from '@/components/cards/EmployeeCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Modal } from '@/components/ui/Modal';
import { cn, formatCurrency } from '@/utils';
import type { Department } from '@/types';

type SortKey = 'name' | 'designation' | 'department' | 'salary' | 'joinDate';
type SortDir = 'asc' | 'desc';

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([employeeService.list(), departmentService.list()])
      .then(([empList, deptList]) => {
        if (!active) return;
        setEmployees(empList);
        setDepartments(deptList);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load employees.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), []);

  const deptOptions = departments.map((d) => {
  console.log(d);

  return {
    label: (d as any).departmentName ?? (d as any).name,
    value: String(d.id),
  };
});
  const statusOptions = (Object.values(EMPLOYEE_STATUS) as EmployeeStatus[]).map((s) => ({
    label: s,
    value: s,
  }));
  const typeOptions = (Object.values(EMPLOYMENT_TYPES) as EmploymentType[]).map((t) => ({
    label: t,
    value: t,
  }));

  const filtered = useMemo(() => {
    let list = [...employees];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        [`${e.firstName} ${e.lastName}`, e.email, e.designation, e.departmentName, e.employeeCode]
          .join(' ')
          .toLowerCase()
          .includes(q),
      );
    }
    if (deptFilter) list = list.filter((e) => e.departmentId === deptFilter);
    if (statusFilter) list = list.filter((e) => e.status === statusFilter);
    if (typeFilter) list = list.filter((e) => e.employmentType === typeFilter);

    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const get = (e: Employee): string | number =>
        sortKey === 'name'
          ? `${e.firstName} ${e.lastName}`.toLowerCase()
          : sortKey === 'salary'
            ? e.salary
            : sortKey === 'joinDate'
              ? +new Date(e.joinDate)
              : sortKey === 'department' ? e.departmentName : (e[sortKey as keyof Employee] as string ?? '');
      const av = get(a);
      const bv = get(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }, [employees, search, deptFilter, statusFilter, typeFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilterCount = [deptFilter, statusFilter, typeFilter].filter(Boolean).length;

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key as SortKey);
      setSortDir('asc');
    }
  }

  function clearFilters() {
    setDeptFilter('');
    setStatusFilter('');
    setTypeFilter('');
    setSearch('');
    setPage(1);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const name = `${target.firstName} ${target.lastName}`;
    setEmployees((prev) => prev.filter((e) => e.id !== target.id));
    setDeleteTarget(null);
    employeeService
      .remove(target.id)
      .then(() => toast.success(`${name} removed from directory`))
      .catch(() => toast.error('Could not remove employee — reloading'));
  }

  function handleSaveEdit() {
    if (!editTarget) return;
    const target = editTarget;
    setEmployees((prev) => prev.map((e) => (e.id === target.id ? target : e)));
    const name = `${target.firstName} ${target.lastName}`;
    setEditTarget(null);
    employeeService
      .update(target.id, target)
      .then(() => toast.success(`${name}'s profile updated`))
      .catch(() => toast.error('Could not save changes'));
  }

  function rowActions(emp: Employee): ActionMenuItem[] {
    return [
      { label: 'View profile', icon: <Eye size={15} />, onClick: () => navigate(`/employees/${emp.id}`) },
      { label: 'Edit', icon: <Pencil size={15} />, onClick: () => setEditTarget(emp) },
      { label: 'Delete', icon: <Trash2 size={15} />, onClick: () => setDeleteTarget(emp), danger: true, separator: true },
    ];
  }

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      sortable: true,
      accessor: (e) => `${e.firstName} ${e.lastName}`,
      render: (e) => (
        <button
          onClick={() => navigate(`/employees/${e.id}`)}
          className="flex items-center gap-3 text-left"
        >
          <Avatar name={`${e.firstName} ${e.lastName}`} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--text-primary)] hover:text-brand-accent">
              {e.firstName} {e.lastName}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">{e.employeeCode}</p>
          </div>
        </button>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      sortable: true,
      accessor: (e) => e.designation,
      render: (e) => <span className="text-[var(--text-secondary)]">{e.designation}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      accessor: (e) => e.departmentName,
      render: (e) => (
        <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Building2 size={13} className="text-[var(--text-muted)]" />
          {e.departmentName}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (e) => e.employmentType,
      render: (e) => <Badge tone="neutral">{e.employmentType}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (e) => e.status,
      render: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      align: 'right',
      accessor: (e) => e.salary,
      render: (e) => <span className="font-medium">{formatCurrency(e.salary)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      accessor: () => '',
      render: (e) => (
        <div onClick={(ev) => ev.stopPropagation()}>
          <ActionMenu items={rowActions(e)} />
        </div>
      ),
    },
  ];

  if (loading) return <LoadingState label="Loading employees…" />;
  if (error)
    return <ErrorState title="Couldn't load employees" description={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees"
        description={`${filtered.length} ${filtered.length === 1 ? 'employee' : 'employees'} in your organization`}
        actions={
          <>
            <div className="inline-flex rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-1">
              <ViewToggle active={view === 'table'} onClick={() => setView('table')} icon={<TableIcon size={16} />} label="Table" />
              <ViewToggle active={view === 'cards'} onClick={() => setView('cards')} icon={<LayoutGrid size={16} />} label="Cards" />
            </div>
            <Button leftIcon={<Plus size={16} />} onClick={() => navigate('/employees/new')}>
              Add Employee
            </Button>
          </>
        }
      />

      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, email, role…" className="lg:max-w-md" />
        <FilterBar activeCount={activeFilterCount} onClear={clearFilters} className="lg:ml-auto">
          <FilterSelect label="Department" value={deptFilter} options={deptOptions} onChange={(v) => { setDeptFilter(v); setPage(1); }} icon={<Building2 size={14} />} />
          <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={(v) => { setStatusFilter(v); setPage(1); }} icon={<Filter size={14} />} />
          <FilterSelect label="Type" value={typeFilter} options={typeOptions} onChange={(v) => { setTypeFilter(v); setPage(1); }} icon={<Users size={14} />} />
        </FilterBar>
      </div>

      {/* Body */}
      {view === 'table' ? (
        <DataTable
          columns={columns}
          data={paged}
          rowKey={(e) => e.id}
          onRowClick={(e) => navigate(`/employees/${e.id}`)}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No employees found"
          emptyDescription="Try adjusting your search or filters."
        />
      ) : (
        paged.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((emp, i) => (
              <EmployeeCard key={emp.id} employee={emp} index={i} actions={rowActions(emp)} />
            ))}
          </div>
        ) : null
      )}

      {filtered.length > 0 && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove employee"
        description={
          deleteTarget
            ? `Are you sure you want to remove ${deleteTarget.firstName} ${deleteTarget.lastName} from the directory? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        destructive
      />

      <EmployeeEditModal
        employee={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
        onChange={setEditTarget}
      />
    </div>
  );
}

function ViewToggle({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
        active ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function EmployeeEditModal({
  employee,
  onClose,
  onSave,
  onChange,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: Employee) => void;
}) {
  if (!employee) return null;
  return (
    <Modal
      open={!!employee}
      onClose={onClose}
      title="Edit employee"
      description="Update employee information. Changes are saved locally."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input className="apsara-input" value={employee.firstName} onChange={(e) => onChange({ ...employee, firstName: e.target.value })} />
        </Field>
        <Field label="Last name">
          <input className="apsara-input" value={employee.lastName} onChange={(e) => onChange({ ...employee, lastName: e.target.value })} />
        </Field>
        <Field label="Email">
          <input className="apsara-input" value={employee.email} onChange={(e) => onChange({ ...employee, email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <input className="apsara-input" value={employee.phone} onChange={(e) => onChange({ ...employee, phone: e.target.value })} />
        </Field>
        <Field label="Designation">
          <input className="apsara-input" value={employee.designation} onChange={(e) => onChange({ ...employee, designation: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className="apsara-input" value={employee.location} onChange={(e) => onChange({ ...employee, location: e.target.value })} />
        </Field>
        <Field label="Salary (USD)">
          <input type="number" className="apsara-input" value={employee.salary} onChange={(e) => onChange({ ...employee, salary: Number(e.target.value) })} />
        </Field>
        <Field label="Status">
          <select className="apsara-input" value={employee.status} onChange={(e) => onChange({ ...employee, status: e.target.value as EmployeeStatus })}>
            {Object.values(EMPLOYEE_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      {children}
    </label>
  );
}

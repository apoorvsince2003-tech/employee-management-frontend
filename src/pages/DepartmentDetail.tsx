import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  FolderKanban,
  DollarSign,
  Calendar,
  ArrowUpRight,
  User,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PROJECT_STATUS } from '@/constants';
import {
  departmentService,
  employeeService,
  projectService,
  teamService,
} from '@/services';
import type { Department, Employee, Project, Team } from '@/types';
import { ProfileHeader, MetaItem } from '@/components/shared/ProfileHeader';
import { Card, CardHeader, Button, Avatar, Badge } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeCard } from '@/components/cards/EmployeeCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { formatCompactCurrency, formatDate, formatNumber } from '@/utils';

export default function DepartmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<Employee[]>([]);
  const [deptTeams, setDeptTeams] = useState<Team[]>([]);
  const [deptProjects, setDeptProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return () => {};
    let active = true;
    setLoading(true);
    setError(null);
    departmentService
      .getById(id)
      .then(async (dept) => {
        if (!active || !dept) return;
        setDepartment(dept);
        const [empList, teamList, projectList] = await Promise.all([
          employeeService.byDepartment(String(dept.id)),
teamService.byDepartment(String(dept.id)),
          projectService.list(),
        ]);
        if (!active) return;
        setDeptEmployees(empList);
        setDeptTeams(teamList);
        setDeptProjects(projectList.filter((p) => teamList.some((t) => t.id === p.teamId)));
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load department.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), [id]);

  if (loading) return <LoadingState label="Loading department…" />;
  if (error || !department) {
    return (
      <ErrorState
        title="Department not found"
        description={error ?? "This department doesn't exist or has been removed."}
        onRetry={load}
        action={<Link to="/departments"><Button variant="subtle" size="sm">Back to departments</Button></Link>}
      />
    );
  }

  const activeProjects = deptProjects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS);
  const head = deptEmployees.find((e) => e.id === department.headId);

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={department.name}
        subtitle={department.description}
        backLink="/departments"
        backLabel="Back to departments"
        badges={
          <>
            <Badge tone="primary">{department.code}</Badge>
            <Badge tone="accent">Active</Badge>
          </>
        }
        meta={
          <>
            <MetaItem icon={<Building2 size={14} />} label={department.headName} />
            <MetaItem icon={<Users size={14} />} label={`${department.employeeCount} members`} />
            <MetaItem icon={<Calendar size={14} />} label={`Est. ${formatDate(department.establishedDate).split(',')[0]}`} />
          </>
        }
        avatar={false}
        actions={
  <div className="flex gap-2">

    <Button
      size="sm"
      onClick={() => navigate(`/departments/${department.id}/edit`)}
      leftIcon={<Pencil size={15} />}
    >
      Edit
    </Button>

    <Button
      size="sm"
      variant="danger"
      leftIcon={<Trash2 size={15} />}
      onClick={async () => {

        if (!window.confirm("Delete this department?")) return;

        try {

          await departmentService.remove(String(department.id));

          toast.success("Department Deleted");

          navigate("/departments");

        } catch {

          toast.error("Delete Failed");

        }

      }}
    >
      Delete
    </Button>

  </div>
}
      >
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DeptStat icon={<Users size={16} />} label="Headcount" value={formatNumber(department.employeeCount)} />
          <DeptStat icon={<FolderKanban size={16} />} label="Active projects" value={String(activeProjects.length)} />
          <DeptStat icon={<DollarSign size={16} />} label="Budget" value={formatCompactCurrency(department.budget)} />
          <DeptStat icon={<Users size={16} />} label="Teams" value={String(deptTeams.length)} />
        </div>
      </ProfileHeader>

      {head && (
        <Card>
          <CardHeader title="Department Head" subtitle="Leadership and accountability" />
          <Link to={`/employees/${head.id}`} className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
            <Avatar name={`${head.firstName} ${head.lastName}`} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[var(--text-primary)]">{head.firstName} {head.lastName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{head.designation}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{head.email}</p>
            </div>
            <ArrowUpRight size={18} className="text-[var(--text-muted)]" />
          </Link>
        </Card>
      )}

      {deptTeams.length > 0 && (
        <Card>
          <CardHeader title="Teams" subtitle={`${deptTeams.length} team${deptTeams.length === 1 ? '' : 's'} in this department`} />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deptTeams.map((t) => (
              <Link key={t.id} to={`/teams/${t.id}`} className="group rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-accent">{t.name}</p>
                  <ArrowUpRight size={15} className="text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-[var(--text-secondary)]">{t.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1"><User size={11} /> {t.leadName}</span>
                  <span className="inline-flex items-center gap-1"><Users size={11} /> {t.memberCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {activeProjects.length > 0 && (
        <Card padding="none">
          <div className="p-5">
            <CardHeader title="Active Projects" subtitle={`${activeProjects.length} in progress`} />
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 pt-0 sm:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Card>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Team Members</h2>
          <Badge tone="neutral">{deptEmployees.length}</Badge>
        </div>
        {deptEmployees.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deptEmployees.map((emp, i) => (
              <EmployeeCard key={emp.id} employee={emp} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Users size={22} />} title="No members yet" description="This department has no assigned employees." />
        )}
      </div>
    </div>
  );
}

function DeptStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-brand-accent">{icon}</span>
      <p className="mt-2 text-lg font-bold text-brand-secondary">{value}</p>
      <p className="text-xs text-mint-200/70">{label}</p>
    </div>
  );
}

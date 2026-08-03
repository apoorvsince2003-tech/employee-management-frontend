import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Users, FolderKanban, DollarSign, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { PROJECT_STATUS } from '@/constants';
import { departmentService, projectService, teamService } from '@/services';
import type { Department, Project, Team } from '@/types';
import { Button, StatCard } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { DepartmentCard } from '@/components/cards/DepartmentCard';
import { formatCompactCurrency, formatNumber } from '@/utils';

export default function Departments() {

  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([departmentService.list(), projectService.list(), teamService.list()])
      .then(([deptList, projectList, teamList]) => {
        if (!active) return;
        setDepartments(deptList);
        setProjects(projectList);
        setTeams(teamList);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load departments.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), []);

  const activeProjectsByDept = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of projects) {
      const team = teams.find((t) => t.id === p.teamId);
      if (team && p.status === PROJECT_STATUS.IN_PROGRESS) {
        map[team.departmentId] = (map[team.departmentId] ?? 0) + 1;
      }
    }
    return map;
  }, [projects, teams]);

  const filtered = useMemo(() => {
    if (!search.trim()) return departments;
    const q = search.toLowerCase();
    return departments.filter((d) =>
      [d.name, d.code, d.description, d.headName].join(' ').toLowerCase().includes(q),
    );
  }, [search, departments]);

  if (loading) return <LoadingState label="Loading departments…" />;
  if (error)
    return <ErrorState title="Couldn't load departments" description={error} onRetry={load} />;

  const totalHeadcount = departments.reduce((s, d) => s + d.employeeCount, 0);
  const totalBudget = departments.reduce((s, d) => s + d.budget, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Departments"
        description={`${departments.length} departments powering your organization`}
        actions={
  <Button
    leftIcon={<Plus size={16} />}
    onClick={() => navigate('/departments/new')}
  >
    New Department
  </Button>
}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard index={0} icon={<Building2 size={20} />} label="Total Departments" value={departments.length} supportingText="Active organizational units" accentColor="#00BFA6" />
        <StatCard index={1} icon={<Users size={20} />} label="Total Headcount" value={formatNumber(totalHeadcount)} supportingText="Across all departments" accentColor="#0F2A2A" />
        <StatCard index={2} icon={<DollarSign size={20} />} label="Combined Budget" value={formatCompactCurrency(totalBudget)} supportingText="Annual departmental budgets" accentColor="#47DBC3" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search departments…" className="lg:max-w-md" />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((dept, i) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              activeProjects={activeProjectsByDept[dept.id] ?? 0}
              index={i}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<LayoutGrid size={22} />}
          title="No departments found"
          description="Try a different search term."
        />
      )}
    </div>
  );
}

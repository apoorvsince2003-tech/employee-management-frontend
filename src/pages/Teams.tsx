import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, Plus, Users, Building2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamService, departmentService } from '@/services';
import type { Team, Department } from '@/types';
import { Button, StatCard } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { TeamCard } from '@/components/cards/TeamCard';

export default function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([teamService.list(), departmentService.list()])
      .then(([teamList, deptList]) => {
        if (!active) return;
        setTeams(teamList);
        setDepartments(deptList);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load teams.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), []);

  const deptOptions = departments.map((d) => ({ label: d.name, value: d.id }));

  const filtered = useMemo(() => {
    let list = teams;
    if (deptFilter) list = list.filter((t) => t.departmentId === deptFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        [t.name, t.description, t.leadName, t.departmentName].join(' ').toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, deptFilter, teams]);

  if (loading) return <LoadingState label="Loading teams…" />;
  if (error) return <ErrorState title="Couldn't load teams" description={error} onRetry={load} />;

  const totalMembers = teams.reduce((s, t) => s + t.memberCount, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Teams"
        description={`${teams.length} cross-functional teams across the organization`}
        actions={<Button leftIcon={<Plus size={16} />} onClick={() => navigate('/teams/new')}>New Team</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard index={0} icon={<UsersRound size={20} />} label="Total Teams" value={teams.length} supportingText="Cross-functional units" accentColor="#00BFA6" />
        <StatCard index={1} icon={<Users size={20} />} label="Total Members" value={totalMembers} supportingText="Across all teams" accentColor="#0F2A2A" />
        <StatCard index={2} icon={<Building2 size={20} />} label="Departments" value={departments.length} supportingText="Teams grouped by dept" accentColor="#47DBC3" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search teams…" className="lg:max-w-md" />
        <FilterBar activeCount={deptFilter ? 1 : 0} onClear={() => { setDeptFilter(''); setSearch(''); }} className="lg:ml-auto">
          <FilterSelect label="Department" value={deptFilter} options={deptOptions} onChange={setDeptFilter} icon={<Filter size={14} />} />
        </FilterBar>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team, i) => (
            <TeamCard key={team.id} team={team} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users size={22} />}
          title="No teams found"
          description="Try a different search or department filter."
        />
      )}
    </div>
  );
}

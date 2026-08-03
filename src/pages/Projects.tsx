import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Filter, TrendingUp, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { PROJECT_STATUS } from '@/constants';
import type { ProjectStatus } from '@/constants';
import { projectService } from '@/services';
import type { Project } from '@/types';
import { Button, StatCard } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { formatCompactCurrency } from '@/utils';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  function load() {
    let active = true;
    setLoading(true);
    setError(null);
    projectService
      .list()
      .then((list) => {
        if (!active) return;
        setProjects(list);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load projects.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), []);

  const statusOptions = (Object.values(PROJECT_STATUS) as ProjectStatus[]).map((s) => ({
    label: s,
    value: s,
  }));
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'].map((p) => ({ label: p, value: p }));

  const filtered = useMemo(() => {
    let list = projects;
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (priorityFilter) list = list.filter((p) => p.priority === priorityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.code, p.description, p.teamName, p.leadName].join(' ').toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, statusFilter, priorityFilter, projects]);

  if (loading) return <LoadingState label="Loading projects…" />;
  if (error) return <ErrorState title="Couldn't load projects" description={error} onRetry={load} />;

  const activeCount = projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length;
  const completedCount = projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        description={`${projects.length} projects across all teams`}
        actions={<Button leftIcon={<Plus size={16} />} onClick={() => navigate('/projects/new')}>New Project</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={<FolderKanban size={20} />} label="Total Projects" value={projects.length} supportingText="All portfolio items" accentColor="#00BFA6" />
        <StatCard index={1} icon={<TrendingUp size={20} />} label="In Progress" value={activeCount} supportingText="Active this quarter" accentColor="#0F2A2A" />
        <StatCard index={2} icon={<CheckCircle2 size={20} />} label="Completed" value={completedCount} supportingText="Delivered projects" accentColor="#12B76A" />
        <StatCard index={3} icon={<DollarSign size={20} />} label="Total Budget" value={formatCompactCurrency(totalBudget)} supportingText="Combined project budgets" accentColor="#47DBC3" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects…" className="lg:max-w-md" />
        <FilterBar activeCount={[statusFilter, priorityFilter].filter(Boolean).length} onClear={() => { setStatusFilter(''); setPriorityFilter(''); setSearch(''); }} className="lg:ml-auto">
          <FilterSelect label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} icon={<Clock size={14} />} />
          <FilterSelect label="Priority" value={priorityFilter} options={priorityOptions} onChange={setPriorityFilter} icon={<Filter size={14} />} />
        </FilterBar>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderKanban size={22} />}
          title="No projects found"
          description="Try a different search or filter."
        />
      )}
    </div>
  );
}

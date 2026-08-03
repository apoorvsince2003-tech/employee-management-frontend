import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Building2,
  FolderKanban,
  User,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { teamService, employeeService, projectService, departmentService } from '@/services';
import type { Team, Employee, Project, Department } from '@/types';
import { ProfileHeader, MetaItem } from '@/components/shared/ProfileHeader';
import { Card, CardHeader, Button, Avatar, Badge } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeCard } from '@/components/cards/EmployeeCard';
import { ProjectCard } from '@/components/cards/ProjectCard';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Employee[]>([]);
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!id) return () => {};
    let active = true;
    setLoading(true);
    setError(null);
    teamService
      .getById(id)
      .then(async (t) => {
        if (!active || !t) return;
        setTeam(t);
        const [empList, projectList, dept] = await Promise.all([
          employeeService.byTeam(t.id),
          projectService.byTeam(t.id),
          t.departmentId ? departmentService.getById(t.departmentId) : Promise.resolve(null),
        ]);
        if (!active) return;
        setMembers(empList);
        setTeamProjects(projectList);
        setDepartment(dept);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load team.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }

  useEffect(() => load(), [id]);

  if (loading) return <LoadingState label="Loading team…" />;
  if (error || !team) {
    return (
      <ErrorState
        title="Team not found"
        description={error ?? "This team doesn't exist or has been removed."}
        onRetry={load}
        action={<Link to="/teams"><Button variant="subtle" size="sm">Back to teams</Button></Link>}
      />
    );
  }

  const lead = members.find((e) => e.id === team.leadId);

  return (
    <div className="space-y-5">
      <ProfileHeader
        name={team.name}
        subtitle={team.description}
        backLink="/teams"
        backLabel="Back to teams"
        badges={
          <>
            <Badge tone="primary">{team.departmentName}</Badge>
            <Badge tone="accent">{team.memberCount} members</Badge>
          </>
        }
        meta={
          <>
            <MetaItem icon={<Building2 size={14} />} label={team.departmentName} />
            <MetaItem icon={<User size={14} />} label={team.leadName} />
            <MetaItem icon={<FolderKanban size={14} />} label={team.projectName} />
          </>
        }
        avatar={false}
        actions={<Button size="sm" leftIcon={<Plus size={15} />} onClick={() => toast('Add member form — coming soon')}>Add Member</Button>}
      >
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <TeamStat icon={<Users size={16} />} label="Members" value={String(members.length)} />
          <TeamStat icon={<FolderKanban size={16} />} label="Projects" value={String(teamProjects.length)} />
          <TeamStat icon={<Building2 size={16} />} label="Department" value={department?.code ?? '—'} />
        </div>
      </ProfileHeader>

      {lead && (
        <Card>
          <CardHeader title="Team Leader" subtitle="Direct ownership and accountability" />
          <Link to={`/employees/${lead.id}`} className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]">
            <Avatar name={`${lead.firstName} ${lead.lastName}`} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[var(--text-primary)]">{lead.firstName} {lead.lastName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{lead.designation}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{lead.email}</p>
            </div>
            <ArrowUpRight size={18} className="text-[var(--text-muted)]" />
          </Link>
        </Card>
      )}

      {teamProjects.length > 0 && (
        <Card padding="none">
          <div className="p-5">
            <CardHeader title="Projects" subtitle={`${teamProjects.length} project${teamProjects.length === 1 ? '' : 's'}`} />
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 pt-0 sm:grid-cols-2 lg:grid-cols-3">
            {teamProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Card>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Members</h2>
          <Badge tone="neutral">{members.length}</Badge>
        </div>
        {members.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((emp, i) => (
              <EmployeeCard key={emp.id} employee={emp} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Users size={22} />} title="No members yet" description="This team has no assigned members." />
        )}
      </div>
    </div>
  );
}

function TeamStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/20 text-brand-accent">{icon}</span>
      <p className="mt-2 text-lg font-bold text-brand-secondary">{value}</p>
      <p className="text-xs text-mint-200/70">{label}</p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  teamService,
  departmentService,
  employeeService,
  projectService,
} from '@/services';
import type { Department, Employee, Project } from '@/types';
import { Button } from '@/components/ui';

export default function TeamForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [leadId, setLeadId] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [d,e,p] = await Promise.all([
          departmentService.list(),
          employeeService.list(),
          projectService.list(),
        ]);
        setDepartments(d);
        setEmployees(e);
        setProjects(p);
      } catch {
        toast.error('Failed to load form data');
      }
    }
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !departmentId || !leadId) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setSaving(true);
      await teamService.create({
        name,
        description,
        departmentId,
        leadId,
        memberCount,
      });
      toast.success('Team created successfully');
      navigate('/teams');
    } catch {
      toast.error('Failed to create team');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Team</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" placeholder="Team Name"
          value={name} onChange={e=>setName(e.target.value)} />

        <textarea className="w-full border rounded p-2" placeholder="Description"
          value={description} onChange={e=>setDescription(e.target.value)} />

        <select className="w-full border rounded p-2"
          value={departmentId} onChange={e=>setDepartmentId(e.target.value)}>
          <option value="">Select Department</option>
          {departments.map(d=>(
            <option key={d.id} value={d.id}>{(d as any).name ?? (d as any).departmentName}</option>
          ))}
        </select>

        <select className="w-full border rounded p-2"
          value={leadId} onChange={e=>setLeadId(e.target.value)}>
          <option value="">Select Team Lead</option>
          {employees.map(e=>(
            <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
          ))}
        </select>


        <input type="number" className="w-full border rounded p-2"
          value={memberCount}
          onChange={e=>setMemberCount(Number(e.target.value))}
          placeholder="Member Count" />

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Team'}
          </Button>
          <Button type="button" variant="outline" onClick={()=>navigate('/teams')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
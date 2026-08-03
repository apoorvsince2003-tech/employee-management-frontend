import type { ProjectStatus } from '@/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  projectService,
  teamService,
  employeeService,
} from '@/services';

import type {
  Team,
  Employee,
} from '@/types';

import { Button } from '@/components/ui';

export default function ProjectForm() {
  const navigate = useNavigate();

const [name, setName] = useState('');
const [code, setCode] = useState('');
const [description, setDescription] = useState('');

const [status, setStatus] = useState<ProjectStatus>('Planning');

const [priority, setPriority] = useState<
  'Low' | 'Medium' | 'High' | 'Critical'
>('Medium');

const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

const [budget, setBudget] = useState(0);
const [spent] = useState(0);
const [progress] = useState(0);

const [teamId, setTeamId] = useState('');
const [leadId, setLeadId] = useState('');

const [teams, setTeams] = useState<Team[]>([]);
const [employees, setEmployees] = useState<Employee[]>([]);

const [saving, setSaving] = useState(false);

useEffect(() => {
  async function loadData() {
    try {
      const [teamData, employeeData] = await Promise.all([
        teamService.list(),
        employeeService.list(),
      ]);

      setTeams(teamData);
      setEmployees(employeeData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    }
  }

  loadData();
}, []);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!name.trim()) {
    toast.error('Project name is required');
    return;
  }

  if (!teamId) {
    toast.error('Please select a team');
    return;
  }

  if (!leadId) {
    toast.error('Please select a project lead');
    return;
  }

  try {
    setSaving(true);

    await projectService.create({
      name,
      code,
      description,
      status,
      priority,
      startDate,
      endDate,
      budget,
      spent,
      progress,
      teamId,
      leadId,
    });

    toast.success('Project created successfully');

    navigate('/projects');

  } catch (err) {
    console.error(err);
    toast.error('Failed to create project');
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Project
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Project Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter Project Name"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Project Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter Project Code"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Team
          </label>

          <select
           value={teamId}
           onChange={(e) => setTeamId(e.target.value)}
           className="w-full border rounded-lg px-4 py-2"
           required
           >
            <option value="">Select Team</option>

            {teams.map((team) => (
            <option key={team.id} value={team.id}>
            {team.name}
          </option>
         ))}
</select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Project Lead
          </label>

          <select
  value={leadId}
  onChange={(e) => setLeadId(e.target.value)}
  className="w-full border rounded-lg px-4 py-2"
  required
>
  <option value="">Select Project Lead</option>

  {employees.map((employee) => (
    <option key={employee.id} value={employee.id}>
      {employee.firstName} {employee.lastName}
    </option>
  ))}
</select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Budget
          </label>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Budget"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Project Description"
          />
        </div>

        <div className="flex gap-3">

          <Button type="submit">
            Save Project
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>

        </div>

      </form>
    </div>
  );
}
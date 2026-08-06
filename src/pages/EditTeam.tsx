import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  teamService,
  departmentService,
  employeeService,
  projectService,
} from "@/services";
import type { Department, Employee, Project } from "@/types";
import { Button } from "@/components/ui";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [memberCount, setMemberCount] = useState(0);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [team, d, e, p] = await Promise.all([
        teamService.getById(String(id)),
        departmentService.list(),
        employeeService.list(),
        projectService.list(),
      ]);

      setDepartments(d);
      setEmployees(e);
      setProjects(p);

      setName(team.name ?? "");
      setDescription(team.description ?? "");
      setDepartmentId(String(team.departmentId ?? ""));
      setLeadId(String(team.leadId ?? ""));
      setProjectId(String(team.projectId ?? ""));
      setMemberCount(team.memberCount ?? 0);
    } catch {
      toast.error("Failed to load team");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await teamService.update(String(id), {
        name,
        description,
        departmentId,
        leadId,
        projectId,
        memberCount,
      });

      toast.success("Team Updated Successfully");

      navigate(`/teams/${id}`);
    } catch {
      toast.error("Update Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Team</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team Name"
        />

        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <select
          className="w-full border rounded p-2"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>

          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border rounded p-2"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
        >
          <option value="">Select Team Lead</option>

          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>

        <select
          className="w-full border rounded p-2"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>

          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-full border rounded p-2"
          value={memberCount}
          onChange={(e) => setMemberCount(Number(e.target.value))}
          placeholder="Member Count"
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Team"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/teams/${id}`)}
          >
            Cancel
          </Button>
        </div>

      </form>
    </div>
  );
}
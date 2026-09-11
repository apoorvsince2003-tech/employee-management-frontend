import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeService, leaveService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";

export default function LeaveForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    employeeService
      .list()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setEmployees(list);

        // If Employee is logged in, auto-fill their identity
        if (!isAdmin && user) {
          const currentEmp = list.find(
            (e: any) =>
              (user.employeeId && String(e.id) === String(user.employeeId)) ||
              (user.email && e.email?.toLowerCase() === user.email.toLowerCase())
          );

          if (currentEmp) {
            setForm((prev) => ({
              ...prev,
              employeeId: String(currentEmp.id),
              employeeName: `${currentEmp.firstName} ${currentEmp.lastName}`,
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              employeeId: String(user.employeeId || ""),
              employeeName: user.email?.split("@")[0] || "Employee",
            }));
          }
        }
      })
      .catch(() => setEmployees([]));
  }, [user, isAdmin]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fromDate || !form.toDate || !form.reason) {
      toast.error("Please fill in dates and reason");
      return;
    }

    if (isAdmin && !form.employeeId) {
      toast.error("Please select an employee");
      return;
    }

    setLoading(true);
    leaveService
      .create(form)
      .then(() => {
        toast.success("Leave Request Submitted (Pending Approval)");
        navigate("/leaves");
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to apply leave");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-[var(--border-default)] surface shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        {isAdmin ? "Submit Leave on Behalf of Employee" : "Apply for Leave"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Employee
          </label>
          {isAdmin ? (
            <select
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
              value={form.employeeId}
              onChange={(e) => {
                const emp = employees.find((x) => String(x.id) === e.target.value);
                setForm({
                  ...form,
                  employeeId: e.target.value,
                  employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "",
                });
              }}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeCode || `ID: ${emp.id}`})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              readOnly
              disabled
              value={form.employeeName || user?.email || "Current Employee"}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-muted)] cursor-not-allowed"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              From Date
            </label>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
              value={form.fromDate}
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              To Date
            </label>
            <input
              type="date"
              required
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
              value={form.toDate}
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Reason for Leave
          </label>
          <textarea
            required
            rows={3}
            placeholder="e.g. Medical emergency, Family function, Vacation..."
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/leaves")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
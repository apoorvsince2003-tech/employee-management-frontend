import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { attendanceService, employeeService } from "@/services";
import { useAuth } from "@/context/AuthContext";

type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Half Day"
  | "Remote";

export default function AttendanceForm() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<AttendanceStatus>("Present");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    employeeService
      .list()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setEmployees(list);

        // Auto-lock Employee identity if not admin
        if (!isAdmin && user) {
          const currentEmp = list.find(
            (e: any) =>
              (user.employeeId && String(e.id) === String(user.employeeId)) ||
              (user.email && e.email?.toLowerCase() === user.email.toLowerCase())
          );

          if (currentEmp) {
            setEmployeeId(String(currentEmp.id));
            setEmployeeName(`${currentEmp.firstName} ${currentEmp.lastName}`);
          } else {
            setEmployeeId(String(user.employeeId || ""));
            setEmployeeName(user.email?.split("@")[0] || "Employee");
          }
        }
      })
      .catch(() => setEmployees([]));
  }, [user, isAdmin]);

  async function saveAttendance() {
    if (!employeeName || !date) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await attendanceService.create({
        employeeId,
        employeeName,
        date,
        status,
      } as any);

      toast.success("Attendance Logged Successfully");
      navigate("/attendance");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto rounded-2xl border border-[var(--border-default)] surface shadow-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        {isAdmin ? "Log Employee Attendance" : "Mark Today's Attendance"}
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Employee Name
          </label>
          {isAdmin ? (
            <select
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
              value={employeeId}
              onChange={(e) => {
                const emp = employees.find((x) => String(x.id) === e.target.value);
                setEmployeeId(e.target.value);
                setEmployeeName(emp ? `${emp.firstName} ${emp.lastName}` : "");
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
              value={employeeName || user?.email || "Current Employee"}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-muted)] cursor-not-allowed"
            />
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Attendance Status
          </label>
          <select
            id="status"
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
            value={status}
            onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
          >
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Remote">Remote</option>
            {isAdmin && <option value="Absent">Absent</option>}
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/attendance")}
          >
            Cancel
          </Button>

          <Button onClick={saveAttendance} disabled={loading}>
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>
    </div>
  );
}
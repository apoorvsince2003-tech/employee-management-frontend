import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { attendanceService } from "@/services";
import { Plus, Trash2, Edit3, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttendanceRecord } from "@/types";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Attendance() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const loadAttendance = () => {
    setLoading(true);
    attendanceService
      .list()
      .then((res: any) => {
        const list: AttendanceRecord[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        // Strict Role Isolation: Employee only views their own attendance logs
        const userSpecific = isAdmin
          ? list
          : list.filter((item: any) => {
              if (user?.employeeId && item.employeeId) {
                return String(item.employeeId) === String(user.employeeId);
              }
              if (user?.email && item.email) {
                return item.email.toLowerCase() === user.email.toLowerCase();
              }
              if (user?.email && item.employeeName) {
                const prefix = user.email.split("@")[0].toLowerCase();
                return item.employeeName.toLowerCase().includes(prefix);
              }
              return true;
            });

        setAttendance(userSpecific);
      })
      .catch((err) => {
        console.error(err);
        setAttendance([]);
      })
      .finally(() => setLoading(false));
  };

  const deleteAttendance = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await attendanceService.remove(id);
      toast.success("Attendance Record Deleted");
      loadAttendance();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const filteredAttendance = attendance
    .filter((item) =>
      isAdmin && search
        ? (item.employeeName || "").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((item) => (statusFilter === "All" ? true : item.status === statusFilter))
    .filter((item) => (dateFilter === "" ? true : item.date === dateFilter));

  const getStatusTone = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Late":
      case "Half Day":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Absent":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "Remote":
        return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
      default:
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isAdmin ? "Attendance Management" : "My Attendance Records"}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {isAdmin
              ? "Track and oversee workplace attendance for all employees"
              : "Review your daily attendance history and check-ins"}
          </p>
        </div>

        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => navigate("/attendance/new")}
        >
          {isAdmin ? "Add Attendance" : "Mark Today's Attendance"}
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {isAdmin ? (
          <input
            type="text"
            placeholder="Search Employee by name..."
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-muted)] flex items-center gap-2">
            <CalendarCheck size={16} className="text-teal-400" />
            <span>Viewing: <strong>{user?.email}</strong></span>
          </div>
        )}

        <select
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
          <option value="Remote">Remote</option>
        </select>

        <input
          type="date"
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-accent"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] surface shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 text-left font-semibold">Employee</th>
              <th className="px-5 py-4 text-left font-semibold">Date</th>
              <th className="px-5 py-4 text-left font-semibold">Status</th>
              {isAdmin && (
                <th className="px-5 py-4 text-center font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-default)]">
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-5 py-8 text-center text-slate-500">
                  Loading attendance records...
                </td>
              </tr>
            ) : filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-5 py-8 text-center text-slate-500">
                  No attendance entries found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[var(--bg-subtle)]"
                >
                  <td className="px-5 py-4 font-medium text-[var(--text-primary)]">
                    {item.employeeName || "Employee"}
                  </td>

                  <td className="px-5 py-4 text-[var(--text-secondary)]">
                    {item.date}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusTone(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => navigate(`/attendance/${item.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => deleteAttendance(item.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { attendanceService } from "@/services";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttendanceRecord } from "@/types";
import toast from "react-hot-toast";

export default function Attendance() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
  loadAttendance();
}, []);

  const loadAttendance = () => {
  attendanceService
    .list()
    .then(setAttendance)
    .catch(console.error);
};

const deleteAttendance = async (id: string) => {
  if (!confirm("Delete this attendance?")) return;

  try {
    await attendanceService.remove(id);

    toast.success("Attendance Deleted");

    loadAttendance();
  } catch {
    toast.error("Delete Failed");
  }
};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">

  <h1 className="text-2xl font-bold">
    Attendance Management
  </h1>

  <Button
    leftIcon={<Plus size={16} />}
    onClick={() => navigate("/attendance/new")}
  >
    Add Attendance
  </Button>
  <div className="my-4">
  <input
    type="text"
    placeholder="Search Employee..."
    className="w-full rounded-lg border p-3"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
<div className="my-4">
  <select
    className="w-full rounded-lg border p-3"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Status</option>
    <option value="Present">Present</option>
    <option value="Absent">Absent</option>
    <option value="Leave">Leave</option>
    <option value="Late">Late</option>
    <option value="Half Day">Half Day</option>
    <option value="Remote">Remote</option>
  </select>
</div>

<div className="my-4">
  <input
    type="date"
    className="w-full rounded-lg border p-3"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
  />
</div>

</div>

      <div className="overflow-x-auto rounded-xl border mt-5">
  <table className="min-w-full">
    <thead className="bg-gray-100">
  <tr>
    <th className="px-4 py-3 text-left">Employee</th>
    <th className="px-4 py-3 text-left">Date</th>
    <th className="px-4 py-3 text-left">Status</th>
    <th className="px-4 py-3 text-left">Action</th>
  </tr>
</thead>

    <tbody>
  {attendance
  .filter((item) =>item.employeeName.toLowerCase().includes(search.toLowerCase()) )
  .filter((item) =>statusFilter === "All" ? true : item.status === statusFilter )
  .filter((item) => dateFilter === "" ? true : item.date === dateFilter)
  .map((item) => (
      <tr
        key={item.id}
        className="border-t hover:bg-gray-50"
      >
        <td className="px-4 py-3">
          {item.employeeName}
        </td>

        <td className="px-4 py-3">
          {item.date}
        </td>

        <td className="px-4 py-3">
          {item.status}
        </td>

        <td className="px-4 py-3 flex gap-2">
          <Button
            onClick={() =>
              navigate(`/attendance/${item.id}/edit`)
            }
          >
            Edit
          </Button>

          <Button
            onClick={() =>
              deleteAttendance(item.id)
            }
          >
            Delete
          </Button>
        </td>
      </tr>
    ))}
</tbody>
  </table>
</div>
    </div>
  );
}
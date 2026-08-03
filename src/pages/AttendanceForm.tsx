import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { attendanceService } from "@/services";

type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Half Day"
  | "Remote";

export default function AttendanceForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] =
    useState<AttendanceStatus>("Present");

  const navigate = useNavigate();

  async function saveAttendance() {
    if (!employeeName || !date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await attendanceService.create({
        employeeName,
        date,
        status,
      });

      toast.success("Attendance Added Successfully");

      navigate("/attendance");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Add Attendance
      </h1>

      <div className="space-y-5">

        <div>
          <label htmlFor="employeeName" className="block mb-2 font-medium">
            Employee Name
          </label>

          <input
            id="employeeName"
            type="text"
            className="w-full border rounded-lg p-3"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2 font-medium">
            Date
          </label>

          <input
            id="date"
            type="date"
            className="w-full border rounded-lg p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="status" className="block mb-2 font-medium">
            Status
          </label>

          <select
            id="status"
            className="w-full border rounded-lg p-3"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as AttendanceStatus)
            }
          >
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="pt-4">
          <Button onClick={saveAttendance}>
            Save Attendance
          </Button>
        </div>

      </div>
    </div>
  );
}
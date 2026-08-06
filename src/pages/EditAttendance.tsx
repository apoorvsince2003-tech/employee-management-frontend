import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { attendanceService } from "@/services";
import { Button } from "@/components/ui/Button";

export default function EditAttendance() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeName: "",
    date: "",
    status: "Present" as
      | "Present"
      | "Late"
      | "Absent"
      | "Half Day"
      | "Remote",
});

  useEffect(() => {

    if (!id) return;

    attendanceService.getById(id).then((data) => {

      setForm({
        employeeName: data.employeeName,
        date: data.date,
        status: data.status,
      });

    });

  }, [id]);

  function save() {

    if (!id) return;

    attendanceService
      .update(id, form)
      .then(() => {

        toast.success("Attendance Updated");

        navigate("/attendance");

      })
      .catch(() => {

        toast.error("Update Failed");

      });

  }

  return (

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">

        Edit Attendance

      </h1>

      <div className="space-y-5">

        <div>

          <label>Employee</label>

          <input

            className="w-full border rounded-lg p-3"

            value={form.employeeName}

            onChange={(e)=>

              setForm({

                ...form,

                employeeName:e.target.value

              })

            }

          />

        </div>

        <div>

          <label>Date</label>

          <input

            type="date"

            className="w-full border rounded-lg p-3"

            value={form.date}

            onChange={(e)=>

              setForm({

                ...form,

                date:e.target.value

              })

            }

          />

        </div>

        <div>

          <label>Status</label>

          <select

            className="w-full border rounded-lg p-3"

            value={form.status}

            onChange={(e)=>

              setForm({

                ...form,

                status: e.target.value as
  | "Present"
  | "Late"
  | "Absent"
  | "Half Day"
  | "Remote"

              })

            }

          >

            <option>Present</option>

            <option>Absent</option>

            <option>Late</option>

            <option>Half Day</option>

            <option>Remote</option>

          </select>

        </div>

        <Button onClick={save}>

          Update Attendance

        </Button>

      </div>

    </div>

  );

}
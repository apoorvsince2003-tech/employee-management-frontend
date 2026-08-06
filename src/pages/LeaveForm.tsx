import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { employeeService, leaveService } from "@/services";

import { Button } from "@/components/ui";

export default function LeaveForm() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState<any[]>([]);

  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    fromDate: "",
    toDate: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    employeeService.list().then(setEmployees);
  }, []);

  function submit(e: React.FormEvent) {

    e.preventDefault();

    leaveService
      .create(form)
      .then(() => {

        toast.success("Leave Applied Successfully");

        navigate("/leaves");

      })
      .catch(() => {

        toast.error("Failed to Apply Leave");

      });
  }

  return (

    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">

        Apply Leave

      </h2>

      <form onSubmit={submit} className="space-y-4">

        <div>

          <label>Employee</label>

          <select

            className="w-full border rounded p-2"

            value={form.employeeId}

            onChange={(e) => {

              const emp = employees.find(
                (x) => String(x.id) === e.target.value
              );

              setForm({

                ...form,

                employeeId: e.target.value,

                employeeName:
                  emp.firstName + " " + emp.lastName,

              });

            }}

          >

            <option value="">Select Employee</option>

            {employees.map((emp) => (

              <option
                key={emp.id}
                value={emp.id}
              >

                {emp.firstName} {emp.lastName}

              </option>

            ))}

          </select>

        </div>

        <div>

          <label>From Date</label>

          <input

            type="date"

            className="w-full border rounded p-2"

            value={form.fromDate}

            onChange={(e) =>
              setForm({
                ...form,
                fromDate: e.target.value,
              })
            }

          />

        </div>

        <div>

          <label>To Date</label>

          <input

            type="date"

            className="w-full border rounded p-2"

            value={form.toDate}

            onChange={(e) =>
              setForm({
                ...form,
                toDate: e.target.value,
              })
            }

          />

        </div>

        <div>

          <label>Reason</label>

          <textarea

            className="w-full border rounded p-2"

            value={form.reason}

            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }

          />

        </div>

        <Button type="submit">

          Apply Leave

        </Button>

      </form>

    </div>

  );

}
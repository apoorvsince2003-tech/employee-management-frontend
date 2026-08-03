import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { employeeService } from "@/services/employeeService";
import { departmentService } from "@/services/departmentService";
import { leaveService } from "@/services/leaveService";
import {
  Users,
  Wallet,
  CalendarCheck,
  CalendarDays,
  Download,
} from "lucide-react";

export default function Reports() {
  const [employees, setEmployees] = useState<any[]>([]);
const [departments, setDepartments] = useState<any[]>([]);
const [leaves, setLeaves] = useState<any[]>([]);
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const emp = await employeeService.list();
    const dept = await departmentService.list();
    const leave = await leaveService.list();

    setEmployees(emp);
    setDepartments(dept);
    setLeaves(leave);
  } catch (err) {
  console.error(err);

  toast.error("Unable to load report data.");
}
};const totalEmployees = employees.length;

const totalDepartments = departments.length;

const pendingLeaves = leaves.filter(
  (l) => l.status === "Pending"
).length;

const totalSalary = employees.reduce(
  (sum, e) => sum + Number(e.salary || 0),
  0
);

  
  const downloadReport = (name: string) => {

  const content =
`APSARA HR REPORT

Report : ${name}

Generated :
${new Date().toLocaleString()}

Thank you for using APSARA`;

  const blob = new Blob([content], {
    type: "text/plain",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = `${name}.txt`;

  a.click();

  window.URL.revokeObjectURL(url);
};

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Reports
        </h1>
        <div className="grid grid-cols-4 gap-4 my-6">

<div className="border rounded-xl p-5 shadow">
<h3>Total Employees</h3>
<h1 className="text-3xl font-bold">
{totalEmployees}
</h1>
</div>

<div className="border rounded-xl p-5 shadow">
<h3>Total Departments</h3>
<h1 className="text-3xl font-bold">
{totalDepartments}
</h1>
</div>

<div className="border rounded-xl p-5 shadow">
<h3>Pending Leaves</h3>
<h1 className="text-3xl font-bold">
{pendingLeaves}
</h1>
</div>

<div className="border rounded-xl p-5 shadow">
<h3>Total Salary</h3>
<h1 className="text-3xl font-bold">
₹ {totalSalary.toLocaleString()}
</h1>
</div>

</div>

        <p className="text-[var(--text-secondary)] mt-2">
          Download reports for employees, salary, attendance and leave management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow p-5">
          <Users className="text-blue-600 mb-3" size={34} />

          <h2 className="font-semibold text-lg">
            Employees Report
          </h2>

          <p className="text-gray-500 mt-2">
            Download complete employee information.
          </p>

          <button
onClick={() => downloadReport("Employee Report")}
className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
>
Download
</button>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow p-5">
          <Wallet className="text-green-600 mb-3" size={34} />

          <h2 className="font-semibold text-lg">
            Salary Report
          </h2>

          <p className="text-gray-500 mt-2">
            Monthly salary and payroll summary.
          </p>

          <button
            onClick={() => downloadReport("Salary Report")}
            className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow p-5">
          <CalendarCheck className="text-purple-600 mb-3" size={34} />

          <h2 className="font-semibold text-lg">
            Attendance Report
          </h2>

          <p className="text-gray-500 mt-2">
            Attendance and working day summary.
          </p>

          <button
            onClick={() => downloadReport("Attendance Report")}
            className="mt-5 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow p-5">
          <CalendarDays className="text-red-600 mb-3" size={34} />

          <h2 className="font-semibold text-lg">
            Leave Report
          </h2>

          <p className="text-gray-500 mt-2">
            Leave history and approval summary.
          </p>

          <button
            onClick={() => downloadReport("Leave Report")}
            className="mt-5 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            Download
          </button>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow p-5">

<h2 className="text-xl font-bold mb-4">
Recent Reports
</h2>

<table className="w-full">

<thead>

<tr className="border-b">

<th className="text-left py-3">
Report
</th>

<th className="text-left">
Status
</th>

<th className="text-left">
Date
</th>

<th className="text-right">
Action
</th>

</tr>

</thead>

<tbody>

<tr className="border-b">

<td className="py-3">
Employee Report
</td>

<td className="text-green-600">
Ready
</td>

<td>
{new Date().toLocaleDateString()}
</td>

<td className="text-right">

<button
onClick={() => downloadReport("Employee Report")}
className="bg-blue-600 text-white px-3 py-1 rounded"
>
Download
</button>

</td>

</tr>

<tr className="border-b">

<td className="py-3">
Salary Report
</td>

<td className="text-green-600">
Ready
</td>

<td>
{new Date().toLocaleDateString()}
</td>

<td className="text-right">

<button
onClick={() => downloadReport("Salary Report")}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Download
</button>

</td>

</tr>

<tr className="border-b">

<td className="py-3">
Attendance Report
</td>

<td className="text-green-600">
Ready
</td>

<td>
{new Date().toLocaleDateString()}
</td>

<td className="text-right">

<button
onClick={() => downloadReport("Attendance Report")}
className="bg-purple-600 text-white px-3 py-1 rounded"
>
Download
</button>

</td>

</tr>

<tr>

<td className="py-3">
Leave Report
</td>

<td className="text-green-600">
Ready
</td>

<td>
{new Date().toLocaleDateString()}
</td>

<td className="text-right">

<button
onClick={() => downloadReport("Leave Report")}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Download
</button>

</td>

</tr>

</tbody>

</table>

</div>

      </div>

    </div>
    
  );
}
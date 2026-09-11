import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  employeeService,
  departmentService,
} from "@/services";
import type { Department } from "@/types";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    departmentId: "",
    departmentName: "",
    designation: "",
    employmentType: "Full-time" as const,
    status: "active" as any,
    salary: 0,
    joinDate: "",
    location: "",
    managerId: "",
    managerName: "",
  });

  useEffect(() => {
    departmentService
      .list()
      .then((res: any) => {
        if (Array.isArray(res)) {
          setDepartments(res);
        } else if (Array.isArray(res?.data)) {
          setDepartments(res.data);
        } else {
          setDepartments([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load departments:", err);
        setDepartments([]);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const saveEmployee = async () => {
    if (!employee.firstName || !employee.email) {
      toast.error("Please fill required fields (Name & Email)");
      return;
    }

    setLoading(true);
    try {
      await employeeService.create(employee as any);
      toast.success("Employee Added & Account Created Successfully");
      navigate("/employees");
    } catch (err: any) {
      console.error("Save employee error:", err);
      toast.error(err?.message || "Failed to Add Employee");
    } finally {
      setLoading(false);
    }
  };

  const departmentList = Array.isArray(departments) ? departments : [];

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-xl">
      <h1 className="text-3xl font-bold mb-4">Add Employee</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Employee Code / ID</label>
          <input
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="employeeCode"
            placeholder="e.g. EMP101"
            value={employee.employeeCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Initial Login Password</label>
          <input
            type="password"
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="password"
            placeholder="e.g. Welcome@123"
            value={employee.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">First Name *</label>
          <input
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="firstName"
            placeholder="First Name"
            value={employee.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Last Name</label>
          <input
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="lastName"
            placeholder="Last Name"
            value={employee.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Email *</label>
          <input
            type="email"
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="email"
            placeholder="name@company.com"
            value={employee.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
          <input
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="phone"
            placeholder="Phone Number"
            value={employee.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Designation</label>
          <input
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="designation"
            placeholder="e.g. Software Engineer"
            value={employee.designation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Department</label>
          <select
            className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
            name="departmentId"
            value={employee.departmentId}
            onChange={(e) => {
              const dept = departmentList.find((d) => String(d.id) === e.target.value);
              setEmployee({
                ...employee,
                departmentId: e.target.value,
                departmentName: dept?.name ?? "",
              });
            }}
          >
            <option value="">Select Department</option>
            {departmentList.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Salary</label>
        <input
          type="number"
          className="apsara-input w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
          name="salary"
          placeholder="Salary"
          value={employee.salary || ""}
          onChange={(e) => setEmployee({ ...employee, salary: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <button
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-semibold text-white transition-all disabled:opacity-50"
        onClick={saveEmployee}
      >
        {loading ? "Saving..." : "Save Employee"}
      </button>
    </div>
  );
}
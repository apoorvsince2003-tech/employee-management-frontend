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

  const [employee, setEmployee] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    departmentName: "",
    designation: "",
    employmentType: "Full-time" as const,
    status: "Active",
    salary: 0,
    joinDate: "",
    location: "",
    managerId: "",
    managerName: "",
  });
  useEffect(() => {
  departmentService
    .list()
    .then(setDepartments)
    .catch(console.error);
}, []);
  const handleChange = (e: any) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const saveEmployee = async () => {
    try {
      await employeeService.create(employee);
      toast.success("Employee Added Successfully");
      navigate("/employees");
    } catch (err: any) {
  console.log(err);
  console.log(err.response);
  console.log(err.response?.data);
  toast.error("Failed to Add Employee");
}
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      <h1 className="text-3xl font-bold">
        Add Employee
      </h1>

      <input
        className="apsara-input w-full"
        name="employeeCode"
        placeholder="Employee Code"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        className="apsara-input w-full"
        name="phone"
        placeholder="Phone Number"
        value={employee.phone}
        onChange={handleChange}
       />

       <select
  className="apsara-input w-full"
  name="departmentId"
  value={employee.departmentId}
  onChange={(e) => {
    const dept = departments.find(
      (d) => String(d.id) === e.target.value
    );

    setEmployee({
      ...employee,
      departmentId: e.target.value,
      departmentName: dept?.name ?? "",
    });
  }}
>
  <option value="">Select Department</option>

  {departments.map((dept) => (
    <option key={dept.id} value={dept.id}>
      {dept.name}
    </option>
  ))}
</select>

      <button
        className="px-5 py-2 rounded-xl bg-teal-600 text-white"
        onClick={saveEmployee}
      >
        Save Employee
      </button>

    </div>
  );
}
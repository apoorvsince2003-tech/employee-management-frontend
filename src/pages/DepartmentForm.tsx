import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { departmentService } from "@/services";

export default function DepartmentForm() {

  const navigate = useNavigate();

  const [department, setDepartment] = useState({
    name: "",
    code: "",
    description: "",
    headId: "",
    headName: "",
    employeeCount: 0,
    budget: 0,
    establishedDate: "",
    color: "#00BFA6",
  });

  const handleChange = (e: any) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

  const saveDepartment = async () => {

  console.log("Sending Department:", department);

  try {

    await departmentService.create({

      ...department,

      employeeCount: Number(department.employeeCount || 0),

      budget: Number(department.budget || 0),

    });

    toast.success("Department Added Successfully");

    navigate("/departments");

  } catch (err) {

    console.error(err);

    toast.error("Failed to Add Department");

  }

};

  return (

    <div className="max-w-3xl mx-auto space-y-4">

      <h1 className="text-3xl font-bold">
        Add Department
      </h1>

      <input
        className="apsara-input w-full"
        name="name"
        placeholder="Department Name"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        name="code"
        placeholder="Department Code"
        onChange={handleChange}
      />

      <textarea
        className="apsara-input w-full"
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        name="headName"
        placeholder="Department Head"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        type="number"
        name="budget"
        placeholder="Budget"
        onChange={handleChange}
      />

      <input
        className="apsara-input w-full"
        type="date"
        name="establishedDate"
        onChange={handleChange}
      />

      <button
        className="px-5 py-2 rounded-xl bg-teal-600 text-white"
        onClick={saveDepartment}
      >
        Save Department
      </button>

    </div>

  );

}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { departmentService } from "@/services";


export default function DepartmentForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

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

  useEffect(() => {

  if (!isEdit || !id) return;

  const loadDepartment = async () => {

    try {

      const data = await departmentService.getById(id);

      setDepartment({
        name: data.name,
        code: data.code,
        description: data.description,
        headId: data.headId || "",
        headName: data.headName || "",
        employeeCount: data.employeeCount,
        budget: data.budget,
        establishedDate: data.establishedDate,
        color: data.color,
      });

    } catch (err) {

      console.error(err);

      toast.error("Failed to Load Department");

    }

  };

  loadDepartment();

}, [id, isEdit]);

  const handleChange = (e: any) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    });
  };

 const saveDepartment = async () => {

  const payload = {
    name: department.name,
    code: department.code,
    description: department.description,
    headId: department.headId || "",
    headName: department.headName || "",
    employeeCount: Number(department.employeeCount),
    budget: Number(department.budget),
    establishedDate: department.establishedDate,
    color: department.color,
  };

  try {

    if (isEdit && id) {

      await departmentService.update(id, payload);

      toast.success("Department Updated Successfully");

    } else {

      await departmentService.create(payload);

      toast.success("Department Added Successfully");

    }

    navigate("/departments");

  } catch (err) {

    console.error(err);

    toast.error(isEdit ? "Failed to Update Department" : "Failed to Add Department");

  }

};

  return (

    <div className="max-w-3xl mx-auto space-y-4">

      <h1 className="text-3xl font-bold">
  {isEdit ? "Edit Department" : "Add Department"}
</h1>

      <input
  className="apsara-input w-full"
  name="name"
  value={department.name}
  placeholder="Department Name"
  onChange={handleChange}
/>

      <input
  className="apsara-input w-full"
  name="code"
  placeholder="Department Code"
  value={department.code}
  onChange={handleChange}
/>

      <textarea
  className="apsara-input w-full"
  name="description"
  placeholder="Description"
  value={department.description}
  onChange={handleChange}
/>

      <input
  className="apsara-input w-full"
  name="headName"
  placeholder="Department Head"
  value={department.headName}
  onChange={handleChange}
/>

      <input
  className="apsara-input w-full"
  type="number"
  name="budget"
  placeholder="Budget"
  value={department.budget}
  onChange={handleChange}
/>

      <input
  className="apsara-input w-full"
  type="date"
  name="establishedDate"
  value={department.establishedDate}
  onChange={handleChange}
/>

      <button
        className="px-5 py-2 rounded-xl bg-teal-600 text-white"
        onClick={saveDepartment}
      >
        {isEdit ? "Update Department" : "Save Department"}
      </button>

    </div>

  );

}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { holidayService } from "@/services";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";

export default function HolidayForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    holidayName: "",
    holidayDate: "",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await holidayService.create(form);

      toast.success("Holiday Added Successfully");

      navigate("/holidays");
    } catch {
      toast.error("Failed to Add Holiday");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Add Holiday"
        description="Create Company Holiday"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >

        <input
          name="holidayName"
          placeholder="Holiday Name"
          value={form.holidayName}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="date"
          name="holidayDate"
          value={form.holidayDate}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border p-3"
        />

        <Button
          loading={loading}
          type="submit"
        >
          Save Holiday
        </Button>

      </form>

    </div>
  );
}
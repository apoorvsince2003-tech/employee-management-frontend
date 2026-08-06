import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { holidayService } from "@/services";

import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function EditHoliday() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    holidayName: "",
    holidayDate: "",
    description: "",
  });

  useEffect(() => {

    holidayService
      .getById(id!)
      .then((data: any) => {

        setForm(data);

        setLoading(false);

      })
      .catch(() => {

        setError("Failed to load holiday");

        setLoading(false);

      });

  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setSaving(true);

      await holidayService.update(id!, form);

      toast.success("Holiday Updated");

      navigate("/holidays");

    } catch {

      toast.error("Update Failed");

    } finally {

      setSaving(false);

    }

  }

  if (loading)
    return <LoadingState label="Loading Holiday..." />;

  if (error)
    return (
      <ErrorState
        title="Error"
        description={error}
      />
    );

  return (

    <div className="space-y-6">

      <PageHeader
        title="Edit Holiday"
        description="Update Holiday"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >

        <input
          name="holidayName"
          value={form.holidayName}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="date"
          name="holidayDate"
          value={form.holidayDate}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          rows={5}
        />

        <Button
          loading={saving}
          type="submit"
        >
          Update Holiday
        </Button>

      </form>

    </div>

  );

}
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { noticeService } from '@/services';

import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';

export default function EditNotice() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [form, setForm] = useState<{
  title: string;
  content: string;
  category: "Announcement" | "Policy" | "Event" | "Urgent" | "General";
  author: string;
  publishedDate: string;
  priority: "High" | "Medium" | "Low";
  pinned: boolean;
}>({
  title: "",
  content: "",
  category: "Announcement",
  author: "",
  publishedDate: "",
  priority: "Medium",
  pinned: false,
});

  useEffect(() => {

    noticeService
      .getById(id!)
      .then((data) => {

        setForm(data);

        setLoading(false);

      })
      .catch(() => {

        setError('Failed to load notice');

        setLoading(false);

      });

  }, [id]);

  function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  const { name, value } = e.target;

  if (name === "category") {
    setForm((prev) => ({
      ...prev,
      category: value as
        | "Announcement"
        | "Policy"
        | "Event"
        | "Urgent"
        | "General",
    }));
    return;
  }

  if (name === "priority") {
    setForm((prev) => ({
      ...prev,
      priority: value as "High" | "Medium" | "Low",
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
}

  async function handleSubmit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      setSaving(true);

      await noticeService.update(id!, form);

      toast.success('Notice Updated');

      navigate('/notices');

    } catch {

      toast.error('Update Failed');

    } finally {

      setSaving(false);

    }
  }

  if (loading)
    return <LoadingState label="Loading Notice..." />;

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
        title="Edit Notice"
        description="Update Notice"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          rows={5}
        />

        <select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full rounded-lg border p-3"
>
  <option value="Announcement">Announcement</option>
  <option value="Policy">Policy</option>
  <option value="Event">Event</option>
  <option value="Urgent">Urgent</option>
  <option value="General">General</option>
</select>

        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="date"
          name="publishedDate"
          value={form.publishedDate}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <Button
          loading={saving}
          type="submit"
        >
          Update Notice
        </Button>

      </form>

    </div>
  );
}
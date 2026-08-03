import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { noticeService } from '@/services';

import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/shared/PageHeader';

export default function NoticeForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await noticeService.create(form);

      toast.success('Notice Created Successfully');

      navigate('/notices');

    } catch (err) {
      toast.error('Failed to create notice');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Create Notice"
        description="Publish a new notice"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          rows={5}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <input
          name="author"
          placeholder="Author"
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
          loading={loading}
          type="submit"
        >
          Create Notice
        </Button>

      </form>

    </div>
  );
}
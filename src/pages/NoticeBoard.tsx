import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  User,
  Pin,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { noticeService } from '@/services';
import type { Notice } from '@/types';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';

export default function NoticeBoard() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    setError(null);

    noticeService
      .list()
      .then((data) => {
        setNotices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load notices');
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) =>
      (
        n.title +
        ' ' +
        n.content +
        ' ' +
        n.author
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, notices]);

  if (loading)
    return <LoadingState label="Loading Notices..." />;

  if (error)
    return (
      <ErrorState
        title="Couldn't load notices"
        description={error}
        onRetry={load}
      />
    );

  return (
    <div className="space-y-6">

      <PageHeader
        title="Notice Board"
        description={`${filteredNotices.length} Notices Available`}
        actions={
          <Button
           leftIcon={<Plus size={16} />}
           onClick={() => navigate('/notices/new')}
         >
           New Notice
         </Button>
        }
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search notices..."
      />
            {filteredNotices.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={28} />}
          title="No Notices Found"
          description="There are no notices available."
        />
      ) : (
        <div className="grid gap-5">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">

                <div className="space-y-2">

                  <div className="flex items-center gap-2">

                    {notice.pinned && (
                      <Pin
                        size={16}
                        className="text-red-500"
                      />
                    )}

                    <h2 className="text-lg font-semibold">
                      {notice.title}
                    </h2>

                  </div>

                  <p className="text-gray-600">
                    {notice.content}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">

                    <div className="flex items-center gap-1">
                      <User size={15} />
                      {notice.author}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar size={15} />
                      {notice.publishedDate}
                    </div>

                  </div>

                </div>

                <div className="flex flex-col gap-2">

                  <Badge
                    tone={
                      notice.priority === 'High'
                        ? 'error'
                        : notice.priority === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {notice.priority}
                  </Badge>

                  <Badge tone="info">
                    {notice.category}
                  </Badge>

                  <div className="mt-4 flex gap-2">

  <Button
    size="sm"
    variant="outline"
    onClick={() => navigate(`/notices/edit/${notice.id}`)}
  >
    Edit
  </Button>

  <Button
    size="sm"
    variant="outline"
    onClick={async () => {

      if (!confirm("Delete this notice?")) return;

      try {

        await noticeService.remove(String(notice.id));

        toast.success("Notice Deleted");

        load();

      } catch {

        toast.error("Delete Failed");

      }

    }}
  >
    Delete
  </Button>

</div>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
          </div>
  );
}
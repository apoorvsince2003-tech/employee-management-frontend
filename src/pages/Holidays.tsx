import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { holidayService } from '@/services';
import type { Holiday } from '@/types';
import { useNavigate } from "react-router-dom";

import { Button, Badge, StatCard } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';

export default function Holidays() {
  const navigate = useNavigate();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);

    holidayService
      .list()
      .then((data) => {
        setHolidays(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  async function deleteHoliday(id: string) {

  if (!confirm("Delete this holiday?")) return;

  try {

    await holidayService.remove(id);

    toast.success("Holiday Deleted");

    load();

  } catch {

    toast.error("Delete Failed");

  }

}

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return holidays.filter((h) =>
      `${h.holidayName} ${h.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [holidays, search]);

  if (loading) {
    return <LoadingState label="Loading Holidays..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load holidays"
        description={error}
        onRetry={load}
      />
    );
  }  return (
    <div className="space-y-6">

      <PageHeader
        title="Holiday Management"
        description={`${filtered.length} Holidays Available`}
        actions={
          <Button
  leftIcon={<Plus size={16} />}
  onClick={() => navigate("/holidays/new")}
>
  Add Holiday
</Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          index={0}
          icon={<CalendarDays size={20} />}
          label="Total Holidays"
          value={holidays.length}
          supportingText="Company Holidays"
          accentColor="#00BFA6"
        />

        <StatCard
         index={1}
         icon={<CalendarDays size={20} />}
         label="Upcoming"
         value={holidays.length}
         supportingText="Upcoming Holidays"
         accentColor="#12B76A"
       />

        <StatCard
         index={2}
         icon={<CalendarDays size={20} />}
         label="Events"
         value={holidays.length}
         supportingText="Holiday Calendar"
         accentColor="#F79009"
       />
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Holiday..."
      />

      {filtered.length === 0 ? (

        <EmptyState
          icon={<CalendarDays size={28} />}
          title="No Holidays Found"
          description="No holiday matches your search."
        />

      ) : (

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>
                <th className="px-5 py-4 text-left">Holiday</th>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-left">Description</th>
                <th className="px-5 py-4 text-left">Action</th>
                <th className="px-5 py-4 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((holiday) => (

                <tr
                  key={holiday.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium">
                    {holiday.holidayName}
                  </td>

                  <td className="px-5 py-4">
                    {holiday.holidayDate}
                  </td>

                  <td className="px-5 py-4">
                    {holiday.description}
                  </td>

                  <td className="px-5 py-4">
                     Actions
                  </td>
                  <td className="px-5 py-4">

  <div className="flex gap-2">

    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        navigate(`/holidays/edit/${holiday.id}`)
      }
    >
      Edit
    </Button>

    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        deleteHoliday(String(holiday.id))
      }
    >
      Delete
    </Button>

  </div>

</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}
          </div>
  );
}
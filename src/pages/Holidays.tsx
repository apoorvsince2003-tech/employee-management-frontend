import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { holidayService } from '@/services';
import type { Holiday } from '@/types';

import { Button, Badge, StatCard } from '@/components/ui';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

import { PageHeader } from '@/components/shared/PageHeader';
import { SearchBar } from '@/components/shared/SearchBar';

export default function Holidays() {
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

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return holidays.filter((h) =>
      `${h.name} ${h.description}`
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
          <Button leftIcon={<Plus size={16} />}>
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
          label="National"
          value={holidays.filter(h => h.type === "National").length}
          supportingText="National Holidays"
          accentColor="#12B76A"
        />

        <StatCard
          index={2}
          icon={<CalendarDays size={20} />}
          label="Optional"
          value={holidays.filter(h => h.isOptional).length}
          supportingText="Optional Holidays"
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
                <th className="px-5 py-4 text-left">Type</th>
                <th className="px-5 py-4 text-left">Optional</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((holiday) => (

                <tr
                  key={holiday.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium">
                    {holiday.name}
                  </td>

                  <td className="px-5 py-4">
                    {holiday.date}
                  </td>

                  <td className="px-5 py-4">

                    <Badge tone="info">
                      {holiday.type}
                    </Badge>

                  </td>

                  <td className="px-5 py-4">
                    {holiday.isOptional ? "Yes" : "No"}
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
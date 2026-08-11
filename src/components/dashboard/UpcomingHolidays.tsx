import { motion } from 'framer-motion';
import { PartyPopper, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Holiday } from '@/types';
import { formatDate, daysUntil, cn } from '@/utils';

type HolidayType = 'National' | 'Company' | 'Regional';

type BackendHoliday = {
  id: number | string;
  holidayDate?: string;
  holidayName?: string;
  description?: string;
  type?: HolidayType;
};

const typeTone: Record<HolidayType, string> = {
  National: 'bg-brand-accent/10 text-mint-700 dark:text-mint-300',
  Company: 'bg-brand-primary/10 text-brand-primary dark:text-brand-secondary',
  Regional: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
};

export function UpcomingHolidays({
  holidays,
}: {
  holidays: Holiday[];
}) {
  return (
    <div className="rounded-2xl surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-secondary text-brand-accent dark:bg-mint-600/15">
            <PartyPopper size={16} />
          </span>

          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Upcoming Holidays
            </h3>

            <p className="text-xs text-[var(--text-secondary)]">
              Next company & national breaks
            </p>
          </div>
        </div>

        <Link
          to="/holidays"
          className="text-xs font-medium text-brand-accent hover:underline"
        >
          View all
        </Link>
      </div>

      <ul className="space-y-2">
        {holidays.map((h, i) => {
          /*
           * Backend returns:
           * holidayDate
           * holidayName
           *
           * while the frontend Holiday type may use:
           * date
           * name
           *
           * So we normalize the backend response here.
           */
          const holiday = h as unknown as BackendHoliday;

          const holidayDate = holiday.holidayDate ?? '';
          const holidayName = holiday.holidayName ?? 'Holiday';

          const holidayType: HolidayType =
            holiday.type === 'National' ||
            holiday.type === 'Regional' ||
            holiday.type === 'Company'
              ? holiday.type
              : 'Company';

          const days = holidayDate
            ? daysUntil(holidayDate)
            : 0;

          return (
            <Link
              key={holiday.id ?? i}
              to="/holidays"
            >
              <motion.li
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border-default)] p-3 transition-colors hover:border-brand-accent/30 hover:bg-[var(--bg-subtle)]"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-secondary/60 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300">
                  <CalendarDays size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {holidayName}
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    {holidayDate ? formatDate(holidayDate) : 'Date unavailable'}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      typeTone[holidayType]
                    )}
                  >
                    {holidayType}
                  </span>

                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {days === 0
                      ? 'Today'
                      : days === 1
                        ? 'Tomorrow'
                        : `in ${days}d`}
                  </span>
                </div>
              </motion.li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
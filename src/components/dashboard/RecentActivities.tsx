import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  CalendarDays,
  TrendingUp,
  FolderKanban,
  Megaphone,
  Wallet,
  PartyPopper,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { Activity } from '@/types';
import { relativeTime, cn } from '@/utils';

const typeMeta: Record<Activity['type'], { icon: LucideIcon; color: string; link: string }> = {
  employee: { icon: UserPlus, color: 'bg-mint-600/10 text-mint-600 dark:text-mint-300', link: '/employees' },
  leave: { icon: CalendarDays, color: 'bg-warning-500/10 text-warning-600 dark:text-warning-100', link: '/leaves' },
  promotion: { icon: TrendingUp, color: 'bg-success-500/10 text-success-600 dark:text-success-100', link: '/promotions' },
  project: { icon: FolderKanban, color: 'bg-sky-500/10 text-sky-600 dark:text-sky-100', link: '/projects' },
  notice: { icon: Megaphone, color: 'bg-brand-primary/10 text-brand-primary dark:text-brand-secondary', link: '/notices' },
  salary: { icon: Wallet, color: 'bg-mint-600/10 text-mint-700 dark:text-mint-300', link: '/salary' },
  holiday: { icon: PartyPopper, color: 'bg-error-500/10 text-error-600 dark:text-error-100', link: '/holidays' },
};

export function RecentActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-2xl surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Recent Activity</h3>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Latest updates across APSARA</p>
        </div>
        <Link
          to="/employees"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:underline"
        >
          View all
          <ArrowUpRight size={13} />
        </Link>
      </div>
      <ul className="space-y-1">
        {activities.map((activity, i) => {
          const meta = typeMeta[activity.type];
          return (
            <Link key={activity.id} to={meta.link}>
              <motion.li
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group flex cursor-pointer gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--bg-subtle)]"
              >
                <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', meta.color)}>
                  <meta.icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-brand-accent">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{activity.description}</p>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    {activity.actor} · {relativeTime(activity.timestamp)}
                  </p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="mt-1 shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </motion.li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

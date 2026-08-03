import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  supportingText?: string;
  trend?: { value: string; direction: 'up' | 'down' };
  accentColor?: string;
  index?: number;
  to?: string;
}

export function StatCard({
  icon,
  label,
  value,
  supportingText,
  trend,
  accentColor = '#00BFA6',
  index = 0,
  to,
}: StatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className={cn('card-hover group relative overflow-hidden rounded-2xl surface p-5', to && 'cursor-pointer')}
    >
      {/* accent glow on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${accentColor}1a`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              trend.direction === 'up'
                ? 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-100'
                : 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-100',
            )}
          >
            {trend.direction === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="relative mt-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          {value}
        </p>
        {supportingText && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">{supportingText}</p>
        )}
      </div>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

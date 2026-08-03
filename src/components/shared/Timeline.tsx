import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/utils';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  date?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('relative space-y-1', className)}>
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* connector line */}
          {i < items.length - 1 && (
            <span
              className="absolute left-[19px] top-11 h-[calc(100%-2.5rem)] w-px bg-[var(--border-default)]"
              aria-hidden
            />
          )}
          {/* icon node */}
          <span
            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)]"
            style={item.iconColor ? { color: item.iconColor, borderColor: `${item.iconColor}40` } : undefined}
          >
            {item.icon}
          </span>
          {/* content */}
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                {item.subtitle && (
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{item.subtitle}</p>
                )}
              </div>
              {item.date && (
                <span className="shrink-0 text-xs text-[var(--text-muted)]">{item.date}</span>
              )}
            </div>
            {item.description && (
              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{item.description}</p>
            )}
            {item.meta && <div className="mt-2">{item.meta}</div>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

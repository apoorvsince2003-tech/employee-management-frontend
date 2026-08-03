import type { ReactNode } from 'react';
import { cn } from '@/utils';

type Tone = 'neutral' | 'accent' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type Size = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral:
    'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]',
  accent:
    'bg-mint-600/10 text-mint-700 border-mint-600/20 dark:text-mint-300 dark:bg-mint-600/15',
  primary:
    'bg-brand-primary/8 text-brand-primary border-brand-primary/15 dark:text-brand-secondary dark:bg-brand-secondary/10',
  success:
    'bg-success-50 text-success-700 border-success-500/20 dark:bg-success-500/15 dark:text-success-100',
  warning:
    'bg-warning-50 text-warning-700 border-warning-500/20 dark:bg-warning-500/15 dark:text-warning-100',
  error:
    'bg-error-50 text-error-700 border-error-500/20 dark:bg-error-500/15 dark:text-error-100',
  info: 'bg-sky-50 text-sky-700 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-100',
};

const dotTones: Record<Tone, string> = {
  neutral: 'bg-[var(--text-muted)]',
  accent: 'bg-mint-600',
  primary: 'bg-brand-primary dark:bg-brand-secondary',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-sky-500',
};

export function Badge({ children, tone = 'neutral', size = 'sm', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotTones[tone])} />}
      {children}
    </span>
  );
}

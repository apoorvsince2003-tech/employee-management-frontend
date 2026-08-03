import { type ReactNode, useState } from 'react';
import { cn } from '@/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export function Tabs({ items, value, onChange, className, variant = 'underline' }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={cn('inline-flex gap-1 rounded-xl bg-[var(--bg-subtle)] p-1', className)}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
              value === item.id
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            )}
          >
            {item.icon}
            {item.label}
            {item.badge}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-1 overflow-x-auto no-scrollbar border-b border-[var(--border-default)]', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'relative inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
            value === item.id
              ? 'text-brand-accent'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
        >
          {item.icon}
          {item.label}
          {item.badge}
          {value === item.id && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-accent" />
          )}
        </button>
      ))}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTabs(initial: string) {
  return useState(initial);
}

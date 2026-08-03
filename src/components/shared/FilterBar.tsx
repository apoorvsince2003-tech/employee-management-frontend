import { ChevronDown, Check, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
}

export function FilterSelect({ label, value, options, onChange, icon }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all',
          value
            ? 'border-brand-accent/40 bg-brand-secondary/50 text-brand-primary dark:bg-mint-600/10 dark:text-mint-300'
            : 'border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-brand-accent/30',
        )}
      >
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
        <span className="text-[var(--text-muted)]">{label}:</span>
        <span className="font-semibold">{selected?.label ?? 'All'}</span>
        <ChevronDown size={15} className={cn('text-[var(--text-muted)] transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl surface shadow-card-hover p-1.5"
          >
            <button
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                !value
                  ? 'bg-brand-secondary/60 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
              )}
            >
              All {label}
              {!value && <Check size={14} className="text-brand-accent" />}
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  value === opt.value
                    ? 'bg-brand-secondary/60 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                )}
              >
                {opt.label}
                {value === opt.value && <Check size={14} className="text-brand-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterBarProps {
  children: ReactNode;
  onClear: () => void;
  activeCount: number;
  className?: string;
}

export function FilterBar({ children, onClear, activeCount, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {children}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
        >
          <X size={15} />
          Clear filters
        </button>
      )}
    </div>
  );
}

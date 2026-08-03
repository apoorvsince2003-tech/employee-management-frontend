import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { THEMES, type Theme } from '@/constants';
import { cn } from '@/utils';

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: THEMES.LIGHT, label: 'Light', icon: Sun },
  { value: THEMES.DARK, label: 'Dark', icon: Moon },
  { value: THEMES.SYSTEM, label: 'System', icon: Monitor },
];

interface ThemeSwitcherProps {
  compact?: boolean;
}

export function ThemeSwitcher({ compact }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CurrentIcon = theme === THEMES.SYSTEM ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle theme"
        className={cn(
          'inline-flex items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] transition-all hover:border-brand-accent/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-ring',
          compact ? 'h-9 w-9' : 'h-10 w-10',
        )}
      >
        <CurrentIcon size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl surface shadow-card-hover p-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  theme === opt.value
                    ? 'bg-brand-secondary/60 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                )}
              >
                <opt.icon size={16} />
                <span className="flex-1 text-left">{opt.label}</span>
                {theme === opt.value && <Check size={14} className="text-brand-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

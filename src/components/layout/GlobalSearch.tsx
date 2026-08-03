import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { navItems } from '@/routes/navItems';
import { STORAGE_KEYS } from '@/constants';
import { cn } from '@/utils';

interface SearchResult {
  label: string;
  path: string;
  group: string;
}

function buildIndex(): SearchResult[] {
  return navItems.map((n) => ({ label: n.label, path: n.path, group: 'Pages' }));
}

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.recentSearches) ?? '[]');
  } catch {
    return [];
  }
}

function pushRecent(label: string) {
  const recent = getRecent().filter((r) => r !== label).slice(0, 5);
  recent.unshift(label);
  localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(recent));
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const index = buildIndex();
  const results = query
    ? index.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    setRecent(getRecent());
  }, [open]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function go(path: string, label: string) {
    navigate(path);
    pushRecent(label);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] px-3.5 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-brand-accent/40"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search pages, people…</span>
        <kbd className="hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)] sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl surface shadow-card-hover"
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--border-default)] px-4 py-3">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search APSARA…"
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {!query && recent.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Recent
                  </p>
                  {recent.map((label) => {
                    const item = index.find((i) => i.label === label);
                    if (!item) return null;
                    return (
                      <ResultRow key={item.path} item={item} onClick={() => go(item.path, item.label)} />
                    );
                  })}
                </div>
              )}

              {results.length > 0 ? (
                <div>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Pages
                  </p>
                  {results.map((item) => (
                    <ResultRow key={item.path} item={item} onClick={() => go(item.path, item.label)} />
                  ))}
                </div>
              ) : (
                query && (
                  <div className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                    No results for “{query}”
                  </div>
                )
              )}

              {!query && recent.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-[var(--text-muted)]">
                  Start typing to search across APSARA.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultRow({ item, onClick }: { item: SearchResult; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
        'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
      )}
    >
      <Clock size={15} className="text-[var(--text-muted)]" />
      <span className="flex-1 text-left">{item.label}</span>
      <span className="text-xs text-[var(--text-muted)]">{item.group}</span>
      <ArrowRight size={14} className="text-[var(--text-muted)]" />
    </button>
  );
}

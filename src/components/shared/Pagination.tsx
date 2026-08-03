import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/utils';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}>
      <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        <span>
          {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-subtle)] px-2 text-xs text-[var(--text-primary)] focus:border-brand-accent/50 focus:outline-none"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <PageButton onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">
            <ChevronsLeft size={16} />
          </PageButton>
          <PageButton onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft size={16} />
          </PageButton>
          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-2 text-sm text-[var(--text-muted)]">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  'h-9 min-w-9 rounded-lg px-2.5 text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                )}
              >
                {p}
              </button>
            ),
          )}
          <PageButton onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
            <ChevronRight size={16} />
          </PageButton>
          <PageButton onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
            <ChevronsRight size={16} />
          </PageButton>
        </div>
      )}
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  'aria-label': string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none"
      {...props}
    >
      {children}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

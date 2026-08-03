import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  accessor: (row: T) => string | number | null | undefined;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  loadingRows?: number;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search query.',
  loading,
  loadingRows = 6,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl surface">
        <div className="space-y-0">
          {[...Array(loadingRows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-[var(--border-default)] px-5 py-4 last:border-0">
              <div className="shimmer-bg h-4 flex-1 rounded" />
              <div className="shimmer-bg h-4 w-24 rounded" />
              <div className="shimmer-bg h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Search size={22} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl surface">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-default)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.sortable && 'cursor-pointer select-none hover:text-[var(--text-primary)]',
                )}
                onClick={col.sortable ? () => onSort?.(col.key) : undefined}
              >
                <span className={cn('inline-flex items-center gap-1', col.align === 'right' && 'flex-row-reverse')}>
                  {col.header}
                  {col.sortable && (
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-[var(--border-default)] transition-colors last:border-0',
                onRowClick && 'cursor-pointer hover:bg-[var(--bg-subtle)]',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-5 py-4 text-sm text-[var(--text-primary)]',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.render ? col.render(row) : (col.accessor(row) ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir?: 'asc' | 'desc' }) {
  if (!active) return <ChevronsUpDown size={13} className="text-[var(--text-muted)] opacity-50" />;
  return dir === 'asc' ? (
    <ChevronUp size={13} className="text-brand-accent" />
  ) : (
    <ChevronDown size={13} className="text-brand-accent" />
  );
}

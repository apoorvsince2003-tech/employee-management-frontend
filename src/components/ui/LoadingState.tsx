import { cn } from '@/utils';

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3 py-12 animate-[fadeIn_0.3s_ease-out]', className)}
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl surface p-5">
          <div className="shimmer-bg h-4 w-24 rounded" />
          <div className="shimmer-bg mt-4 h-8 w-20 rounded" />
          <div className="shimmer-bg mt-3 h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  );
}

export function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl surface p-4">
          <div className="shimmer-bg h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="shimmer-bg h-3.5 w-40 rounded" />
            <div className="shimmer-bg h-3 w-24 rounded" />
          </div>
          <div className="shimmer-bg h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

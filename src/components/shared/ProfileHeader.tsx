import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils';

interface ProfileHeaderProps {
  name: string;
  subtitle?: string;
  avatar?: boolean;
  avatarSize?: 'md' | 'lg';
  meta?: ReactNode;
  actions?: ReactNode;
  badges?: ReactNode;
  backLink?: string;
  backLabel?: string;
  accentColor?: string;
  children?: ReactNode;
  className?: string;
}

export function ProfileHeader({
  name,
  subtitle,
  avatar = true,
  avatarSize = 'lg',
  meta,
  actions,
  badges,
  backLink,
  backLabel = 'Back',
  children,
  className,
}: ProfileHeaderProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl surface p-6', className)}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-accent/8 blur-3xl" />
      <div className="relative">
        {backLink && (
          <Link
            to={backLink}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={15} />
            {backLabel}
          </Link>
        )}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {avatar && <Avatar name={name} size={avatarSize} />}
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                {name}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
              )}
              {badges && <div className="mt-3 flex flex-wrap gap-2">{badges}</div>}
              {meta && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">{meta}</div>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

interface MetaItemProps {
  icon: ReactNode;
  label: string;
}

export function MetaItem({ icon, label }: MetaItemProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[var(--text-muted)]">{icon}</span>
      {label}
    </span>
  );
}

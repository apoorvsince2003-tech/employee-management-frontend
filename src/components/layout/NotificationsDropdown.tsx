import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Dropdown, DropdownSeparator } from '@/components/ui/Dropdown';
import { Badge } from '@/components/ui/Badge';
import { notificationService } from '@/services';
import { relativeTime, cn } from '@/utils';
import type { Notification } from '@/types';

const iconMap = {
  info: { icon: Info, color: 'text-sky-500 bg-sky-500/10' },
  success: { icon: CheckCircle2, color: 'text-success-500 bg-success-500/10' },
  warning: { icon: AlertTriangle, color: 'text-warning-500 bg-warning-500/10' },
  error: { icon: XCircle, color: 'text-error-500 bg-error-500/10' },
};

export function NotificationsDropdown() {
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    notificationService.list().then((list) => active && setItems(list));
    notificationService.unreadCount().then((c) => active && setUnread(c));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Dropdown
      width={360}
      trigger={
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] transition-all hover:border-brand-accent/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-ring"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white ring-2 ring-[var(--bg-surface)]">
              {unread}
            </span>
          )}
        </button>
      }
    >
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Notifications</p>
        {unread > 0 && <Badge tone="error" size="sm">{unread} new</Badge>}
      </div>
      <DropdownSeparator />
      <div className="max-h-96 overflow-y-auto">
        {items.map((n) => {
          const { icon: Icon, color } = iconMap[n.type];
          return (
            <Link
              key={n.id}
              to={n.link ?? '#'}
              className={cn(
                'flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--bg-subtle)]',
                !n.read && 'bg-brand-secondary/30 dark:bg-mint-600/5',
              )}
            >
              <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', color)}>
                <Icon size={15} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-[var(--text-primary)]">{n.title}</span>
                <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">{n.message}</span>
                <span className="mt-1 block text-[10px] text-[var(--text-muted)]">
                  {relativeTime(n.timestamp)}
                </span>
              </span>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-accent" />}
            </Link>
          );
        })}
      </div>
      <DropdownSeparator />
      <div className="flex items-center justify-between px-3 py-2">
        <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <Check size={13} /> Mark all read
        </button>
        <Link to="/help" className="text-xs font-medium text-brand-accent hover:underline">
          View all
        </Link>
      </div>
    </Dropdown>
  );
}

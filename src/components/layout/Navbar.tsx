import { Menu, PanelLeftClose } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserProfileDropdown } from './UserProfileDropdown';
import { ThemeSwitcher } from '@/components/ui';

export function Navbar() {
  const { toggleCollapsed, setMobileOpen, collapsed } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]/80 px-4 backdrop-blur-md lg:px-6">
      {/* Mobile menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Desktop collapse */}
      <button
        onClick={toggleCollapsed}
        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] lg:inline-flex"
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose size={18} className={collapsed ? 'rotate-180' : ''} />
      </button>

      <div className="flex-1">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher compact />
        <NotificationsDropdown />
        <UserProfileDropdown />
      </div>
    </header>
  );
}

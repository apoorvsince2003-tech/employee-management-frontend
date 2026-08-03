import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Sparkles } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { navItems } from '@/routes/navItems';
import { useBadgeCounts } from '@/hooks/useBadgeCounts';
import { APP_CONFIG } from '@/constants';
import { cn } from '@/utils';

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { pendingLeaves } = useBadgeCounts();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-brand-primary/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col surface border-r transition-[width,transform] duration-300 ease-out lg:translate-x-0',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[260px]',
          'w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-brand-secondary">
            <Sparkles size={18} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display text-lg font-bold leading-none text-[var(--text-primary)]">
                {APP_CONFIG.name}
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                HR Platform
              </p>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 no-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const badge =
                item.badgeKey === 'pendingLeaves' && pendingLeaves > 0 ? pendingLeaves : undefined;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                        collapsed && 'lg:justify-center lg:px-0',
                        isActive
                          ? 'bg-brand-secondary/70 text-brand-primary dark:bg-mint-600/15 dark:text-mint-300'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-accent"
                          />
                        )}
                        <item.icon size={20} className="shrink-0" />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && badge && (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1.5 text-[10px] font-bold text-white">
                            {badge}
                          </span>
                        )}
                        {collapsed && badge && (
                          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-accent lg:right-1.5" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden shrink-0 border-t border-[var(--border-default)] p-3 lg:block">
          <button
            onClick={toggleCollapsed}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
              collapsed && 'justify-center px-0',
            )}
          >
            <ChevronLeft
              size={20}
              className={cn('shrink-0 transition-transform', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

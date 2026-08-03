import { Outlet } from 'react-router-dom';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export function AppLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]',
        )}
      >
        <Navbar />
        <main id="main-content" className="flex-1 px-4 py-5 lg:px-8 lg:py-7">
          <div className="mb-5">
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { routeTitles } from '@/routes/navItems';

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    // Detail pages: the parent route title is known, the ID segment renders as "Detail"
    const parentPath = '/' + segments.slice(0, i).join('/');
    const isDetailSegment = i > 0 && routeTitles[parentPath] && !routeTitles[path];
    const title = routeTitles[path] ?? (isDetailSegment ? 'Detail' : seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path, title, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        <Home size={14} />
      </Link>
      {crumbs.map((c) => (
        <Fragment key={c.path}>
          <ChevronRight size={14} className="text-[var(--text-muted)]" />
          {c.isLast ? (
            <span className="font-medium text-[var(--text-primary)]">{c.title}</span>
          ) : (
            <Link
              to={c.path}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {c.title}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

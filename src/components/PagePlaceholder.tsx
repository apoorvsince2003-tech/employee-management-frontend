import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { ArrowRight, Hammer } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { routeTitles, navItems } from '@/routes/navItems';

interface PagePlaceholderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon | ComponentType<{ size?: number | string; className?: string }>;
  features?: string[];
}

export function PagePlaceholder({
  title,
  description,
  icon: Icon = Hammer,
  features,
}: PagePlaceholderProps) {
  const { pathname } = useLocation();
  const pageTitle = title ?? routeTitles[pathname] ?? 'Page';
  const current = navItems.find((n) => n.path === pathname);

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-6 flex items-center gap-2">
          <Badge tone="accent" dot>
            Foundation ready
          </Badge>
          <Badge tone="neutral">Module 2</Badge>
        </div>
        <Card padding="lg" className="overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-accent/10 blur-3xl" />
            <div className="relative flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-secondary text-brand-accent dark:bg-mint-600/15">
                <Icon size={28} />
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold text-[var(--text-primary)]">
                {pageTitle}
              </h1>
              <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                {description ??
                  'This module is scaffolded and ready for the next build phase. Routing, data, and the service layer are wired — the rich UI lands next.'}
              </p>

              {features && features.length > 0 && (
                <ul className="mt-6 grid w-full gap-2 text-left sm:grid-cols-2">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 rounded-xl bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-muted)]">
            {current ? `${current.label} module` : 'Module'} — part of the APSARA platform.
          </p>
          <Link to="/dashboard">
            <Button variant="subtle" size="sm" rightIcon={<ArrowRight size={15} />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

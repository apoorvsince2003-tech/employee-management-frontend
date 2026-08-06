import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { quickActions } from '@/routes/navItems';
import { APP_CONFIG } from '@/constants';
import { formatDate } from '@/utils';


export function WelcomeBanner() {

  const today = formatDate(new Date(), "long");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl bg-brand-primary p-6 lg:p-8"
    >
      {/* decorative glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-mint-400/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #D9FAF4 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-mint-300">{today}</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-brand-secondary sm:text-3xl">
            Welcome back, {localStorage.getItem("profileName") || "Alex"}
          </h1>
          <p className="mt-2 text-sm text-mint-200/80 sm:text-base">
            {APP_CONFIG.tagline}
          </p>
          <Link
            to="/reports"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-mint-700 hover:shadow-glow-strong"
          >
            View reports
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="group flex flex-col gap-3 rounded-xl bg-white/10 p-3.5 backdrop-blur-sm transition-all hover:bg-white/15 hover:ring-1 hover:ring-brand-accent/40"
            >
              <action.icon size={20} className="text-brand-accent" />
              <span className="text-xs font-medium leading-tight text-brand-secondary/90">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

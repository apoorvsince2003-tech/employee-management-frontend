import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '@/constants';
import { cn, formatCompactCurrency, formatCompactNumber } from '@/utils';

// Shared tooltip styling
function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl surface px-3 py-2 shadow-card-hover">
      {label && <p className="mb-1 text-xs font-semibold text-[var(--text-primary)]">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  height?: number;
  to?: string;
}

export function ChartCard({ title, subtitle, action, children, className, height = 280, to }: ChartCardProps) {
  return (
    <div className={cn('rounded-2xl surface p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {to ? (
            <Link to={to} className="group/title inline-flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-[var(--text-primary)] transition-colors group-hover/title:text-brand-accent">
                {title}
              </h3>
              <ArrowUpRight
                size={15}
                className="shrink-0 text-[var(--text-muted)] opacity-0 transition-all group-hover/title:translate-x-0.5 group-hover/title:opacity-100"
              />
            </Link>
          ) : (
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
          )}
          {subtitle && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 12 },
};

const gridProps = {
  strokeDasharray: '3 3',
  vertical: false,
  stroke: 'var(--border-default)',
};

export function DepartmentDistributionChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="var(--bg-surface)"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={(v: number) => `${v} employees`} />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function EmploymentTypeChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={28}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatCompactNumber(v)} />
        <Tooltip cursor={{ fill: 'var(--bg-subtle)' }} content={<ChartTooltip formatter={(v: number) => `${v} employees`} />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SalaryAreaChart({ data }: { data: { month: string; total: number; headcount: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00BFA6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00BFA6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => formatCompactCurrency(v)} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCompactCurrency(v)} />} />
        <Area
          type="monotone"
          dataKey="total"
          name="Payroll"
          stroke="#00BFA6"
          strokeWidth={2.5}
          fill="url(#salaryGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PromotionLineChart({ data }: { data: { month: string; promotions: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => `${v} promotions`} />} />
        <Line
          type="monotone"
          dataKey="promotions"
          name="Promotions"
          stroke="#0F2A2A"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#00BFA6', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#00BFA6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LeaveTrendChart({ data }: { data: { month: string; annual: number; sick: number; personal: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={16} barGap={2}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip cursor={{ fill: 'var(--bg-subtle)' }} content={<ChartTooltip formatter={(v: number) => `${v} days`} />} />
        <Legend verticalAlign="top" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
        <Bar dataKey="annual" name="Annual" fill="#00BFA6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="sick" name="Sick" fill="#47DBC3" radius={[4, 4, 0, 0]} />
        <Bar dataKey="personal" name="Personal" fill="#38635D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AttendanceRadialChart({ rate }: { rate: number }) {
  const data = [{ name: 'Attendance', value: rate, fill: '#00BFA6' }];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={90 - (rate / 100) * 360}>
        <RadialBar background={{ fill: 'var(--bg-subtle)' }} dataKey="value" cornerRadius={10} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

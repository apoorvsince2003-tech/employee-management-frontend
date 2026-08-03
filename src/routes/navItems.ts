import {
  LayoutDashboard,
  Users,
  Building2,
  UsersRound,
  FolderKanban,
  Wallet,
  TrendingUp,
  CalendarCheck,
  CalendarDays,
  PartyPopper,
  Megaphone,
  BarChart3,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badgeKey?: 'pendingLeaves';
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building2 },
  { label: 'Teams', path: '/teams', icon: UsersRound },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Salary Management', path: '/salary', icon: Wallet },
  { label: 'Promotions', path: '/promotions', icon: TrendingUp },
  { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { label: 'Leave Management', path: '/leaves', icon: CalendarDays, badgeKey: 'pendingLeaves' },
  { label: 'Holidays', path: '/holidays', icon: PartyPopper },
  { label: 'Notice Board', path: '/notices', icon: Megaphone },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help & Support', path: '/help', icon: LifeBuoy },
];

// Quick-action targets for the dashboard
export const quickActions = [
  { label: 'Add Employee', path: '/employees', icon: Users },
  { label: 'Approve Leave', path: '/leaves', icon: CalendarDays },
  { label: 'New Notice', path: '/notices', icon: Megaphone },
  { label: 'Run Payroll', path: '/salary', icon: Wallet },
];

export const routeTitles: Record<string, string> = {
  ...Object.fromEntries(navItems.map((n) => [n.path, n.label])),
  '/profile': 'My Profile',
  '/security': 'Security',
};

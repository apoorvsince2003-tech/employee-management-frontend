// Application-wide constants for APSARA HR platform

export const APP_CONFIG = {
  name: 'APSARA',
  tagline: 'Where People, Teams, and Progress Connect.',
  supportingTagline: 'Manage People. Empower Teams. Drive Progress.',
  version: '1.0.0',
  organization: 'APSARA Systems',
};

// Brand colors — single source of truth
export const BRAND_COLORS = {
  primary: '#0F2A2A',
  secondary: '#D9FAF4',
  accent: '#00BFA6',
};

// Chart palette — consistent across all charts
export const CHART_COLORS = [
  '#00BFA6',
  '#0F2A2A',
  '#47DBC3',
  '#38635D',
  '#80EBD8',
  '#2C4F4A',
  '#1FC4AC',
  '#6A9891',
];

export const CHART_COLOR_MAP: Record<string, string> = {
  primary: '#00BFA6',
  secondary: '#0F2A2A',
  accent: '#47DBC3',
  success: '#12B76A',
  warning: '#F79009',
  error: '#F04438',
  info: '#0EA5E9',
};

// Storage keys
export const STORAGE_KEYS = {
  theme: 'apsara-theme',
  sidebarCollapsed: 'apsara-sidebar-collapsed',
  recentSearches: 'apsara-recent-searches',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

// Employment types
export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERN: 'Intern',
} as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[keyof typeof EMPLOYMENT_TYPES];

// Employee status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  INACTIVE: 'Inactive',
  PROBATION: 'Probation',
} as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];

// Leave types
export const LEAVE_TYPES = {
  ANNUAL: 'Annual Leave',
  SICK: 'Sick Leave',
  PERSONAL: 'Personal Leave',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity Leave',
  UNPAID: 'Unpaid Leave',
} as const;

export type LeaveType = (typeof LEAVE_TYPES)[keyof typeof LEAVE_TYPES];

// Leave request status
export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
} as const;

export type LeaveStatus = (typeof LEAVE_STATUS)[keyof typeof LEAVE_STATUS];

// Project status
export const PROJECT_STATUS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

// Pagination defaults
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// Date formats
export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'EEEE, MMMM d, yyyy',
  iso: 'yyyy-MM-dd',
};

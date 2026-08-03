import { apiClient } from './base';
import type { Holiday, Activity } from '@/types';
import type { EmployeeStats, EmploymentDist } from './employeeService';
import type { DepartmentDist } from './departmentService';
import type { PayrollTrendPoint, SalaryTotals } from './salaryService';
import type { PromotionTrendPoint } from './promotionService';
import type { LeaveTrendPoint } from './leaveService';
import type { AttendanceTrendPoint } from './attendanceService';

// Aggregated payload the Spring Boot dashboard endpoint is expected to return.
export interface DashboardData {
  stats: EmployeeStats;
  activeProjects: number;
  pendingLeaves: number;
  onLeaveCount: number;
  departmentDist: DepartmentDist[];
  employmentDist: EmploymentDist[];
  payroll: PayrollTrendPoint[];
  promotions: PromotionTrendPoint[];
  leaveTrend: LeaveTrendPoint[];
  attendanceTrend: AttendanceTrendPoint[];
  attendanceRate: number;
  salaryTotals: SalaryTotals;
  holidays: Holiday[];
  activities: Activity[];
  unread: number;
}

export const dashboardService = {
  // Single aggregated endpoint for the dashboard. Falls back to per-service
  // calls on the page when the aggregated endpoint is unavailable.
  aggregate: () => apiClient.get<DashboardData>('/dashboard'),
};

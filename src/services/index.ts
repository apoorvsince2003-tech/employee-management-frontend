// Service-layer barrel. UI code imports services from here.
// Each service wraps the centralized apiClient (Axios) — swap the base URL
// via VITE_API_BASE_URL to connect to a Spring Boot REST API.
export * from './base';
export * from './authService';
export * from './employeeService';
export * from './departmentService';
export * from './teamService';
export * from './projectService';
export * from './salaryService';
export * from './attendanceService';
export * from './leaveService';
export * from './promotionService';
export * from './holidayService';
export * from './noticeService';
export * from './activityService';
export * from './dashboardService';

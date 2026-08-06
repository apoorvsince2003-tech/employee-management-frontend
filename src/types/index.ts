// Domain types — shared across data, services, and UI.
// Designed to match what a future Spring Boot REST API would return.

import type {
  EmploymentType,
  EmployeeStatus,
  LeaveType,
  LeaveStatus,
  ProjectStatus,
} from '@/constants';

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  headId: string;
  headName: string;
  employeeCount: number;
  budget: number;
  establishedDate: string;
  color: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  salary: number;
  joinDate: string;
  location: string;
  teamIds: string[];
  managerId?: string;
  managerName?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  departmentName?: string;
  leadId: string;
  leadName?: string;
  memberCount: number;
  projectId: string;
  projectName?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  teamId: string;
  teamName?: string;
  leadId: string;
  leadName?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  departmentName: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  payPeriod: string; // e.g. "2026-07"
  status: 'Paid' | 'Pending' | 'Processing';
}

export interface SalaryRevision {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  departmentName: string;
  type: 'Increment' | 'Decrement';
  previousSalary: number;
  newSalary: number;
  changeAmount: number;
  changePercent: number;
  effectiveDate: string;
  reason: string;
  approvedBy: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'Remote';
  workHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

export interface Promotion {
  id: string;
  employeeId: string;
  employeeName: string;
  fromDesignation: string;
  toDesignation: string;
  departmentName: string;
  salaryIncrease: number;
  effectiveDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface Holiday {
  id: number;

  holidayName: string;

  holidayDate: string;

  description: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Policy' | 'Event' | 'Announcement' | 'Urgent' | 'General';
  author: string;
  publishedDate: string;
  priority: 'Low' | 'Medium' | 'High';
  pinned: boolean;
}

export interface Activity {
  id: string;
  type: 'employee' | 'project' | 'leave' | 'promotion' | 'salary' | 'notice' | 'holiday';
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

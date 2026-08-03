import { apiClient } from './base';
import type { Employee } from '@/types';

export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  newJoiners: number;
}

export interface EmploymentDist {
  name: string;
  value: number;
}

export const employeeService = {
  list: () => apiClient.get<Employee[]>('/employees'),

  getById: (id: string) => apiClient.get<Employee>(`/employees/${id}`),

  byDepartment: (departmentId: string) =>
    apiClient.get<Employee[]>(`/employees`, { departmentId }),

  byTeam: (teamId: string) =>
    apiClient.get<Employee[]>(`/employees`, { teamId }),

  reports: (managerId: string) =>
    apiClient.get<Employee[]>(`/employees`, { managerId }),

  create: (body: Partial<Employee>) =>
    apiClient.post<Employee>('/employees', body),

 update: (id: string, body: Partial<Employee>) =>
  apiClient.put<Employee>(`/employees/${id}`, body),

remove: (id: string) =>
  apiClient.delete<void>(`/employees/${id}`),

  stats: () => apiClient.get<EmployeeStats>('/employees/stats'),

  employmentDist: () =>
    apiClient.get<EmploymentDist[]>('/employees/employment-distribution'),
};

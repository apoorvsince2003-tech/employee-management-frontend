import { apiClient } from './base';
import type { Department } from '@/types';

export interface DepartmentDist {
  name: string;
  value: number;
  color: string;
}

export const departmentService = {
  list: () => apiClient.get<Department[]>('/departments'),

  getById: (id: string) => apiClient.get<Department>(`/departments/${id}`),

  create: (body: Partial<Department>) =>
    apiClient.post<Department>('/departments', body),

  update: (id: string, body: Partial<Department>) =>
    apiClient.put<Department>(`/departments/${id}`, body),

  remove: (id: string) => apiClient.delete<void>(`/departments/${id}`),

  distribution: () =>
    apiClient.get<DepartmentDist[]>('/departments/distribution'),

  activeProjects: (departmentId: string) =>
    apiClient.get<number>(`/departments/${departmentId}/active-projects`),
};

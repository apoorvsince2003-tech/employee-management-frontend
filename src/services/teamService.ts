import { apiClient } from './base';
import type { Team } from '@/types';

export const teamService = {
  list: () => apiClient.get<Team[]>('/teams'),

  getById: (id: string) => apiClient.get<Team>(`/teams/${id}`),

  byDepartment: (departmentId: string) =>
    apiClient.get<Team[]>('/teams', { departmentId }),

  create: (body: Partial<Team>) => apiClient.post<Team>('/teams', body),

  update: (id: string, body: Partial<Team>) =>
    apiClient.put<Team>(`/teams/${id}`, body),

  remove: (id: string) => apiClient.delete<void>(`/teams/${id}`),
};

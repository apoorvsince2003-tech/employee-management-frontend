import { apiClient } from './base';
import type { Project } from '@/types';

export const projectService = {
  list: () => apiClient.get<Project[]>('/projects'),

  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  byTeam: (teamId: string) =>
    apiClient.get<Project[]>('/projects', { teamId }),

  create: (body: Partial<Project>) =>
    apiClient.post<Project>('/projects', body),

  update: (id: string, body: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}`, body),

  remove: (id: string) => apiClient.delete<void>(`/projects/${id}`),

  activeCount: () => apiClient.get<number>('/projects/active-count'),
};

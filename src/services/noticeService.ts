import { apiClient } from './base';
import type { Notice } from '@/types';

export const noticeService = {
  list: () => apiClient.get<Notice[]>('/notices'),

  getById: (id: string) => apiClient.get<Notice>(`/notices/${id}`),

  create: (body: Partial<Notice>) =>
    apiClient.post<Notice>('/notices', body),

  update: (id: string, body: Partial<Notice>) =>
    apiClient.put<Notice>(`/notices/${id}`, body),

  remove: (id: string) => apiClient.delete<void>(`/notices/${id}`),
};

import { apiClient } from './base';
import type { LeaveRequest } from '@/types';

export interface LeaveTrendPoint {
  month: string;
  annual: number;
  sick: number;
  personal: number;
}

export const leaveService = {
  list: () => apiClient.get<LeaveRequest[]>('/leaves'),

  trend: () => apiClient.get<LeaveTrendPoint[]>('/leaves/trend'),

  byEmployee: (employeeId: string) =>
    apiClient.get<LeaveRequest[]>('/leaves', { employeeId }),

  pending: () =>
    apiClient.get<LeaveRequest[]>('/leaves', { status: 'Pending' }),

  pendingCount: () => apiClient.get<number>('/leaves/pending-count'),

  onLeaveCount: () => apiClient.get<number>('/leaves/on-leave-count'),

  approve: (id: string) => apiClient.put<LeaveRequest>(`/leaves/${id}/approve`),

  reject: (id: string) => apiClient.put<LeaveRequest>(`/leaves/${id}/reject`),

  create: (body: Partial<LeaveRequest>) =>
    apiClient.post<LeaveRequest>('/leaves', body),
};

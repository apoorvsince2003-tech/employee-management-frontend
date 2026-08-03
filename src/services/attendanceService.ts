import { apiClient } from './base';
import type { AttendanceRecord } from '@/types';

export interface AttendanceTrendPoint {
  date: string;
  present: number;
  remote: number;
  late: number;
  absent: number;
  rate: number;
}

export const attendanceService = {
  list: () => apiClient.get<AttendanceRecord[]>('/attendance'),

  trend: () => apiClient.get<AttendanceTrendPoint[]>('/attendance/trend'),

  byEmployee: (employeeName: string) =>
  apiClient.get<AttendanceRecord[]>(
    `/attendance/employee/${employeeName}`
  ),

  today: () => apiClient.get<AttendanceRecord[]>('/attendance/today'),
  create: (body: Partial<AttendanceRecord>) =>
  apiClient.post<AttendanceRecord>("/attendance", body),
  getById: (id: string) =>
  apiClient.get<AttendanceRecord>(`/attendance/${id}`),

update: (id: string, body: Partial<AttendanceRecord>) =>
  apiClient.put<AttendanceRecord>(`/attendance/${id}`, body),
remove: (id: string) =>
  apiClient.delete<void>(`/attendance/${id}`),
};

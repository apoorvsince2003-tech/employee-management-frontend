import { apiClient } from './base';
import type { Activity, Notification } from '@/types';

export const activityService = {
  recent: (limit = 8) =>
    apiClient.get<Activity[]>('/activities/recent', { limit }),
};

export const notificationService = {
  list: () => apiClient.get<Notification[]>('/notifications'),

  unreadCount: () => apiClient.get<number>('/notifications/unread-count'),

  markAllRead: () => apiClient.put<void>('/notifications/mark-all-read'),
};

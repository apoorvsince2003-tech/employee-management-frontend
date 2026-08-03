import { apiClient } from './base';
import type { Holiday } from '@/types';

export const holidayService = {
  list: () => apiClient.get<Holiday[]>('/holidays'),

  upcoming: (limit = 5) =>
    apiClient.get<Holiday[]>('/holidays/upcoming', { limit }),
};

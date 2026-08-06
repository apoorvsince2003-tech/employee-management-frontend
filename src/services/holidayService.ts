import { apiClient } from "./base";
import type { Holiday } from "@/types";

export const holidayService = {
  list: () =>
    apiClient.get<Holiday[]>("/holidays"),

  upcoming: (limit = 5) =>
    apiClient.get<Holiday[]>("/holidays/upcoming", { limit }),

  getById: (id: string) =>
    apiClient.get<Holiday>(`/holidays/${id}`),

  create: (body: Partial<Holiday>) =>
    apiClient.post<Holiday>("/holidays", body),

  update: (id: string, body: Partial<Holiday>) =>
    apiClient.put<Holiday>(`/holidays/${id}`, body),

  remove: (id: string) =>
    apiClient.delete<void>(`/holidays/${id}`),
};
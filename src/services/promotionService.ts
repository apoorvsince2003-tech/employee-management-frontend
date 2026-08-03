import { apiClient } from "./base";
import type { Promotion } from "@/types";

export interface PromotionTrendPoint {
  month: string;
  promotions: number;
}

export interface CreatePromotionRequest {
  employeeId: number;
  newDesignation: string;
  newSalary: number;
  reason: string;
  promotionDate: string;
}

export const promotionService = {

  list: async (): Promise<Promotion[]> => {

    const data = await apiClient.get<any[]>("/promotions");

    return data.map((item) => ({
  id: String(item.id),
  employeeId: String(item.employeeId ?? ""),
  employeeName: item.employeeName ?? "Unknown Employee",
  departmentName: item.departmentName ?? "General",
  fromDesignation: item.oldDesignation ?? "-",
  toDesignation: item.newDesignation ?? "-",
  salaryIncrease: Number(item.salaryIncrease ?? 0),
  effectiveDate: item.promotionDate ?? "",
  status: item.status ?? "Pending",
  reason: item.reason ?? "N/A",
}));
  },

  trend: async (): Promise<PromotionTrendPoint[]> => {

    const list = await apiClient.get<any[]>("/promotions");

    const months: Record<string, number> = {};

    list.forEach((p) => {

      const month = new Date(p.promotionDate)
        .toLocaleString("default", { month: "short" });

      months[month] = (months[month] || 0) + 1;

    });

    return Object.keys(months).map((m) => ({
      month: m,
      promotions: months[m],
    }));
  },

  create: async (data: any) => {
  return await apiClient.post("/promotions", data);

}};
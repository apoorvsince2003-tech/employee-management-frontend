import { apiClient } from './base';
import type { SalaryRecord, SalaryRevision } from '@/types';

export interface SalaryByDepartment {
  department: string;
  total: number;
  average: number;
  headcount: number;
}

export interface PayrollTrendPoint {
  month: string;
  total: number;
  headcount: number;
}

export interface SalaryBand {
  band: string;
  count: number;
}

export interface SalaryTotals {
  monthlyPayroll: number;
  headcount: number;
  averageSalary: number;
  bonusPool: number;
}

export const salaryService = {
  list: async (): Promise<SalaryRecord[]> => {

  const data = await apiClient.get<any[]>("/payroll");

  return data.map((item) => ({
    id: String(item.id),

    employeeId: String(item.id),

employeeName: item.employeeName,

designation: "-",

departmentName: "-",

    baseSalary: item.basicSalary,

    bonus: item.bonus,

    deductions: item.deduction,

    netSalary: item.netSalary,

    payPeriod: item.payPeriod,

    status: item.status,
  }));
},

   trend: () =>
  apiClient.get<PayrollTrendPoint[]>("/payroll/trend"),

totals: () =>
  apiClient.get<SalaryTotals>("/payroll/totals"),

bands: () =>
  apiClient.get<SalaryBand[]>("/payroll/bands"),

revisions: () =>
  apiClient.get<SalaryRevision[]>("/payroll/revisions"),

  //byDepartment: () => apiClient.get<SalaryByDepartment[]>('/salary/by-department'),

  //trend: () => apiClient.get<PayrollTrendPoint[]>('/salary/payroll-trend'),

  //totals: () => apiClient.get<SalaryTotals>('/salary/totals'),

  //bands: () => apiClient.get<SalaryBand[]>('/salary/bands'),

  //revisions: () => apiClient.get<SalaryRevision[]>('/salary/revisions'),

 // revisionsByEmployee: (employeeId: string) =>
    //apiClient.get<SalaryRevision[]>(`/salary/revisions`, { employeeId }),

 // historyByEmployee: (employeeId: string) =>
    //apiClient.get<SalaryRecord[]>(`/salary/records`, { employeeId }),

  //createRevision: (body: Partial<SalaryRevision>) =>
    //apiClient.post<SalaryRevision>('/salary/revisions', body),
};

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

  const data = await apiClient.get<any[]>("/employees");

  return data.map((item) => ({

    id: String(item.id),

    employeeId: String(item.id),

    employeeName: item.firstName + " " + item.lastName,

    designation: item.designation,

    departmentName: item.departmentName,

    baseSalary: item.salary,

    bonus: 0,

    deductions: 0,

    netSalary: item.salary,

    payPeriod: "2026-08",

    status: "Paid",

  }));

},

    trend: async () => {
  return [];
},

totals: async () => {
  return {
    monthlyPayroll: 0,
    headcount: 0,
    averageSalary: 0,
    bonusPool: 0,
  };
},

bands: async () => {
  return [];
},

revisions: async () => {
  return [];
},

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

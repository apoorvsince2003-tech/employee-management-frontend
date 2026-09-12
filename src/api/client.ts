import axios, { AxiosError, type AxiosInstance } from 'axios';

// Ensure baseURL always ends with '/api' and clean trailing slashes
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Paginated<T> {
  content: T[];
  total: number;
  page: number;
  pageSize: number;
}

const TOKEN_KEY = 'apsara_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

// Clean path helper so leading slash doesn't override baseURL /api prefix
function formatPath(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';

    if (status === 401) {
      setAuthToken(null);
    }

    return Promise.reject(new ApiError(message, status));
  },
);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const cleanPath = formatPath(path);
    const res = await instance.get(cleanPath, { params });
    return res.data;
  },

  async getRaw<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const cleanPath = formatPath(path);
    const res = await instance.get<T>(cleanPath, { params });
    return res.data;
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const cleanPath = formatPath(path);
    const res = await instance.post<T>(cleanPath, body);
    return res.data;
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const cleanPath = formatPath(path);
    const res = await instance.put<T>(cleanPath, body);
    return res.data;
  },

  async delete<T>(path: string): Promise<T> {
    const cleanPath = formatPath(path);
    const res = await instance.delete<T>(cleanPath);
    return res.data;
  },
};
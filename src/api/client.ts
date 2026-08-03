import axios, { AxiosError, type AxiosInstance } from 'axios';

export const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8082/api';

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
    // ignore storage errors (e.g. privacy mode)
  }
}

// Centralized Axios instance. Every service method goes through this client
// so request/response concerns (base URL, auth header, error normalization)
// are handled in one place.
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every outgoing request.
instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors into a single ApiError shape and surface a readable message.
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';

    // Clear auth token on 401 so the UI can redirect to sign-in.
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

// Thin wrappers so services stay decoupled from axios specifics. Each returns
// the unwrapped `data` payload (the ApiResponse body) directly.
export const apiClient = {
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const res = await instance.get(path, { params });

  console.log("API PATH:", path);
  console.log("API RESPONSE:", res.data);

  return res.data;
},

  async getRaw<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const res = await instance.get<T>(path, { params });
    return res.data;
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
  const res = await instance.post<T>(path, body);
  return res.data;
},

 async put<T>(path: string, body?: unknown): Promise<T> {
  const res = await instance.put<T>(path, body);
  return res.data;
},

  async delete<T>(path: string): Promise<T> {
  const res = await instance.delete<T>(path);
  return res.data;
},
};

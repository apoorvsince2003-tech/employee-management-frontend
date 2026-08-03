import { apiClient, getAuthToken, setAuthToken } from './base';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  login: (credentials: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  register: (body: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', body),

  me: () => apiClient.get<AuthUser>('/auth/me'),

  logout: () => apiClient.post<void>('/auth/logout'),

  isAuthenticated: () => getAuthToken() !== null,

  persistSession: (res: AuthResponse) => setAuthToken(res.token),
  clearSession: () => setAuthToken(null),
};

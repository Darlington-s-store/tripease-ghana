import { apiClient, ApiResponse } from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  role: 'user' | 'admin' | 'provider';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(email: string, password: string, fullName: string, phone?: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
      phone,
    });
    return response.data!;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data!;
  },

  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/admin-login', {
      email,
      password,
    });
    return response.data!;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data!;
  },

  async updateProfile(fullName?: string, phone?: string, bio?: string, avatarUrl?: string): Promise<User> {
    const response = await apiClient.put<User>('/auth/profile', {
      fullName,
      phone,
      bio,
      avatarUrl,
    });
    return response.data!;
  },

  setToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  },

  clearToken(): void {
    sessionStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

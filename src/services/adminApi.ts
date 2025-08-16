const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: AdminUser;
  token: string;
  message?: string;
}

class AdminApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Request failed');
    }
    
    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.request<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      await this.request('/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    
    // Clear local storage regardless of API response
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    
    return { success: true };
  }

  async verifyToken(): Promise<{ valid: boolean; user?: AdminUser }> {
    try {
      const response = await this.request<{ success: boolean; data: AdminUser }>('/admin/auth/verify');
      return { valid: response.success, user: response.data };
    } catch {
      return { valid: false };
    }
  }

  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    try {
      const response = await this.request<{ success: boolean; token: string }>('/admin/auth/refresh', {
        method: 'POST',
      });
      
      if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token);
      }
      
      return response;
    } catch {
      return { success: false };
    }
  }

  async updateProfile(data: Partial<AdminUser>): Promise<{ success: boolean; user?: AdminUser }> {
    return this.request<{ success: boolean; user: AdminUser }>('/admin/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const adminApi = new AdminApiService();
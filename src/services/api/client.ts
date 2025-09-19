/**
 * API Client
 * Centralized HTTP client for making API requests
 */

import { API_CONFIG, ApiResponse } from './config';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Debug logging
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body
    });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        ) as Error & { status: number; code?: string };
        error.status = response.status;
        error.code = errorData.code;
        throw error;
      }

      const data = await response.json();
      
      return {
        data,
        success: true,
        message: 'Request successful',
      };
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      
      const networkError = new Error(
        error instanceof Error ? error.message : 'An unknown error occurred'
      ) as Error & { status: number; code?: string };
      networkError.status = 0;
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

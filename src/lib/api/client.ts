import { API_CONFIG, getApiUrl } from './config';
import { ApiError } from './types';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
  requiresAuth?: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  
  private constructor() {}
  
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  
  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }
  
  /**
   * Save auth token to localStorage
   */
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
  
  /**
   * Clear auth token from localStorage
   */
  public clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
  
  /**
   * Make an API request
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, data, requiresAuth = true, ...rest } = options;
    
    // Build URL with query parameters
    let url = getApiUrl(endpoint);
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url = `${url}?${queryParams.toString()}`;
    }
    
    // Prepare headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add authentication if required
    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }
    
    // Create request options
    const requestOptions: RequestInit = {
      ...rest,
      headers: requestHeaders,
    };
    
    // Add body data if present
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    // Set a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    requestOptions.signal = controller.signal;
    
    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
      
      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          status: response.status,
          message: errorData.message || response.statusText,
          errors: errorData.errors
        };
        
        throw new Error(JSON.stringify(apiError));
      }
      
      // Return parsed JSON response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(JSON.stringify({
          status: 408,
          message: 'Request timed out'
        }));
      }
      
      throw error;
    }
  }
  
  /**
   * GET request
   */
  public async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  /**
   * POST request
   */
  public async post<T>(endpoint: string, data: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }
  
  /**
   * PUT request
   */
  public async put<T>(endpoint: string, data: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }
  
  /**
   * PATCH request
   */
  public async patch<T>(endpoint: string, data: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }
  
  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance(); 
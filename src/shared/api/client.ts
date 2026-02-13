/**
 * Shared API Client
 * Infrastructure layer - HTTP client for all API requests
 */

import { createLogger } from './logger';
import { API_CONFIG } from './config';
import { useAuth } from '@/features/auth/model/store';

const logger = createLogger('API');

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method?: Method;
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: HeadersInit;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.baseURL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return useAuth.getState().token;
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, params, headers = {} } = config;
    const url = this.buildUrl(path, params);
    const token = this.getToken();

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      logger.error('API request failed', {
        path,
        method,
        status: response.status,
        statusText: response.statusText,
        error: error.message || error || 'Request failed',
        errorDetails: error,
      });
      // Throw error with more details
      const errorMessage = error.message || error.errors || JSON.stringify(error) || 'Request failed';
      const apiError = new Error(errorMessage) as Error & { status?: number; data?: unknown };
      apiError.status = response.status;
      apiError.data = error;
      throw apiError;
    }

    // Handle blob responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/octet-stream') || contentType?.includes('text/csv')) {
      const blobData = response.blob() as unknown as T;
      logger.info('API request successful', {
        path,
        method,
        status: response.status,
        statusText: response.statusText,
        contentType,
        responseType: 'blob',
        responseSize: 'N/A (blob data)',
      });
      return blobData;
    }

    const jsonData = await response.json();
    logger.info('API request successful', {
      path,
      method,
      status: response.status,
      statusText: response.statusText,
      contentType,
      responseType: 'json',
      responseData: jsonData,
    });
    return jsonData;
  }

  get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T>(path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, { method: 'POST', body, params });
  }

  put<T>(path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body, params });
  }

  patch<T>(path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body, params });
  }

  delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', params });
  }
}

export const api = new ApiClient();


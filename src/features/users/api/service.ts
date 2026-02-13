/**
 * Users Service
 * Application layer - Business logic for users
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import { mapRoleToApi, transformApiUserToAppUser } from '../lib/transformers';
import type {
  UsersFilter,
  CreateUserData,
  UsersResponse,
  UsersAnalyticsResponse,
  UserDetailResponse,
  User,
  UsersAnalytics,
} from './types';

export class UsersService {
  /**
   * Get users list
   */
  static async getUsers(filters?: UsersFilter): Promise<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get<UsersResponse>(API_CONFIG.endpoints.users.list, filters as Record<string, unknown> | undefined);
    return {
      users: response.data.resultItems || [],
      pagination: {
        page: response.data.currentPage,
        limit: response.data.pageSize,
        total: response.data.totalItems,
        totalPages: response.data.totalPages,
      },
    };
  }

  /**
   * Get single user
   */
  static async getUser(id: string): Promise<User> {
    const response = await api.get<UserDetailResponse>(API_CONFIG.endpoints.users.detail(id));
    
    // Handle the nested response structure: { success, message, errors, data: { user, plans } }
    if (response && typeof response === 'object') {
      // Check if response has the expected structure
      if ('data' in response && response.data) {
        const responseData = response.data;
        if (typeof responseData === 'object' && 'user' in responseData && responseData.user) {
          // Transform the backend user object to the frontend User type
          const backendUser = responseData.user;
          return transformApiUserToAppUser(backendUser as Parameters<typeof transformApiUserToAppUser>[0]);
        }
      }
      
      // Fallback: try to handle as direct User object (if response is the user itself)
      if ('id' in response && 'email' in response && 'firstName' in response) {
        return transformApiUserToAppUser(response as unknown as Parameters<typeof transformApiUserToAppUser>[0]);
      }
    }
    
    console.error('Invalid user response format:', response);
    throw new Error(`Invalid user response format: expected { data: { user: {...} } } but got ${JSON.stringify(response).substring(0, 200)}`);
  }

  /**
   * Get user analytics
   */
  static async getAnalytics(): Promise<UsersAnalytics> {
    const response = await api.get<UsersAnalyticsResponse>(
      API_CONFIG.endpoints.users.analytics
    );
    return response.data;
  }

  /**
   * Create user
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post<User>(API_CONFIG.endpoints.users.create, {
      ...data,
      roleName: mapRoleToApi(data.roleName),
    });
    return response;
  }

  /**
   * Update user status
   * Note: The API only supports status updates via POST /api/v1/admin/users/{userId}/status?action={action}
   */
  static async updateUserStatus(userId: string, action: string): Promise<void> {
    await api.post(API_CONFIG.endpoints.users.updateStatus(userId), {}, { action });
  }

  /**
   * Assign permissions to user
   */
  static async assignPermissions(data: { userId: string; permissionIds: number[] }): Promise<void> {
    await api.post(API_CONFIG.endpoints.users.assignPermissions, data);
  }

  /**
   * Delete user
   * Note: The API doesn't have a DELETE endpoint, so we use status update with 'delete' action
   */
  static async deleteUser(id: string): Promise<void> {
    // Use status update with 'delete' action since there's no DELETE endpoint
    await this.updateUserStatus(id, 'delete');
  }

  /**
   * Export users
   */
  static async exportUsers(filters?: UsersFilter): Promise<Blob> {
    return await api.get<Blob>(API_CONFIG.endpoints.users.export, filters as Record<string, unknown> | undefined);
  }
}


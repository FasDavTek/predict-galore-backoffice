/**
 * Users API Types
 */

import type {
  User,
  UsersFilter,
  UsersAnalytics,
  UserStatus,
  SubscriptionPlan,
  UserRole,
} from '../model/types';

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    success: boolean;
    currentPage: number;
    pageSize: number;
    resultItems: User[];
    totalPages: number;
    message: string;
  };
}

export interface UsersAnalyticsResponse {
  success: boolean;
  data: UsersAnalytics;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
  permissionIds?: number[];
  phoneNumber?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

export interface UpdateUserStatusData {
  userId: string;
  action: string; // e.g., 'activate', 'deactivate', 'suspend'
}

export interface AssignPermissionsData {
  userId: string;
  permissionIds: number[];
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  errors: null | unknown;
  data: {
    user: BackendUser;
    plans: Array<{
      id: number;
      name: string;
      [key: string]: unknown;
    }>;
  };
}

export interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  countryCode: string | null;
  isActive: boolean;
  isAdmin: boolean;
  userPlanId: number | null;
  statusId: number;
  country: string | null;
  createdAt: string;
  dateUpdated: string | null;
  lastLogin: string | null;
  [key: string]: unknown;
}

// Re-export domain types
export type {
  User,
  UsersFilter,
  UsersAnalytics,
  UserStatus,
  SubscriptionPlan,
  UserRole,
};


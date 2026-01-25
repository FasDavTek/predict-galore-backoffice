/**
 * Users Domain Types
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  phoneNumber?: string | null;
  avatar?: string;
  isActive: boolean;
  status?: UserStatus;
  plan?: SubscriptionPlan;
  role?: UserRole;
  emailVerified?: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
  country?: string | null | undefined;
  location?: string;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';
export type UserRole = 'user' | 'admin' | 'moderator';

export interface UsersFilter {
  search?: string;
  status?: UserStatus;
  plan?: SubscriptionPlan;
  role?: UserRole;
  page?: number;
  limit?: number;
  FromUtc?: string;
  ToUtc?: string;
}

export interface UsersAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  premiumUsers: number;
  totalChange: number;
  activeChange: number;
  newChange: number;
  premiumChange: number;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  plan: SubscriptionPlan;
}


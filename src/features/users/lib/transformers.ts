/**
 * Users Transformers
 * Business logic for data transformation
 */

import type { User, UserFormData, UserStatus, SubscriptionPlan, UserRole } from '../model/types';

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  phone?: string;
  countryCode?: string | null;
  avatar?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  userPlanId?: number | null;
  statusId?: number;
  plan?: SubscriptionPlan;
  role?: UserRole;
  emailVerified?: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
  dateUpdated?: string | null;
  country?: string | null;
  location?: string;
}

// Map userPlanId to plan name
const mapUserPlanIdToPlan = (userPlanId: number | null | undefined): SubscriptionPlan => {
  // Common mapping: 1 = Free, 2 = Premium, 3 = Basic, 4 = Enterprise
  // This might need adjustment based on actual backend mapping
  if (!userPlanId) return 'free';
  switch (userPlanId) {
    case 1:
      return 'free';
    case 2:
      return 'premium';
    case 3:
      return 'basic';
    case 4:
      return 'enterprise';
    default:
      return 'free';
  }
};

// Map statusId to status (but prefer isActive as source of truth)
const mapStatusIdToStatus = (statusId: number | undefined, isActive: boolean | undefined): UserStatus => {
  // Use isActive as primary source of truth
  if (isActive === true) return 'active';
  if (isActive === false) return 'inactive';
  
  // Fallback to statusId if isActive is not available
  if (statusId === undefined) return 'inactive';
  switch (statusId) {
    case 1:
      return 'active';
    case 2:
      return 'inactive';
    case 3:
      return 'suspended';
    case 4:
      return 'pending';
    default:
      return 'inactive';
  }
};

// Format phone number with country code
const formatPhoneNumber = (phoneNumber: string | null | undefined, countryCode: string | null | undefined): string => {
  if (!phoneNumber) return '';
  if (countryCode && !phoneNumber.startsWith('+')) {
    return `${countryCode}${phoneNumber}`;
  }
  return phoneNumber;
};

export const transformUserToFormData = (user: User): UserFormData => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone || user.phoneNumber || '',
  role: user.role || 'user',
  plan: user.plan || 'free',
});

export const transformApiUserToAppUser = (apiUser: ApiUser): User => {
  // Ensure all required fields are present
  if (!apiUser || !apiUser.id || !apiUser.email) {
    console.error('Invalid API user data:', apiUser);
    throw new Error('Invalid API user data: missing required fields');
  }

  const formattedPhone = formatPhoneNumber(apiUser.phoneNumber, apiUser.countryCode);
  const mappedPlan = apiUser.plan || mapUserPlanIdToPlan(apiUser.userPlanId);
  const mappedStatus = mapStatusIdToStatus(apiUser.statusId, apiUser.isActive);
  const mappedRole: UserRole = apiUser.isAdmin ? 'admin' : (apiUser.role || 'user');
  
  // Ensure isActive is properly set (use isActive from API, fallback to status mapping)
  const isActiveValue = apiUser.isActive !== undefined ? apiUser.isActive : (mappedStatus === 'active');
  
  return {
    id: String(apiUser.id),
    email: String(apiUser.email || ''),
    firstName: String(apiUser.firstName || ''),
    lastName: String(apiUser.lastName || ''),
    fullName: `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim(),
    phone: formattedPhone || apiUser.phone || '',
    avatar: apiUser.avatar,
    status: mappedStatus,
    plan: mappedPlan,
    role: mappedRole,
    emailVerified: apiUser.emailVerified || false,
    lastActive: apiUser.lastActive || apiUser.createdAt,
    createdAt: String(apiUser.createdAt || ''),
    updatedAt: apiUser.updatedAt || apiUser.dateUpdated || apiUser.createdAt || undefined,
    location: apiUser.country || apiUser.location || undefined,
    phoneNumber: apiUser.phoneNumber ?? undefined,
    isActive: isActiveValue,
    country: apiUser.country ?? null,
  };
};

export const transformApiUsersToAppUsers = (apiUsers: ApiUser[]): User[] => {
  return apiUsers.map(transformApiUserToAppUser);
};

export const generateUserInitials = (firstName?: string | null, lastName?: string | null): string => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  if (!first && !last) return '??';
  return `${first}${last}`.toUpperCase();
};

export const formatUserStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const isUserActive = (user: User): boolean => {
  return user.status === 'active' && (user.emailVerified || false);
};

export const getUserDisplayName = (user: User): string => {
  return user.fullName || `${user.firstName} ${user.lastName}`.trim();
};


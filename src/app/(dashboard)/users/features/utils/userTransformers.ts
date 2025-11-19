import { User, UserFormData, UserStatus, SubscriptionPlan, UserRole } from '../types/user.types';

// Define proper types for API user data to avoid using 'any'
interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  plan?: SubscriptionPlan;
  role?: UserRole;
  emailVerified?: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
  country?: string | null;
  location?: string;
}

// Convert a User object to UserFormData for editing in forms
// This transforms the data structure for form compatibility
export const transformUserToFormData = (user: User): UserFormData => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone || user.phoneNumber || '',
  role: user.role,
  // Provide default value for optional plan
  plan: user.plan || 'free',
});

// Transform API user data to match the application's User interface
// This handles the conversion from API response format to app format
export const transformApiUserToAppUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  fullName: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
  phone: apiUser.phoneNumber || apiUser.phone || '',
  avatar: apiUser.avatar,
  // Map isActive boolean to UserStatus with fallback
  status: (apiUser.isActive ? 'active' : 'inactive') as UserStatus,
  // Set default plan if not provided by API
  plan: apiUser.plan || 'free',
  // Set default role if not provided by API
  role: apiUser.role || 'user',
  // Set default email verification status if not provided by API
  emailVerified: apiUser.emailVerified || false,
  lastActive: apiUser.lastActive || apiUser.createdAt,
  createdAt: apiUser.createdAt,
  updatedAt: apiUser.updatedAt || apiUser.createdAt,
  location: apiUser.country || apiUser.location,
  // Preserve original API fields
  phoneNumber: apiUser.phoneNumber,
  isActive: apiUser.isActive,
  country: apiUser.country,
});

// Transform multiple API users to application format
// This processes an array of API user objects for consistent data structure
export const transformApiUsersToAppUsers = (apiUsers: ApiUser[]): User[] => {
  return apiUsers.map(transformApiUserToAppUser);
};

// Generate user initials from first and last name for avatars
export const generateUserInitials = (firstName: string, lastName: string): string => {
  // Take first character of each name and convert to uppercase
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

// Format user status for display (capitalize first letter)
export const formatUserStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Check if a user is considered active
// Active means both status is 'active' AND email is verified
export const isUserActive = (user: User): boolean => {
  return user.status === 'active' && (user.emailVerified || false);
};

// Get the display name for a user, preferring fullName if available
export const getUserDisplayName = (user: User): string => {
  // Use fullName if provided, otherwise combine first and last names
  return user.fullName || `${user.firstName} ${user.lastName}`.trim();
};
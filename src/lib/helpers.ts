import { User, UserStatus, SubscriptionPlan } from '../app/(dashboard)/users/features/types/user.types';

export const getUserStatusColor = (status: UserStatus): string => {
  const colorMap: Record<UserStatus, string> = {
    active: '#22c55e',
    inactive: '#ef4444',
    suspended: '#f59e0b',
    pending: '#6b7280',
  };
  return colorMap[status];
};

export const getSubscriptionPlanColor = (plan: SubscriptionPlan): string => {
  const colorMap: Record<SubscriptionPlan, string> = {
    free: '#3b82f6',
    basic: '#8b5cf6',
    premium: '#f59e0b',
    enterprise: '#ef4444',
  };
  return colorMap[plan];
};

export const formatUserCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const shouldShowWarning = (user: User): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (user.status === 'inactive') {
    return true;
  }
  
  if (user.lastActive) {
    return new Date(user.lastActive) < thirtyDaysAgo;
  }
  
  return false;
};

// Additional utility functions for better user management
export const getUserDisplayName = (user: User): string => {
  return user.fullName || `${user.firstName} ${user.lastName}`.trim();
};

export const isUserActive = (user: User): boolean => {
  // Ensure emailVerified is treated as boolean
  const isVerified = Boolean(user.emailVerified);
  return user.status === 'active' && isVerified;
};

export const getUserInitials = (user: User): string => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const formatLastActive = (lastActive?: string): string => {
  if (!lastActive) return 'Never';
  
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const canUserBeDeleted = (user: User): boolean => {
  // Users with active subscriptions or admin roles might have restrictions
  return user.plan === 'free' && user.role === 'user';
};

export const getUserStatusBadgeVariant = (status: UserStatus): 'success' | 'error' | 'warning' | 'default' => {
  const variantMap: Record<UserStatus, 'success' | 'error' | 'warning' | 'default'> = {
    active: 'success',
    inactive: 'error',
    suspended: 'warning',
    pending: 'default',
  };
  return variantMap[status];
};

export const getPlanBadgeVariant = (plan: SubscriptionPlan): 'primary' | 'secondary' | 'warning' | 'info' | 'default' => {
  const variantMap: Record<SubscriptionPlan, 'primary' | 'secondary' | 'warning' | 'info' | 'default'> = {
    free: 'default',
    basic: 'info',
    premium: 'warning',
    enterprise: 'primary',
  };
  return variantMap[plan];
};

// Export all utilities as a single object for easier imports
export const userUtils = {
  getUserStatusColor,
  getSubscriptionPlanColor,
  formatUserCount,
  shouldShowWarning,
  getUserDisplayName,
  isUserActive,
  getUserInitials,
  formatLastActive,
  canUserBeDeleted,
  getUserStatusBadgeVariant,
  getPlanBadgeVariant,
};

export default userUtils;
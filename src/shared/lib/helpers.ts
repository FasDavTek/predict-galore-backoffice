import {
  User,
  UserStatus,
  SubscriptionPlan,
} from '@/features/users';

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
  return user.plan === 'free' && user.role === 'viewer';
};

export const getUserStatusBadgeVariant = (
  status: UserStatus
): 'success' | 'error' | 'warning' | 'default' => {
  const variantMap: Record<UserStatus, 'success' | 'error' | 'warning' | 'default'> = {
    active: 'success',
    inactive: 'error',
    suspended: 'warning',
    pending: 'default',
  };
  return variantMap[status];
};

export const getPlanBadgeVariant = (
  plan: SubscriptionPlan
): 'primary' | 'secondary' | 'warning' | 'info' | 'default' => {
  const variantMap: Record<
    SubscriptionPlan,
    'primary' | 'secondary' | 'warning' | 'info' | 'default'
  > = {
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

// ====================
// Time Range Utilities
// ====================

import type { TimeRange } from '@/shared/types/common.types';

/**
 * Convert TimeRange to date filter object with from/to dates
 * Returns ISO date strings in format YYYY-MM-DD
 */
export const getTimeRangeDates = (timeRange: TimeRange): { from: string; to: string } | null => {
  const now = new Date();
  const to = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  let from: string;

  switch (timeRange) {
    case 'today':
      from = to;
      break;
    case 'thisWeek':
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      from = weekAgo.toISOString().split('T')[0];
      break;
    case 'thisMonth':
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      from = monthAgo.toISOString().split('T')[0];
      break;
    case 'lastMonth':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: lastMonthStart.toISOString().split('T')[0],
        to: lastMonthEnd.toISOString().split('T')[0],
      };
    case 'thisYear':
      const yearStart = new Date(now.getFullYear(), 0, 1);
      from = yearStart.toISOString().split('T')[0];
      break;
    case 'default':
    default:
      // All time - return null to indicate no date filter
      return null;
  }

  return { from, to };
};

/**
 * Convert TimeRange to UTC date-time strings for API calls
 * Returns ISO date-time strings in UTC format
 */
export const getTimeRangeUtcDates = (timeRange: TimeRange): { fromUtc?: string; toUtc?: string } | null => {
  const dates = getTimeRangeDates(timeRange);
  if (!dates) return null;

  // Convert to UTC date-time strings (start of day for from, end of day for to)
  const fromDate = new Date(`${dates.from}T00:00:00.000Z`);
  const toDate = new Date(`${dates.to}T23:59:59.999Z`);

  return {
    fromUtc: fromDate.toISOString(),
    toUtc: toDate.toISOString(),
  };
};

export default userUtils;

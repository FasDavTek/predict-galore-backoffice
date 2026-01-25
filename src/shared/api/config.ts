/**
 * Shared API Configuration
 * Centralized API endpoints and configuration
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com',
  endpoints: {
    // Auth
    auth: {
      signin: '/api/v1/Admin/auth/signin',
      signup: '/api/v1/Admin/user/register',
      profile: '/api/v1/auth/user/me',
      changePassword: '/api/v1/auth/change_password',
      resetPassword: '/api/v1/auth/forgot_password/reset-password',
      confirmResetToken: '/api/v1/auth/user/confirm-reset-token',
      checkEmail: '/api/v1/auth/user/check-email',
    },
    // Users
    users: {
      list: '/api/v1/admin/users',
      detail: (userId: string) => `/api/v1/admin/users/${userId}`,
      analytics: '/api/v1/admin/users/summary',
      create: '/api/v1/admin/users/create',
      updateStatus: (userId: string) => `/api/v1/admin/users/${userId}/status`,
      assignPermissions: '/api/v1/admin/users/permissions/assign/user',
      export: '/api/v1/admin/users/export',
    },
    // Dashboard
    dashboard: {
      summary: '/api/v1/dashboard/summary',
      analytics: '/api/v1/dashboard/summary',
      activity: '/api/v1/dashboard/activity',
      traffic: '/api/v1/dashboard/traffic',
      engagement: '/api/v1/dashboard/engagement',
    },
    // Transactions
    transactions: {
      list: '/api/v1/transactions',
      detail: (id: string) => `/api/v1/transactions/${id}`,
      analytics: '/api/v1/transactions/summary',
      export: '/api/v1/admin/transactions/export',
      update: (id: string) => `/api/v1/admin/transactions/${id}`,
    },
    // Predictions
    predictions: {
      list: '/api/v1/prediction',
      detail: (id: string) => `/api/v1/prediction/${id}`,
      create: '/api/v1/prediction',
      update: (id: string) => `/api/v1/prediction/${id}`,
      delete: (id: string) => `/api/v1/prediction/${id}`,
      analytics: '/api/v1/prediction/analytics',
      huddles: '/api/v1/huddle/ask',
    },
    // Sports Data
    sports: {
      list: '/api/v1/sports',
    },
    // Leagues Data
    leagues: {
      list: '/api/v1/leagues',
    },
    // Fixtures Data
    fixtures: {
      upcoming: '/api/v1/fixtures/upcoming',
    },
    // Markets Data
    markets: {
      list: '/api/v1/prediction/markets',
    },
    // Selections Data
    selections: {
      list: (marketId: number) => `/api/v1/prediction/markets/${marketId}/selections`,
    },
    // Settings
    settings: {
      profile: '/api/v1/auth/user/me',
      profileUpdate: '/api/v1/auth/user/me',
      security: '/api/v1/admin/settings/security',
      securityUpdate: '/api/v1/admin/settings/password/change',
      notifications: '/api/v1/admin/settings/notifications',
      notificationsUpdate: '/api/v1/admin/settings/notifications/update',
      integrations: '/api/v1/integrations',
      integration: (id: string) => `/api/v1/integrations/${id}`,
      teams: '/api/v1/admin/settings/teams',
      teamMember: (id: string) => `/api/v1/admin/settings/teams/${id}`,
      twoFactor: '/api/v1/admin/settings/2fa/toggle',
    },
    // Notifications
    notifications: {
      list: '/api/v1/notifications',
      markRead: (id: string) => `/api/v1/notifications/${id}/read`,
      markAllRead: '/api/v1/notifications/read-all',
      unreadCount: '/api/v1/notifications/unread-count',
      delete: (id: string) => `/api/v1/notifications/${id}`,
    },
  },
  defaults: {
    pageSize: 10,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
} as const;


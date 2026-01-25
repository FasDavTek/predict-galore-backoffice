/**
 * Notifications API Types
 */

import type { Notification } from '../model/types';

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    total: number;
    unread: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message?: string;
  errors?: null | unknown;
  data: {
    unreadCount: number;
  };
}

// Re-export domain types
export type { Notification };


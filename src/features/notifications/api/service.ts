/**
 * Notifications Service
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import type {
  NotificationsResponse,
  UnreadCountResponse,
  Notification,
} from './types';

export class NotificationsService {
  static async getNotifications(): Promise<{
    notifications: Notification[];
    total: number;
    unread: number;
  }> {
    const response = await api.get<NotificationsResponse>(
      API_CONFIG.endpoints.notifications.list
    );
    return response.data;
  }

  static async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<UnreadCountResponse>(
        API_CONFIG.endpoints.notifications.unreadCount
      );

      // Handle the actual API response structure: { success, message, errors, data: { unreadCount } }
      if (response && typeof response === 'object' && 'data' in response) {
        const responseData = response.data;

        if (typeof responseData === 'number') {
          return responseData;
        }

        if (typeof responseData === 'object' && responseData !== null) {
          const dataObj = responseData as Record<string, unknown>;

          // Check for unreadCount field (current API structure)
          if ('unreadCount' in dataObj && typeof dataObj.unreadCount === 'number') {
            return dataObj.unreadCount;
          }

          // Fallback: check for count field (legacy structure)
          if ('count' in dataObj && typeof dataObj.count === 'number') {
            return dataObj.count;
          }

          // Handle double-nested structure
          if ('data' in dataObj && typeof dataObj.data === 'object' && dataObj.data !== null) {
            const nestedData = dataObj.data as Record<string, unknown>;
            if ('unreadCount' in nestedData && typeof nestedData.unreadCount === 'number') {
              return nestedData.unreadCount;
            }
            if ('count' in nestedData && typeof nestedData.count === 'number') {
              return nestedData.count;
            }
          }
        }
      }

      console.warn('Unexpected response structure for unread count, returning 0');
      return 0;
    } catch (error) {
      console.warn('Failed to fetch unread notifications count, returning 0:', error);
      return 0;
    }
  }

  static async markAsRead(id: number): Promise<void> {
    await api.post(API_CONFIG.endpoints.notifications.markRead(String(id)));
  }

  static async markAllAsRead(): Promise<void> {
    await api.post(API_CONFIG.endpoints.notifications.markAllRead);
  }

  static async deleteNotification(id: number): Promise<void> {
    await api.delete(API_CONFIG.endpoints.notifications.delete(String(id)));
  }
}


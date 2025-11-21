// /app/(dashboard)/dashboard/features/api/notificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

// Types
interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  content?: string;
  notificationType?: string;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
}

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  total?: number;
  unreadCount?: number;
}

interface NotificationStatsResponse {
  success: boolean;
  data: {
    unreadCount: number;
    total: number;
  };
}

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notifications', 'NotificationStats'],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => '/api/v1/notifications',
      providesTags: ['Notifications'],
    }),

    // Get notification stats (unread count, etc.)
    getNotificationStats: builder.query<NotificationStatsResponse, void>({
      query: () => '/api/v1/notifications/stats',
      providesTags: ['NotificationStats'],
    }),

    // Mark single notification as read
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (notificationId) => ({
        url: `/api/v1/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<MarkAsReadResponse, void>({
      query: () => ({
        url: '/api/v1/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Delete single notification
    deleteNotification: builder.mutation<DeleteNotificationResponse, string>({
      query: (notificationId) => ({
        url: `/api/v1/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Delete all notifications
    deleteAllNotifications: builder.mutation<DeleteNotificationResponse, void>({
      query: () => ({
        url: '/api/v1/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Create new notification (optional - if you need to send notifications)
    createNotification: builder.mutation<MarkAsReadResponse, Partial<Notification>>({
      query: (notificationData) => ({
        url: '/api/v1/notifications',
        method: 'POST',
        body: notificationData,
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useCreateNotificationMutation,
} = notificationApi;
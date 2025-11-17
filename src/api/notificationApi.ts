// features/dashboard/api/notificationApi.ts
import { apiSlice } from "../slices/api/apiSlice";

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

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/api/v1/notifications",
      providesTags: ['Notifications'],
    }),

    // Get notification stats (unread count, etc.)
    getNotificationStats: builder.query<{ unreadCount: number; total: number }, void>({
      query: () => "/api/v1/notifications/stats",
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
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
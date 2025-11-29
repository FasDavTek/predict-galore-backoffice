// /app/(dashboard)/dashboard/features/api/notificationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { RootState } from '../../store/store';

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

interface NotificationStats {
  unreadCount: number;
  total: number;
}

interface NotificationStatsResponse {
  success: boolean;
  data: NotificationStats;
}

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';

type LoggingBaseQueryArgs = FetchArgs;

// Professional error formatter
const formatApiError = (error: FetchBaseQueryError, method: string, url: string): string => {
  const { status, data } = error;
  
  if (data && typeof data === 'object' && data !== null) {
    const apiError = data as { message?: string; status?: string; statusCode?: string };
    const parts = [
      apiError.message,
      apiError.status && `Status: ${apiError.status}`,
      apiError.statusCode && `Code: ${apiError.statusCode}`
    ].filter(Boolean);
    
    return `❌ ${method} ${url} - ${parts.join(' | ')}`;
  }
  
  return `❌ ${method} ${url} - Status: ${status || 'UNKNOWN'}`;
};

// Calculate stats from notifications array
const calculateNotificationStats = (notifications: Notification[]): NotificationStats => {
  const total = notifications.length;
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  return {
    total,
    unreadCount
  };
};

// Modern, professional logging base query
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = 'GET' } = args;
  const isDevelopment = process.env.NODE_ENV === 'development';

  const startGroup = () => isDevelopment && console.group(`🚀 ${method} ${url}`);
  const endGroup = () => isDevelopment && console.groupEnd();

  startGroup();

  try {
    const result = await fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: (headers: Headers, { getState }) => {
        const state = getState() as RootState;
        const { token } = state.auth;
        
        headers.set('Content-Type', 'application/json');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        
        return headers;
      },
    })(args, api, extraOptions);

    if (result.error) {
      const errorMessage = formatApiError(result.error, method, url);
      console.error(errorMessage);
    }

    endGroup();
    return result;
  } catch (error) {
    const errorMessage = `💥 ${method} ${url} - ${
      error instanceof Error ? error.message : 'Unknown fetch error'
    }`;
    console.error(errorMessage);
    
    endGroup();

    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : 'Unknown fetch error',
      } as FetchBaseQueryError,
    };
  }
};

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: loggingBaseQuery,
  tagTypes: ['Notifications', 'NotificationStats'],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({ url: '/api/v1/notifiation' }),
      providesTags: ['Notifications'],
    }),

    // Get notification stats calculated from notifications data
    getNotificationStats: builder.query<NotificationStatsResponse, void>({
      query: () => ({ url: '/api/v1/notifiation' }),
      transformResponse: (response: NotificationsResponse): NotificationStatsResponse => {
        const notifications = response.data || [];
        const stats = calculateNotificationStats(notifications);
        
        return {
          success: true,
          data: stats
        };
      },
      providesTags: ['NotificationStats'],
    }),

    // Mark single notification as read
    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (notificationId) => ({
        url: `/api/v1/notifiation/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<MarkAsReadResponse, void>({
      query: () => ({
        url: '/api/v1/notifiation/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Delete single notification
    deleteNotification: builder.mutation<DeleteNotificationResponse, string>({
      query: (notificationId) => ({
        url: `/api/v1/notifiation/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Delete all notifications
    deleteAllNotifications: builder.mutation<DeleteNotificationResponse, void>({
      query: () => ({
        url: '/api/v1/notifiation',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'NotificationStats'],
    }),

    // Create new notification (optional - if you need to send notifications)
    createNotification: builder.mutation<MarkAsReadResponse, Partial<Notification>>({
      query: (notificationData) => ({
        url: '/api/v1/notifiation',
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
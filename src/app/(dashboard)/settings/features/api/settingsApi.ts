// features/api/settingsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {
  UserProfile,
  NotificationSettings,
  TeamMember,
  SystemRole,
  Integration,
  ApiResponse,
  UpdateProfilePayload,
  PasswordChangeData,
  TeamInvite,
  RoleFormData,
  UpdateTeamMemberRolePayload,
  Permission,
  TwoFactorPayload,
  NotificationUpdatePayload,
  PermissionCreatePayload,
  PermissionUpdatePayload,
  PermissionAssignPayload
} from '../types';

interface RootState {
  auth: {
    token: string | null;
  };
}

interface ApiErrorData {
  message?: string;
  status?: string;
  statusCode?: string;
  error?: string;
  details?: unknown;
}

interface ApiSuccessData {
  message?: string;
  status?: string;
  data?: unknown;
  success?: boolean;
}

interface SuccessLoggingData {
  method: string;
  url: string;
  duration: number;
  response: ApiSuccessData;
}

interface DetailedLogData {
  endpoint: string;
  method: string;
  timestamp: string;
  duration: number;
  requestData?: unknown;
  responseData?: unknown;
  errorData?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';

type LoggingBaseQueryArgs = FetchArgs;

// Enhanced error formatter with detailed error logging
const formatApiError = (error: FetchBaseQueryError, method: string, url: string): string => {
  const { status, data } = error;
  
  if (data && typeof data === 'object' && data !== null) {
    const apiError = data as ApiErrorData;
    const parts = [
      apiError.message,
      apiError.status && `Status: ${apiError.status}`,
      apiError.statusCode && `Code: ${apiError.statusCode}`,
      apiError.error && `Error: ${apiError.error}`
    ].filter(Boolean);
    
    return `❌ ${method} ${url} - ${parts.join(' | ')}`;
  }
  
  return `❌ ${method} ${url} - Status: ${status || 'UNKNOWN'}`;
};

// Enhanced success formatter
const formatApiSuccess = (loggingData: SuccessLoggingData): string => {
  const { method, url, duration, response } = loggingData;
  
  const parts = [
    response.message,
    response.status && `Status: ${response.status}`,
    `Duration: ${duration}ms`
  ].filter(Boolean);
  
  // Add data summary for specific endpoints
  let dataSummary = '';
  if (url.includes('/profile')) {
    dataSummary = 'Profile data retrieved';
  } else if (url.includes('/team') || url.includes('/users')) {
    const items = response.data;
    if (Array.isArray(items)) {
      dataSummary = `Items: ${items.length}`;
    }
  } else if (url.includes('/permissions')) {
    dataSummary = 'Permissions data processed';
  } else if (url.includes('/roles')) {
    dataSummary = 'Roles data processed';
  }
  
  if (dataSummary) {
    parts.push(dataSummary);
  }
  
  return `✅ ${method} ${url} - ${parts.join(' | ')}`;
};

// Type guard to check if data has array structure
const isArrayData = (data: unknown): data is unknown[] => {
  return Array.isArray(data);
};

// Type guard for API response structure
const isApiResponse = (data: unknown): data is ApiSuccessData => {
  return typeof data === 'object' && data !== null;
};

// Safe JSON stringify for logging
const safeStringify = (obj: unknown, space?: number): string => {
  try {
    return JSON.stringify(obj, null, space);
  } catch {
    return '[Unserializable Object]';
  }
};

// Log detailed request/response data
const logDetailedData = (logData: DetailedLogData): void => {
  const { endpoint, method, timestamp, duration, requestData, responseData, errorData } = logData;
  
  console.group(`🔍 ${method} ${endpoint} - Detailed Log`);
  console.log('📅 Timestamp:', timestamp);
  console.log('⏱️ Duration:', `${duration}ms`);
  
  if (requestData) {
    console.log('📤 Request Data:', requestData);
    console.log('📤 Request Data (JSON):', safeStringify(requestData, 2));
  }
  
  if (responseData) {
    console.log('📥 Response Data:', responseData);
    console.log('📥 Response Data (JSON):', safeStringify(responseData, 2));
  }
  
  if (errorData) {
    console.log('🚨 Error Data:', errorData);
    console.log('🚨 Error Data (JSON):', safeStringify(errorData, 2));
  }
  
  console.groupEnd();
};

// Enhanced base query with detailed logging
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = 'GET', body } = args;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Only log the specific endpoint being called
  const logRequest = () => {
    if (isDevelopment) {
      console.log(`🚀 ${method} ${url}`);
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        console.log('📤 Request Payload:', body);
      }
    }
  };

  const startTime = Date.now();

  try {
    logRequest();

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

    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    if (result.error) {
      const errorMessage = formatApiError(result.error, method, url || '');
      console.error(errorMessage);
      
      // Log detailed error information
      logDetailedData({
        endpoint: url || '',
        method,
        timestamp,
        duration,
        requestData: body || undefined,
        errorData: result.error
      });
      
      // Handle specific error cases
      if (result.error.status === 400 && url?.includes('/auth/user/me')) {
        console.warn('Profile endpoint returned 400 - possible authentication issue');
      }
    } else {
      // Log success with details
      const responseData = isApiResponse(result.data) ? result.data : { data: result.data };
      const successMessage = formatApiSuccess({
        method,
        url: url || '',
        duration,
        response: responseData
      });
      console.log(successMessage);
      
      // Log detailed success information
      logDetailedData({
        endpoint: url || '',
        method,
        timestamp,
        duration,
        requestData: body || undefined,
        responseData: result.data
      });
      
      // Detailed success logging for specific operations
      if (isDevelopment) {
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
          console.log(`📝 ${method} Operation Completed - ${url}`, {
            duration: `${duration}ms`,
            timestamp,
            requestData: body || 'No body',
            responseData: result.data
          });
        }
        
        // Log specific data for GET requests on important endpoints
        if (method === 'GET' && result.data) {
          const apiData = isApiResponse(result.data) ? result.data.data : result.data;
          
          if (url?.includes('/team') || url?.includes('/users')) {
            if (isArrayData(apiData)) {
              console.log(`👥 Team Members Count: ${apiData.length}`);
              console.log('👥 Team Members Data:', apiData);
            }
          } else if (url?.includes('/permissions')) {
            if (isArrayData(apiData)) {
              console.log(`🔐 Permissions Count: ${apiData.length}`);
              console.log('🔐 Permissions Data:', apiData);
            }
          } else if (url?.includes('/roles')) {
            if (isArrayData(apiData)) {
              console.log(`🎭 Roles Count: ${apiData.length}`);
              console.log('🎭 Roles Data:', apiData);
            }
          } else if (url?.includes('/profile')) {
            console.log('👤 Profile Data:', apiData);
          } else if (url?.includes('/integrations')) {
            if (isArrayData(apiData)) {
              console.log(`🔗 Integrations Count: ${apiData.length}`);
              console.log('🔗 Integrations Data:', apiData);
            }
          }
        }
      }
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const errorMessage = `💥 ${method} ${url} - ${
      error instanceof Error ? error.message : 'Unknown fetch error'
    } (${duration}ms)`;
    
    console.error(errorMessage);
    
    // Log detailed error information for fetch errors
    logDetailedData({
      endpoint: url || '',
      method,
      timestamp,
      duration,
      requestData: body || undefined,
      errorData: {
        type: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown fetch error',
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : 'Unknown fetch error',
      } as FetchBaseQueryError,
    };
  }
};

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: loggingBaseQuery,
  tagTypes: ['Profile', 'Notifications', 'Team', 'Roles', 'Integrations', 'Permissions'],
  endpoints: (builder) => ({
    // Profile endpoints with enhanced error handling
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({ 
        url: '/api/v1/auth/user/me',
        timeout: 10000,
      }),
      providesTags: ['Profile'],
      extraOptions: { maxRetries: 2 },
    }),

    // Alternative profile endpoint as fallback
    getAdminProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({ 
        url: '/api/v1/admin/settings/profile',
        timeout: 10000,
      }),
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfilePayload>({
      query: (profileData) => ({
        url: '/api/v1/admin/settings/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Password change endpoint
    changePassword: builder.mutation<ApiResponse<{ success: boolean }>, PasswordChangeData>({
      query: (passwordData) => ({
        url: '/api/v1/admin/settings/password/change',
        method: 'POST',
        body: passwordData,
      }),
    }),

    // Two-factor authentication
    toggleTwoFactor: builder.mutation<ApiResponse<{ enabled: boolean }>, TwoFactorPayload>({
      query: (data) => ({
        url: '/api/v1/admin/settings/2fa/toggle',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Notifications endpoints
    getNotificationSettings: builder.query<ApiResponse<NotificationSettings>, void>({
      query: () => ({ url: '/api/v1/notifiation' }),
      providesTags: ['Notifications'],
    }),

    updateNotificationSettings: builder.mutation<ApiResponse<NotificationSettings>, NotificationUpdatePayload>({
      query: (settings) => ({
        url: '/api/v1/admin/settings/notifications/update',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Notifications'],
    }),

    // Permissions endpoints
    getPermissions: builder.query<ApiResponse<Permission[]>, void>({
      query: () => ({ url: '/api/v1/admin/settings/permissions' }),
      providesTags: ['Permissions'],
    }),

    createPermission: builder.mutation<ApiResponse<Permission>, PermissionCreatePayload>({
      query: (permissionData) => ({
        url: '/api/v1/admin/settings/permissions/create',
        method: 'POST',
        body: permissionData,
      }),
      invalidatesTags: ['Permissions'],
    }),

    updatePermission: builder.mutation<ApiResponse<Permission>, PermissionUpdatePayload>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/admin/settings/permissions/edit/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Permissions'],
    }),

    deletePermission: builder.mutation<ApiResponse<{ success: boolean }>, number>({
      query: (id) => ({
        url: `/api/v1/admin/settings/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permissions'],
    }),

    assignPermissionsToRole: builder.mutation<ApiResponse<{ success: boolean }>, PermissionAssignPayload>({
      query: (data) => ({
        url: '/api/v1/admin/settings/permissions/assign/role',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles', 'Permissions'],
    }),

    // Team endpoints
    getTeamMembers: builder.query<ApiResponse<TeamMember[]>, void>({
      query: () => ({ url: '/api/v1/admin/users' }),
      providesTags: ['Team'],
    }),

    inviteTeamMembers: builder.mutation<ApiResponse<{ invited: string[] }>, TeamInvite[]>({
      query: (invites) => ({
        url: '/api/v1/admin/settings/team/invite',
        method: 'POST',
        body: { emails: invites },
      }),
      invalidatesTags: ['Team'],
    }),

    updateTeamMemberRole: builder.mutation<ApiResponse<TeamMember>, UpdateTeamMemberRolePayload>({
      query: ({ memberId, newRole }) => ({
        url: `/api/v1/admin/settings/team/${memberId}/role`,
        method: 'PUT',
        body: { role: newRole },
      }),
      invalidatesTags: ['Team'],
    }),

    removeTeamMember: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (memberId) => ({
        url: `/api/v1/admin/settings/team/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),

    // Roles endpoints
    getRoles: builder.query<ApiResponse<SystemRole[]>, void>({
      query: () => ({ url: '/api/v1/admin/settings/roles' }),
      providesTags: ['Roles'],
    }),

    createRole: builder.mutation<ApiResponse<SystemRole>, RoleFormData>({
      query: (roleData) => ({
        url: '/api/v1/admin/settings/roles/create',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),

    updateRole: builder.mutation<ApiResponse<SystemRole>, { roleId: string; roleData: RoleFormData }>({
      query: ({ roleId, roleData }) => ({
        url: `/api/v1/admin/settings/roles/edit/${roleId}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),

    deleteRole: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (roleId) => ({
        url: `/api/v1/admin/settings/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Integrations endpoints
    getIntegrations: builder.query<ApiResponse<Integration[]>, void>({
      query: () => ({ url: '/api/v1/admin/settings/integrations' }),
      providesTags: ['Integrations'],
    }),

    updateIntegration: builder.mutation<ApiResponse<Integration>, { id: string; integrationData: Partial<Integration> }>({
      query: ({ id, integrationData }) => ({
        url: `/api/v1/admin/settings/integrations/${id}`,
        method: 'PUT',
        body: integrationData,
      }),
      invalidatesTags: ['Integrations'],
    }),

    toggleIntegrationNotifications: builder.mutation<ApiResponse<{ enabled: boolean }>, boolean>({
      query: (enabled) => ({
        url: '/api/v1/admin/settings/integrations/notifications',
        method: 'PUT',
        body: { enabled },
      }),
      invalidatesTags: ['Integrations'],
    }),
  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useGetAdminProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useAssignPermissionsToRoleMutation,
  useGetTeamMembersQuery,
  useInviteTeamMembersMutation,
  useUpdateTeamMemberRoleMutation,
  useRemoveTeamMemberMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetIntegrationsQuery,
  useUpdateIntegrationMutation,
  useToggleIntegrationNotificationsMutation,
} = settingsApi;
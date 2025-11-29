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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';

type LoggingBaseQueryArgs = FetchArgs;

// Enhanced error formatter with better error handling
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

// Enhanced base query with better error handling and retry logic
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
      
      // Handle specific error cases
      if (result.error.status === 400 && url?.includes('/auth/user/me')) {
        console.warn('Profile endpoint returned 400 - possible authentication issue');
      }
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

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: loggingBaseQuery,
  tagTypes: ['Profile', 'Notifications', 'Team', 'Roles', 'Integrations', 'Permissions'],
  endpoints: (builder) => ({
    // Profile endpoints with enhanced error handling
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({ 
        url: '/api/v1/auth/user/me',
        // Add timeout and retry logic
        timeout: 10000,
      }),
      providesTags: ['Profile'],
      // Retry on certain errors but not on 400s
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
      query: () => ({ url: '/api/v1/teams' }),
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
  useGetAdminProfileQuery, // New fallback hook
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
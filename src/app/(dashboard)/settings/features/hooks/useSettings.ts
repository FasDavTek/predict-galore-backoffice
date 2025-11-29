import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserProfile,
  NotificationSettings,
  TeamMember,
  SystemRole,
  Integration,
  UpdateProfilePayload,
  PasswordChangeData,
  TeamInvite,
  RoleFormData,
  UpdateTeamMemberRolePayload,
  Permission,
  NotificationUpdatePayload,
  PermissionCreatePayload,
  PermissionUpdatePayload,
  PermissionAssignPayload
} from '../types';
import {
  useGetProfileQuery,
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
} from '../api/settingsApi';
import {
  setTeamRoleFilter,
  toggleTwoFactor,
  clearProfileError,
  clearPasswordError,
  clearTeamError,
  clearRolesError,
  clearNotificationsError,
  clearIntegrationsError,
} from '../slices/settingsSlice';

interface RootState {
  settings: {
    team: {
      filters: {
        searchQuery: string;
        roleFilter: string;
      };
    };
    security: {
      twoFactorEnabled: boolean;
    };
  };
}

interface UseSettingsReturn {
  // Profile
  profile: UserProfile | undefined;
  isProfileLoading: boolean;
  profileError: string | null;
  updateProfile: (data: UpdateProfilePayload) => Promise<boolean>;
  isUpdatingProfile: boolean;
  refetchProfile: () => void; // Add this line
  
  // Security
  twoFactorEnabled: boolean;
  toggleTwoFactorAuth: (enable: boolean) => Promise<boolean>;
  changePassword: (data: PasswordChangeData) => Promise<boolean>;
  isChangingPassword: boolean;
  passwordError: string | null;
  
  // Notifications
  notificationSettings: NotificationSettings | undefined;
  isNotificationsLoading: boolean;
  notificationsError: string | null;
  updateNotificationSettings: (settings: NotificationUpdatePayload) => Promise<boolean>;
  isUpdatingNotifications: boolean;
  
  // Permissions
  permissions: Permission[];
  isPermissionsLoading: boolean;
  permissionsError: string | null;
  createPermission: (data: PermissionCreatePayload) => Promise<boolean>;
  updatePermission: (data: PermissionUpdatePayload) => Promise<boolean>;
  deletePermission: (id: number) => Promise<boolean>;
  assignPermissionsToRole: (data: PermissionAssignPayload) => Promise<boolean>;
  
  // Team
  teamMembers: TeamMember[];
  isTeamLoading: boolean;
  teamError: string | null;
  teamFilters: {
    searchQuery: string;
    roleFilter: string;
  };
  inviteTeamMembers: (invites: TeamInvite[]) => Promise<boolean>;
  updateTeamMemberRole: (payload: UpdateTeamMemberRolePayload) => Promise<boolean>;
  removeTeamMember: (memberId: string) => Promise<boolean>;
  handleTeamRoleFilter: (role: string) => void;
  
  // Roles
  roles: SystemRole[];
  isRolesLoading: boolean;
  rolesError: string | null;
  createRole: (data: RoleFormData) => Promise<boolean>;
  updateRole: (roleId: string, data: RoleFormData) => Promise<boolean>;
  deleteRole: (roleId: string) => Promise<boolean>;
  
  // Integrations
  integrations: Integration[];
  isIntegrationsLoading: boolean;
  integrationsError: string | null;
  updateIntegration: (id: string, data: Partial<Integration>) => Promise<boolean>;
  toggleIntegrationNotifications: (enabled: boolean) => Promise<boolean>;
  
  // Error clearing
  clearErrors: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  const dispatch = useDispatch();
  
  // Profile - Add refetch function here
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile, // Add this line to destructure refetch
  } = useGetProfileQuery();
  
  const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  
  // Security
  const [changePasswordMutation, { isLoading: isChangingPassword, error: passwordError }] = useChangePasswordMutation();
  const [toggleTwoFactorMutation] = useToggleTwoFactorMutation();
  
  // Notifications
  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useGetNotificationSettingsQuery();
  
  const [updateNotificationSettingsMutation, { isLoading: isUpdatingNotifications }] = useUpdateNotificationSettingsMutation();
  
  // Permissions
  const {
    data: permissionsData,
    isLoading: isPermissionsLoading,
    error: permissionsError,
  } = useGetPermissionsQuery();
  
  const [createPermissionMutation] = useCreatePermissionMutation();
  const [updatePermissionMutation] = useUpdatePermissionMutation();
  const [deletePermissionMutation] = useDeletePermissionMutation();
  const [assignPermissionsToRoleMutation] = useAssignPermissionsToRoleMutation();
  
  // Team
  const {
    data: teamData,
    isLoading: isTeamLoading,
    error: teamError,
  } = useGetTeamMembersQuery();
  
  const [inviteTeamMembersMutation] = useInviteTeamMembersMutation();
  const [updateTeamMemberRoleMutation] = useUpdateTeamMemberRoleMutation();
  const [removeTeamMemberMutation] = useRemoveTeamMemberMutation();
  
  // Roles
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    error: rolesError,
  } = useGetRolesQuery();
  
  const [createRoleMutation] = useCreateRoleMutation();
  const [updateRoleMutation] = useUpdateRoleMutation();
  const [deleteRoleMutation] = useDeleteRoleMutation();
  
  // Integrations
  const {
    data: integrationsData,
    isLoading: isIntegrationsLoading,
    error: integrationsError,
  } = useGetIntegrationsQuery();
  
  const [updateIntegrationMutation] = useUpdateIntegrationMutation();
  const [toggleIntegrationNotificationsMutation] = useToggleIntegrationNotificationsMutation();
  
  // Team filters from Redux
  const teamFilters = useSelector((state: RootState) => state.settings.team.filters);
  const twoFactorEnabled = useSelector((state: RootState) => state.settings.security.twoFactorEnabled);
  
  const handleTeamRoleFilter = useCallback((role: string) => {
    dispatch(setTeamRoleFilter(role));
  }, [dispatch]);
  
  // Memoized data
  const profile = useMemo(() => profileData?.data, [profileData]);
  const notificationSettings = useMemo(() => notificationsData?.data, [notificationsData]);
  const permissions = useMemo(() => permissionsData?.data || [], [permissionsData]);
  const teamMembers = useMemo(() => teamData?.data || [], [teamData]);
  const roles = useMemo(() => rolesData?.data || [], [rolesData]);
  const integrations = useMemo(() => integrationsData?.data || [], [integrationsData]);
  
  // Action handlers
  const updateProfile = useCallback(async (data: UpdateProfilePayload): Promise<boolean> => {
    try {
      await updateProfileMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updateProfileMutation]);
  
  const changePassword = useCallback(async (data: PasswordChangeData): Promise<boolean> => {
    try {
      await changePasswordMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [changePasswordMutation]);
  
  const toggleTwoFactorAuth = useCallback(async (enable: boolean): Promise<boolean> => {
    try {
      await toggleTwoFactorMutation({ enable }).unwrap();
      dispatch(toggleTwoFactor());
      return true;
    } catch {
      return false;
    }
  }, [toggleTwoFactorMutation, dispatch]);
  
  const updateNotificationSettings = useCallback(async (settings: NotificationUpdatePayload): Promise<boolean> => {
    try {
      await updateNotificationSettingsMutation(settings).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updateNotificationSettingsMutation]);
  
  const createPermission = useCallback(async (data: PermissionCreatePayload): Promise<boolean> => {
    try {
      await createPermissionMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [createPermissionMutation]);
  
  const updatePermission = useCallback(async (data: PermissionUpdatePayload): Promise<boolean> => {
    try {
      await updatePermissionMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updatePermissionMutation]);
  
  const deletePermission = useCallback(async (id: number): Promise<boolean> => {
    try {
      await deletePermissionMutation(id).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [deletePermissionMutation]);
  
  const assignPermissionsToRole = useCallback(async (data: PermissionAssignPayload): Promise<boolean> => {
    try {
      await assignPermissionsToRoleMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [assignPermissionsToRoleMutation]);
  
  const inviteTeamMembers = useCallback(async (invites: TeamInvite[]): Promise<boolean> => {
    try {
      await inviteTeamMembersMutation(invites).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [inviteTeamMembersMutation]);
  
  const updateTeamMemberRole = useCallback(async ({ memberId, newRole }: UpdateTeamMemberRolePayload): Promise<boolean> => {
    try {
      await updateTeamMemberRoleMutation({ memberId, newRole }).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updateTeamMemberRoleMutation]);
  
  const removeTeamMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      await removeTeamMemberMutation(memberId).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [removeTeamMemberMutation]);
  
  const createRole = useCallback(async (data: RoleFormData): Promise<boolean> => {
    try {
      await createRoleMutation(data).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [createRoleMutation]);
  
  const updateRole = useCallback(async (roleId: string, data: RoleFormData): Promise<boolean> => {
    try {
      await updateRoleMutation({ roleId, roleData: data }).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updateRoleMutation]);
  
  const deleteRole = useCallback(async (roleId: string): Promise<boolean> => {
    try {
      await deleteRoleMutation(roleId).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [deleteRoleMutation]);
  
  const updateIntegration = useCallback(async (id: string, data: Partial<Integration>): Promise<boolean> => {
    try {
      await updateIntegrationMutation({ id, integrationData: data }).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [updateIntegrationMutation]);
  
  const toggleIntegrationNotifications = useCallback(async (enabled: boolean): Promise<boolean> => {
    try {
      await toggleIntegrationNotificationsMutation(enabled).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [toggleIntegrationNotificationsMutation]);
  
  const clearErrors = useCallback(() => {
    dispatch(clearProfileError());
    dispatch(clearPasswordError());
    dispatch(clearTeamError());
    dispatch(clearRolesError());
    dispatch(clearNotificationsError());
    dispatch(clearIntegrationsError());
  }, [dispatch]);
  
  return {
    // Profile
    profile,
    isProfileLoading,
    profileError: profileError ? 'Failed to load profile' : null,
    updateProfile,
    isUpdatingProfile,
    refetchProfile, // Add this line to return the refetch function
    
    // Security
    twoFactorEnabled,
    toggleTwoFactorAuth,
    changePassword,
    isChangingPassword,
    passwordError: passwordError ? 'Failed to change password' : null,
    
    // Notifications
    notificationSettings,
    isNotificationsLoading,
    notificationsError: notificationsError ? 'Failed to load notification settings' : null,
    updateNotificationSettings,
    isUpdatingNotifications,
    
    // Permissions
    permissions,
    isPermissionsLoading,
    permissionsError: permissionsError ? 'Failed to load permissions' : null,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissionsToRole,
    
    // Team
    teamMembers,
    isTeamLoading,
    teamError: teamError ? 'Failed to load team members' : null,
    teamFilters,
    inviteTeamMembers,
    updateTeamMemberRole,
    removeTeamMember,
    handleTeamRoleFilter,
    
    // Roles
    roles,
    isRolesLoading,
    rolesError: rolesError ? 'Failed to load roles' : null,
    createRole,
    updateRole,
    deleteRole,
    
    // Integrations
    integrations,
    isIntegrationsLoading,
    integrationsError: integrationsError ? 'Failed to load integrations' : null,
    updateIntegration,
    toggleIntegrationNotifications,
    
    // Error clearing
    clearErrors,
  };
};
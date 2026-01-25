/**
 * Settings API Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from './service';
import type {
  UpdateProfileData,
  UpdateNotificationSettingsData,
  UpdateIntegrationData,
  InviteTeamMemberData,
  UpdateTeamMemberRoleData,
  UpdatePasswordData,
  UpdateSecurityData,
} from './types';

export function useProfileSettings() {
  return useQuery({
    queryKey: ['profile-settings'],
    queryFn: async () => {
      return await SettingsService.getProfile();
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await SettingsService.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      return await SettingsService.getNotificationSettings();
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNotificationSettingsData) => {
      return await SettingsService.updateNotificationSettings(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });
}

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      return await SettingsService.getIntegrations();
    },
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateIntegrationData) => {
      return await SettingsService.updateIntegration(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      return await SettingsService.getTeamMembers();
    },
  });
}

export function useInviteTeamMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteTeamMemberData) => {
      return await SettingsService.inviteTeamMember(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTeamMemberRoleData) => {
      return await SettingsService.updateTeamMemberRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await SettingsService.removeTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: UpdatePasswordData) => {
      return await SettingsService.updatePassword(data);
    },
  });
}

export function useToggleTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      return await SettingsService.toggleTwoFactor(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
    },
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      return await SettingsService.getSecuritySettings();
    },
  });
}

export function useUpdateSecurity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSecurityData) => {
      return await SettingsService.updateSecurity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-settings'] });
    },
  });
}


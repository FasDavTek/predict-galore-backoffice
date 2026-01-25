/**
 * Settings API Types
 */

import type {
  UserProfile,
  UpdateProfileData,
  NotificationSettings,
  UpdateNotificationSettingsData,
  Integration,
  UpdateIntegrationData,
  TeamMember,
  InviteTeamMemberData,
  UpdateTeamMemberRoleData,
  UpdatePasswordData,
  SecuritySettings,
  UpdateSecurityData,
} from '../model/types';

export interface ProfileSettingsResponse {
  success: boolean;
  message?: string;
  errors?: null | unknown;
  data: UserProfile;
}

export interface NotificationSettingsResponse {
  success: boolean;
  data: NotificationSettings;
}

export interface IntegrationsResponse {
  success: boolean;
  data: Integration[];
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
}

export interface SecuritySettingsResponse {
  success: boolean;
  data: SecuritySettings;
}

// Re-export domain types
export type {
  UserProfile,
  UpdateProfileData,
  NotificationSettings,
  UpdateNotificationSettingsData,
  Integration,
  UpdateIntegrationData,
  TeamMember,
  InviteTeamMemberData,
  UpdateTeamMemberRoleData,
  UpdatePasswordData,
  SecuritySettings,
  UpdateSecurityData,
};


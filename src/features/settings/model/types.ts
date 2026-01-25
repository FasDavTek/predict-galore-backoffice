/**
 * Settings Domain Types
 */

export interface UserProfile {
  isBlackListed: boolean;
  basicDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
  };
  securityConfig: SecuritySettings | null;
  notificationSettings: NotificationSettings | null;
  integrations: Integration[] | null;
  currentSubscription: unknown | null;
  teams: TeamMember[] | null;
  code: unknown | null;
  status: unknown | null;
  totalRecords: unknown | null;
  statusCode: unknown | null;
  message: unknown | null;
  data: unknown | null;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
}

export interface NotificationSettings {
  // General notifications
  enableInApp: boolean | null;
  enableEmail: boolean | null;
  enablePush: boolean | null;
  // Prediction notifications
  enableInAppPred: boolean | null;
  enablePushPred: boolean | null;
  enableEmailPred: boolean | null;
  // Payment notifications
  payEnableInApp: boolean | null;
  payEnablePush: boolean | null;
  payEnableEmail: boolean | null;
  // Security notifications
  secEnableInApp: boolean | null;
  secEnablePush: boolean | null;
  secEnableEmail: boolean | null;
}

export type UpdateNotificationSettingsData = Partial<NotificationSettings>;

export interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config?: Record<string, unknown>;
  logo?: string;
  description?: string;
  status?: string;
}

export interface UpdateIntegrationData {
  id: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
  invitedAt?: string;
  joinedAt?: string;
}

export interface InviteTeamMemberData {
  email: string;
  role: string;
}

export interface UpdateTeamMemberRoleData {
  id: string;
  role: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
}

export interface UpdateSecurityData {
  twoFactorEnabled?: boolean;
}


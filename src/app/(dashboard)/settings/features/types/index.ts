import { ITimezone } from 'react-timezone-select';

// Core User Profile Types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  timezone: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Editor' | 'Viewer' | 'user' | 'admin' | 'moderator';

// Security Types
export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorPayload {
  enable: boolean;
}

// Notification Types - Updated to match backend structure
export interface NotificationSettings {
  enableInApp: boolean;
  enableEmail: boolean;
  enablePush: boolean;
  enableSms: boolean;
  enableEmailPred: boolean;
  enableInAppPred: boolean;
  enablePushPred: boolean;
  payEnableEmail: boolean;
  payEnableInApp: boolean;
  payEnablePush: boolean;
  secEnableEmail: boolean;
  secEnableInApp: boolean;
  secEnablePush: boolean;
}

export interface NotificationUpdatePayload {
  enableInApp: boolean;
  enableEmail: boolean;
  enablePush: boolean;
  enableSms: boolean;
  enableEmailPred: boolean;
  enableInAppPred: boolean;
  enablePushPred: boolean;
  payEnableEmail: boolean;
  payEnableInApp: boolean;
  payEnablePush: boolean;
  secEnableEmail: boolean;
  secEnableInApp: boolean;
  secEnablePush: boolean;
}

// Legacy Notification Types (for backward compatibility)
export interface NotificationCategory {
  inApp: boolean;
  push: boolean;
  email: boolean;
}

export interface LegacyNotificationSettings {
  userActivity: NotificationCategory;
  predictionsPosts: NotificationCategory;
  paymentsTransactions: NotificationCategory;
  securityAlerts: NotificationCategory;
}

// Team Management Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateAdded: string;
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  lastActive?: string;
}

export interface TeamInvite {
  email: string;
  role: UserRole;
}

// Roles and Permissions Types
export interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionCreatePayload {
  name: string;
  code: string;
  description: string;
}

export interface PermissionUpdatePayload {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface PermissionAssignPayload {
  roleName: string;
  permissionIds: number[];
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  publicKey: string;
  secretKey: string;
  enabled: boolean;
  logo?: string;
  category: 'payment' | 'analytics' | 'communication' | 'storage';
  configuredAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filter Types
export interface TeamFilters {
  searchQuery: string;
  roleFilter: string;
  statusFilter?: string;
}

// Form Types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  phone?: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

// Component Prop Types
export interface TabComponentProps {
  showNotification: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
}

export interface SettingsState {
  profile: UserProfile | null;
  security: SecuritySettings;
  notifications: NotificationSettings | null;
  team: {
    members: TeamMember[];
    loading: boolean;
    error: string | null;
    filters: TeamFilters;
  };
  roles: {
    list: SystemRole[];
    loading: boolean;
    error: string | null;
  };
  integrations: {
    list: Integration[];
    loading: boolean;
    error: string | null;
    notificationsEnabled: boolean;
  };
  permissions: {
    list: Permission[];
    loading: boolean;
    error: string | null;
  };
  loading: {
    profile: boolean;
    password: boolean;
    notifications: boolean;
    team: boolean;
    roles: boolean;
    integrations: boolean;
    permissions: boolean;
  };
  error: {
    profile: string | null;
    password: string | null;
    notifications: string | null;
    team: string | null;
    roles: string | null;
    integrations: string | null;
    permissions: string | null;
  };
}

// Redux Action Types
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  phone?: string;
}

export interface UpdateTeamMemberRolePayload {
  memberId: string;
  newRole: UserRole;
}

export interface UpdateIntegrationPayload {
  id: string;
  integrationData: Partial<Integration>;
}

// Timezone Type - Use intersection type instead of interface extension
export type SettingsTimezone = ITimezone & {
  value: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
};

// Alternative approach: Create a complete interface without extending
export interface AppTimezone {
  value: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
}

// Helper types for notification mapping
export interface NotificationCategoryMapping {
  userActivity: {
    inApp: keyof NotificationSettings;
    email: keyof NotificationSettings;
    push: keyof NotificationSettings;
  };
  predictionsPosts: {
    inApp: keyof NotificationSettings;
    email: keyof NotificationSettings;
    push: keyof NotificationSettings;
  };
  paymentsTransactions: {
    inApp: keyof NotificationSettings;
    email: keyof NotificationSettings;
    push: keyof NotificationSettings;
  };
  securityAlerts: {
    inApp: keyof NotificationSettings;
    email: keyof NotificationSettings;
    push: keyof NotificationSettings;
  };
}

// Type guards and utility types
export type ApiError = {
  data?: {
    fieldErrors?: Record<string, string>;
    message?: string;
    error?: string;
    detail?: string;
  };
  status?: number;
  error?: string;
  message?: string;
};

export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

export type NotificationType = 'userActivity' | 'predictionsPosts' | 'paymentsTransactions' | 'securityAlerts';
export type NotificationChannel = 'inApp' | 'email' | 'push' | 'sms';
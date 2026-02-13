export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'suspended', label: 'Suspended', color: 'warning' },
  { value: 'pending', label: 'Pending', color: 'default' },
] as const;

export const SUBSCRIPTION_PLANS = [
  { value: 'free', label: 'Free', color: 'info' },
  { value: 'basic', label: 'Basic', color: 'secondary' },
  { value: 'premium', label: 'Premium', color: 'warning' },
  { value: 'enterprise', label: 'Enterprise', color: 'primary' },
] as const;

export const USER_ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

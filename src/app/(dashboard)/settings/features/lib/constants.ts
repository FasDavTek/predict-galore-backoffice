export const AVAILABLE_PERMISSIONS = [
  'View Dashboard',
  'Manage Content',
  'Manage Users',
  'Manage Settings',
  'View Reports',
  'Manage Billing',
  'API Access'
] as const;

export const TEAM_ROLES = [
  'Super Admin',
  'Admin',
  'Editor',
  'Viewer'
] as const;

export const INTEGRATION_CATEGORIES = [
  'payment',
  'analytics',
  'communication',
  'storage'
] as const;

export const NOTIFICATION_CATEGORIES = [
  'userActivity',
  'predictionsPosts',
  'paymentsTransactions',
  'securityAlerts'
] as const;
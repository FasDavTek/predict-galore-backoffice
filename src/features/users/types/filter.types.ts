import { UserStatus, SubscriptionPlan, UserRole } from './user.types';

export interface UserFiltersProps {
  searchTerm: string;
  statusFilter?: UserStatus;
  planFilter?: SubscriptionPlan;
  roleFilter?: UserRole;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: UserStatus) => void;
  onPlanChange: (plan?: SubscriptionPlan) => void;
  onRoleChange: (role?: UserRole) => void;
  onClearFilters: () => void;
}
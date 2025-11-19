import { User } from './user.types';

export interface UsersTableProps {
  users: User[];
  selectedUserIds: string[];
  onUserSelect: (user: User) => void;
  onUserEdit: (user: User) => void;
  onUserDelete: (user: User) => void;
  onToggleSelection: (userId: string) => void;
  onSelectAll: (users: User[]) => void;
  isLoading?: boolean;
  hasError?: boolean; // Add this line
}
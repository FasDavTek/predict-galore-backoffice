export interface UsersToolbarProps {
  selectedCount: number;
  onAddUser: () => void;
  onExportUsers: () => void;
  onRefresh?: () => void;
  onBulkDelete?: () => void;
  onBulkActivate?: () => void;
  onBulkDeactivate?: () => void;
  isLoading?: boolean;
  isExporting?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
}

export interface UsersToolbarWithSearchProps extends UsersToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}
export interface TransactionsToolbarProps {
  selectedCount: number;
  onAddTransaction?: () => void;
  onExportTransactions?: () => void;
  onRefresh?: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
}
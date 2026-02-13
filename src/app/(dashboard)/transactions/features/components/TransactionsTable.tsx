/**
 * Transactions Table Component
 * Clean, simple implementation
 */

'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  InputAdornment,
  Avatar,
  Typography,
  Checkbox,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  TableErrorState,
  TableEmptyState,
  TableLoadingState,
} from '@/shared/components/TableStates';
import { Transaction, TransactionsFilter, TransactionStatus, formatCurrency, formatTransactionStatus } from '@/features/transactions';
import { PaginationMeta } from '@/shared/types/common.types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SelectedTransactionProfile } from './SelectedTransactionProfile';
import { generateUserInitials } from '@/features/users/lib/transformers';
import { useTableExport } from '@/shared/hooks/useTableExport';
import dynamic from 'next/dynamic';

const TransactionFilterDialog = dynamic(
  () => import('./TransactionFilterDialog').then((mod) => mod.TransactionFilterDialog),
  { ssr: false }
);

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: Error | null;
  filters: TransactionsFilter;
  onFilterChange: (filters: Partial<TransactionsFilter>) => void;
  onRefresh: () => void;
  selectedTransaction?: Transaction | null;
  onTransactionSelect?: (transaction: Transaction | null) => void;
  onViewDetails?: (transaction: Transaction) => void;
}

interface TransactionRowProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (transactionId: string | number, transaction: Transaction) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => void;
  extractNameFromEmail: (email: string) => { firstName: string; lastName: string };
  formatDate: (dateString: string) => string;
  getStatusColor: (status: TransactionStatus) => 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const TransactionRow = memo(function TransactionRow({
  transaction,
  isSelected,
  onSelect,
  onMenuOpen,
  extractNameFromEmail,
  formatDate,
  getStatusColor,
}: TransactionRowProps) {
  const name = extractNameFromEmail(transaction.email);
  const userInitials = generateUserInitials(name.firstName, name.lastName);
  const fullName = name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName;
  const plan = transaction.paymentType === 'Subscription' ? 'Monthly' : transaction.paymentType;

  return (
    <TableRow
      hover
      onClick={() => onSelect(String(transaction.id), transaction)}
      sx={{
        cursor: 'pointer',
        bgcolor: isSelected ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
        },
      }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(transaction.id, transaction)}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          #{transaction.reference}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: transaction.status === 'Successful' ? 'success.main' : 'error.main',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {userInitials}
          </Avatar>
          <Typography variant="body2">
            {fullName}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Chip
          label={plan}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(transaction.amount)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {formatDate(transaction.dateCreated)}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={formatTransactionStatus(transaction.status)}
          size="small"
          color={getStatusColor(transaction.status)}
          sx={{
            bgcolor: transaction.status === 'Successful' 
              ? 'success.light' 
              : transaction.status === 'Failed'
              ? 'error.light'
              : undefined,
            color: transaction.status === 'Successful'
              ? 'success.main'
              : transaction.status === 'Failed'
              ? 'error.main'
              : undefined,
          }}
        />
      </TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <IconButton
          size="small"
          onClick={(e) => onMenuOpen(e, transaction)}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export const TransactionsTable = memo(function TransactionsTable({
  transactions,
  pagination,
  isLoading,
  error,
  filters,
  onFilterChange,
  onRefresh,
  selectedTransaction,
  onTransactionSelect,
  onViewDetails,
}: TransactionsTableProps) {
  // CSV Export hook
  const { handleExport, canExport } = useTableExport({
    data: transactions,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'email', label: 'Full Name', format: (value) => {
        // Extract name from email if needed
        const email = String(value || '');
        const name = email.split('@')[0].replace(/[._]/g, ' ');
        return name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
      }},
      { key: 'plan', label: 'Plan', format: (value) => String(value || 'Free') },
      { key: 'amount', label: 'Amount', format: (value) => formatCurrency(Number(value || 0)) },
      { key: 'createdAt', label: 'Date', format: (value) => value ? new Date(String(value)).toLocaleDateString() : '' },
      { key: 'status', label: 'Status', format: (value) => formatTransactionStatus(String(value || '')) },
    ],
    filename: `transactions-${new Date().toISOString().split('T')[0]}`,
  });
  const [search, setSearch] = useState(filters.search || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTransaction, setMenuTransaction] = useState<Transaction | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const selectedId = selectedTransaction ? String(selectedTransaction.id) : null;
  
  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);
  
  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuTransaction(transaction);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setMenuTransaction(null);
  }, []);

  // Extract name from email
  const extractNameFromEmail = useCallback((email: string): { firstName: string; lastName: string } => {
    const emailPart = email.split('@')[0];
    const parts = emailPart.split(/[._-]/);
    if (parts.length >= 2) {
      return {
        firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
        lastName: parts[1].charAt(0).toUpperCase() + parts[1].slice(1),
      };
    }
    return {
      firstName: emailPart.charAt(0).toUpperCase() + emailPart.slice(1),
      lastName: '',
    };
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    onFilterChange({ page });
  }, [onFilterChange]);

  const handleSelectOne = useCallback((transactionId: string | number, transaction: Transaction) => {
    const idStr = String(transactionId);
    // Single-select: if clicking the same item, deselect it; otherwise select the new one
    if (selectedId === idStr) {
      // Deselect if clicking the already selected item
      setTimeout(() => onTransactionSelect?.(null), 0);
    } else {
      // Select the new item (only one at a time)
      setTimeout(() => onTransactionSelect?.(transaction), 0);
    }
  }, [selectedId, onTransactionSelect]);

  const getStatusColor = useCallback((status: TransactionStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'Successful':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  }, []);

  const handleViewDetails = useCallback(() => {
    if (menuTransaction && onViewDetails) {
      onViewDetails(menuTransaction);
      handleMenuClose();
    }
  }, [menuTransaction, onViewDetails, handleMenuClose]);

  const handleFilterDialogOpen = useCallback(() => {
    setFilterDialogOpen(true);
  }, []);

  const handleFilterDialogClose = useCallback(() => {
    setFilterDialogOpen(false);
  }, []);

  const handleFilterApply = useCallback((newFilters: Partial<TransactionsFilter>) => {
    onFilterChange(newFilters);
  }, [onFilterChange]);

  const handleFilterClear = useCallback(() => {
    onFilterChange({
      status: undefined,
      paymentMethod: undefined,
      type: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  }, [onFilterChange]);


  return (
    <Box>
      {/* Selected Transaction Profile */}
      {selectedTransaction && <SelectedTransactionProfile transaction={selectedTransaction} />}

      <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }} alignItems="center">
        {/* Left side: Search and Filters */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search here..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size="small"
            onClick={handleFilterDialogOpen}
          >
            Filter
          </Button>
        </Stack>

        {/* Right side: Action buttons */}
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={!canExport}
        >
          Export CSV
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* Single-select: no select all checkbox */}
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <TableLoadingState message="Loading transactions..." />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableErrorState colSpan={8} message="Failed to load transactions. Please try again." onRetry={onRefresh} />
            ) : transactions.length === 0 ? (
              <TableEmptyState
                colSpan={8}
                message="No transactions found"
                title="No Transactions"
              />
            ) : (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedId === String(transaction.id)}
                  onSelect={handleSelectOne}
                  onMenuOpen={handleMenuOpen}
                  extractNameFromEmail={extractNameFromEmail}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
      </Menu>

      {/* Filter Dialog */}
      <TransactionFilterDialog
        open={filterDialogOpen}
        onClose={handleFilterDialogClose}
        filters={filters}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />
    </Box>
  );
});

/**
 * Users Table Component
 * Clean, simple implementation
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
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
  Pagination,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
  Avatar,
  Typography,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import { designTokens } from '@/shared/styles/tokens';
import {
  TableErrorState,
  TableEmptyState,
  TableLoadingState,
} from '@/shared/components/TableStates';
import { User, UserStatus, SubscriptionPlan, UserRole, UsersFilter, generateUserInitials } from '@/features/users';
import { PaginationMeta } from '@/shared/types/common.types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SelectedUserProfile } from './SelectedUserProfile';
import { useTableExport } from '@/shared/hooks/useTableExport';

interface UsersTableProps {
  users: User[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: Error | null;
  filters: UsersFilter;
  onFilterChange: (filters: Partial<UsersFilter>) => void;
  onClearFilters: () => void;
  onAddUser: () => void;
  onRefresh: () => void;
  selectedUser?: User | null;
  onUserSelect?: (user: User | null) => void;
}

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: string, user: User) => void;
  onViewDetails: (userId: string) => void;
  style?: React.CSSProperties;
}

const UserRow = memo(function UserRow({
  user,
  isSelected,
  onSelect,
  onViewDetails,
  style,
}: UserRowProps) {
  const userInitials = generateUserInitials(user.firstName, user.lastName);

  return (
    <TableRow
      hover
      onClick={() => onSelect(user.id, user)}
      sx={{
        cursor: 'pointer',
        bgcolor: isSelected ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
        },
      }}
      style={style}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(user.id, user)}
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {userInitials}
          </Avatar>
          <Typography variant="body2">
            {`${user.firstName} ${user.lastName}`}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Chip 
          label={user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'} 
          size="small"
          color={user.plan === 'premium' || user.plan === 'enterprise' ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={user.isActive ? 'Active' : 'Inactive'}
          size="small"
          color={user.isActive ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(user.id);
          }}
        >
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );
});

export const UsersTable = memo(function UsersTable({
  users,
  pagination,
  isLoading,
  error,
  filters,
  onFilterChange,
  onClearFilters,
  onAddUser,
  onRefresh,
  selectedUser,
  onUserSelect,
}: UsersTableProps) {
  // CSV Export hook
  const { handleExport, canExport } = useTableExport({
    data: users,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'plan', label: 'Plan', format: (value) => String(value || 'Free') },
      { key: 'status', label: 'Status', format: (value) => String(value || 'active') },
      { key: 'location', label: 'Location' },
      { key: 'createdAt', label: 'Created At', format: (value) => value ? new Date(String(value)).toLocaleDateString() : '' },
    ],
    filename: `users-${new Date().toISOString().split('T')[0]}`,
  });
  const router = useRouter();
  const [search, setSearch] = useState(filters.search || '');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);
  
  // Sync selectedIds with selectedUser (single-select)
  useEffect(() => {
    if (selectedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing derived state from props
      setSelectedIds(new Set([selectedUser.id]));
    } else {
      setSelectedIds(new Set());
    }
  }, [selectedUser]);
  
  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSelectOne = useCallback((userId: string, user: User) => {
    // Single-select: if clicking the same item, deselect it; otherwise select the new one
    if (selectedUser?.id === userId) {
      // Deselect if clicking the already selected item
      setSelectedIds(new Set());
      setTimeout(() => onUserSelect?.(null), 0);
    } else {
      // Select the new item (only one at a time)
      setSelectedIds(new Set([userId]));
      setTimeout(() => onUserSelect?.(user), 0);
    }
  }, [selectedUser, onUserSelect]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    onFilterChange({ page });
  }, [onFilterChange]);

  const handleFilterChange = useCallback((key: keyof UsersFilter, value: string | UserStatus | SubscriptionPlan | UserRole | undefined) => {
    onFilterChange({ [key]: value || undefined, page: 1 } as Partial<UsersFilter>);
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    onClearFilters();
  }, [onClearFilters]);

  const hasActiveFilters = Boolean(filters.status || filters.plan || filters.search);

  const statusOptions: UserStatus[] = ['active', 'inactive', 'suspended', 'pending'];
  const planOptions: SubscriptionPlan[] = ['free', 'basic', 'premium', 'enterprise'];

  const handleViewDetails = useCallback((userId: string) => {
    router.push(`/users/${userId}`);
  }, [router]);

  return (
    <Box>
      {/* Selected User Profile */}
      {selectedUser && <SelectedUserProfile user={selectedUser} />}

      <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }} alignItems="center">
        {/* Left side: Search and Filters (max 2) */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search users..."
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
          
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <SelectMenuItem value="">All</SelectMenuItem>
              {statusOptions.map((status) => (
                <SelectMenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Plan</InputLabel>
            <Select
              value={filters.plan || ''}
              label="Plan"
              onChange={(e) => handleFilterChange('plan', e.target.value)}
            >
              <SelectMenuItem value="">All</SelectMenuItem>
              {planOptions.map((plan) => (
                <SelectMenuItem key={plan} value={plan}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button size="small" onClick={handleClearFilters} sx={{ minWidth: 'auto' }}>
              Clear
            </Button>
          )}
        </Stack>

        {/* Right side: Action buttons */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!canExport}
          >
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddUser}>
            Add User
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* Single-select: no select all checkbox */}
              </TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
                    <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <TableLoadingState message="Loading users..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : error ? (
            <TableBody>
              <TableErrorState colSpan={8} message="Failed to load users. Please try again." onRetry={onRefresh} />
            </TableBody>
          ) : users.length === 0 ? (
            <TableBody>
              <TableEmptyState
                colSpan={8}
                message="No users found"
                title="No Users"
              />
            </TableBody>
          ) : (
            <TableBody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.has(user.id)}
                  onSelect={handleSelectOne}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {pagination && pagination.totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: designTokens.spacing.sectionGap }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}

    </Box>
  );
});

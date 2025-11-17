import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Popover,
  Divider,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { UserStatus, SubscriptionPlan, UserRole } from '../types/user.types';
import { UserFiltersProps } from '../types/filter.types';

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  statusFilter,
  planFilter,
  roleFilter,
  onSearchChange,
  onStatusChange,
  onPlanChange,
  onRoleChange,
  onClearFilters,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveFilters = Boolean(searchTerm || statusFilter || planFilter || roleFilter);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const open = Boolean(filterAnchorEl);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Main filter controls */}
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Search input */}
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />

        {/* Consolidated Filter Dropdown */}
        <Button
          variant={hasActiveFilters ? "contained" : "outlined"}
          color={hasActiveFilters ? "primary" : "inherit"}
          startIcon={<FilterIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={handleFilterClick}
          size="medium"
          sx={{
            borderRadius: 2,
            minWidth: 'auto',
            px: 2,
            borderColor: hasActiveFilters ? 'primary.main' : 'divider',
          }}
        >
          Filters
          {hasActiveFilters && (
            <Chip 
              label="On" 
              size="small" 
              color="primary" 
              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
            />
          )}
        </Button>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={onClearFilters} 
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
        )}
      </Stack>

      {/* Filter Dropdown Popover */}
      <Popover
        open={open}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            p: 2,
            mt: 1,
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Filter Users
        </Typography>

        <Stack spacing={2}>
          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter || ''}
              label="Status"
              onChange={(e) => {
                onStatusChange(e.target.value as UserStatus || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          {/* Plan Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Plan</InputLabel>
            <Select
              value={planFilter || ''}
              label="Plan"
              onChange={(e) => {
                onPlanChange(e.target.value as SubscriptionPlan || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Plans</MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl>

          {/* Role Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter || ''}
              label="Role"
              onChange={(e) => {
                onRoleChange(e.target.value as UserRole || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
            </Select>
          </FormControl>

          <Divider />


        </Stack>
      </Popover>

      {/* Active filters display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <FilterIcon fontSize="small" color="action" />
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                size="small" 
                onDelete={() => onSearchChange('')} 
              />
            )}
            {statusFilter && (
              <Chip 
                label={`Status: ${statusFilter}`} 
                size="small" 
                onDelete={() => onStatusChange(undefined)} 
              />
            )}
            {planFilter && (
              <Chip 
                label={`Plan: ${planFilter}`} 
                size="small" 
                onDelete={() => onPlanChange(undefined)} 
              />
            )}
            {roleFilter && (
              <Chip 
                label={`Role: ${roleFilter}`} 
                size="small" 
                onDelete={() => onRoleChange(undefined)} 
              />
            )}
          </Stack>
        </Box>
      )}
      
    </Box>
  );
};
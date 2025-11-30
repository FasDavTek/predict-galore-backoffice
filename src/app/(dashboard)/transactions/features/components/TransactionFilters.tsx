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
import { TransactionStatus, PaymentMethod, TransactionType } from '../types/transaction.types';

interface TransactionFiltersProps {
  searchTerm: string;
  statusFilter: TransactionStatus | undefined;
  paymentMethodFilter: PaymentMethod | undefined;
  typeFilter: TransactionType | undefined;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TransactionStatus | undefined) => void;
  onPaymentMethodChange: (method: PaymentMethod | undefined) => void;
  onTypeChange: (type: TransactionType | undefined) => void;
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  statusFilter,
  paymentMethodFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onPaymentMethodChange,
  onTypeChange,
  onClearFilters,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveFilters = Boolean(searchTerm || statusFilter || paymentMethodFilter || typeFilter);

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
          placeholder="Search transactions..."
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
          Filter Transactions
        </Typography>

        <Stack spacing={2}>
          {/* Status Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter || ''}
              label="Status"
              onChange={(e) => {
                onStatusChange(e.target.value as TransactionStatus || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          {/* Payment Method Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethodFilter || ''}
              label="Payment Method"
              onChange={(e) => {
                onPaymentMethodChange(e.target.value as PaymentMethod || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Methods</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="crypto">Crypto</MenuItem>
              <MenuItem value="wallet">Wallet</MenuItem>
            </Select>
          </FormControl>

          {/* Type Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter || ''}
              label="Type"
              onChange={(e) => {
                onTypeChange(e.target.value as TransactionType || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="payment">Payment</MenuItem>
              <MenuItem value="withdrawal">Withdrawal</MenuItem>
              <MenuItem value="deposit">Deposit</MenuItem>
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
            {paymentMethodFilter && (
              <Chip 
                label={`Method: ${paymentMethodFilter}`} 
                size="small" 
                onDelete={() => onPaymentMethodChange(undefined)} 
              />
            )}
            {typeFilter && (
              <Chip 
                label={`Type: ${typeFilter}`} 
                size="small" 
                onDelete={() => onTypeChange(undefined)} 
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
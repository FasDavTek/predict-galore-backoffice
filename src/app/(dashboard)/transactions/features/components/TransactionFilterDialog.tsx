/**
 * Transaction Filter Dialog Component
 * Provides comprehensive filtering options for transactions
 */

'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TransactionsFilter, TransactionStatus, PaymentMethod, TransactionType } from '@/features/transactions';
import { designTokens } from '@/shared/styles/tokens';

interface TransactionFilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: TransactionsFilter;
  onApply: (filters: Partial<TransactionsFilter>) => void;
  onClear: () => void;
}

export const TransactionFilterDialog = memo(function TransactionFilterDialog({
  open,
  onClose,
  filters,
  onApply,
  onClear,
}: TransactionFilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<Partial<TransactionsFilter>>({
    status: filters.status,
    paymentMethod: filters.paymentMethod,
    type: filters.type,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const [startDate, setStartDate] = useState<Date | null>(
    filters.startDate ? new Date(filters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.endDate ? new Date(filters.endDate) : null
  );

  // Update local filters when dialog opens or filters change
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing local state with props when dialog opens
      setLocalFilters({
        status: filters.status,
        paymentMethod: filters.paymentMethod,
        type: filters.type,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setStartDate(filters.startDate ? new Date(filters.startDate) : null);
      setEndDate(filters.endDate ? new Date(filters.endDate) : null);
    }
  }, [open, filters]);

  const handleStatusChange = useCallback((value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      status: value ? (value as TransactionStatus) : undefined,
    }));
  }, []);

  const handlePaymentMethodChange = useCallback((value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      paymentMethod: value ? (value as PaymentMethod) : undefined,
    }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      type: value ? (value as TransactionType) : undefined,
    }));
  }, []);

  const handleMinAmountChange = useCallback((value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      minAmount: value ? Number(value) : undefined,
    }));
  }, []);

  const handleMaxAmountChange = useCallback((value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      maxAmount: value ? Number(value) : undefined,
    }));
  }, []);

  const handleStartDateChange = useCallback((date: Date | null) => {
    setStartDate(date);
    setLocalFilters((prev) => ({
      ...prev,
      startDate: date ? date.toISOString().split('T')[0] : undefined,
    }));
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    setEndDate(date);
    setLocalFilters((prev) => ({
      ...prev,
      endDate: date ? date.toISOString().split('T')[0] : undefined,
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApply(localFilters);
    onClose();
  }, [localFilters, onApply, onClose]);

  const handleClear = useCallback(() => {
    setLocalFilters({});
    setStartDate(null);
    setEndDate(null);
    onClear();
    onClose();
  }, [onClear, onClose]);

  const statusOptions: TransactionStatus[] = ['Successful', 'Pending', 'Failed', 'Cancelled', 'Refunded'];
  const paymentMethodOptions: PaymentMethod[] = ['Paystack', 'credit_card', 'paypal', 'bank_transfer', 'crypto', 'wallet'];
  const typeOptions: TransactionType[] = ['Subscription', 'payment', 'refund', 'withdrawal', 'deposit'];

  const hasActiveFilters = Boolean(
    localFilters.status ||
    localFilters.paymentMethod ||
    localFilters.type ||
    localFilters.minAmount ||
    localFilters.maxAmount ||
    localFilters.startDate ||
    localFilters.endDate
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Filter Transactions
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Status Filter */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={localFilters.status || ''}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Payment Method Filter */}
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={localFilters.paymentMethod || ''}
                label="Payment Method"
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              >
                <MenuItem value="">All Payment Methods</MenuItem>
                {paymentMethodOptions.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method === 'credit_card' ? 'Credit Card' : method === 'bank_transfer' ? 'Bank Transfer' : method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Transaction Type Filter */}
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={localFilters.type || ''}
                label="Transaction Type"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {typeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            {/* Amount Range */}
            <Typography variant="subtitle2" fontWeight={600}>
              Amount Range
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min Amount"
                type="number"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                }}
              />
              <TextField
                label="Max Amount"
                type="number"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₦</Typography>,
                }}
              />
            </Stack>

            <Divider />

            {/* Date Range */}
            <Typography variant="subtitle2" fontWeight={600}>
              Date Range
            </Typography>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: designTokens.spacing.itemGap }}>
          <Button onClick={onClose}>Cancel</Button>
          {hasActiveFilters && (
            <Button onClick={handleClear} color="error" variant="outlined">
              Clear All
            </Button>
          )}
          <Button onClick={handleApply} variant="contained" color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
});

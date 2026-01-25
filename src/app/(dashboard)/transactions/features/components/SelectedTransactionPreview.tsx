import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RetryIcon,
  MoneyOff as RefundIcon,
} from '@mui/icons-material';
import { Transaction, TransactionStatus, PaymentMethod, formatCurrency, formatPaymentMethod, formatTransactionStatus } from '@/features/transactions';

interface SelectedTransactionPreviewProps {
  selectedTransactions: Transaction[];
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionAction: (transaction: Transaction, action: string) => void;
  onClearSelection: () => void;
  onRemoveTransaction: (transactionId: string | number) => void;
}

export const SelectedTransactionPreview: React.FC<SelectedTransactionPreviewProps> = ({
  selectedTransactions,
  onTransactionAction,
  onClearSelection,
  onRemoveTransaction,
}) => {
  const theme = useTheme();

  if (selectedTransactions.length === 0) {
    return null;
  }

  // Color mapping for status
  const getStatusColor = (status: TransactionStatus) => {
    const colors: Record<TransactionStatus, string> = {
      Successful: theme.palette.success.main,
      Pending: theme.palette.warning.main,
      Failed: theme.palette.error.main,
      Cancelled: theme.palette.text.secondary,
      Refunded: theme.palette.info.main,
    };
    return colors[status] || theme.palette.text.secondary;
  };

  // Color mapping for payment method
  const getPaymentMethodColor = (method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
      Paystack: theme.palette.primary.main,
      credit_card: theme.palette.primary.main,
      paypal: theme.palette.info.main,
      bank_transfer: theme.palette.secondary.main,
      crypto: theme.palette.warning.main,
      wallet: theme.palette.success.main,
    };
    return colors[method] || theme.palette.text.secondary;
  };

  const getAvailableActions = (transaction: Transaction) => {
    const actions = [];

    if (transaction.status === 'Failed') {
      actions.push({ label: 'Retry Transaction', action: 'retry', icon: <RetryIcon /> });
    }

    if (transaction.status === 'Successful' && (transaction.type === 'payment' || transaction.paymentType === 'payment')) {
      actions.push({ label: 'Issue Refund', action: 'refund', icon: <RefundIcon /> });
    }

    return actions;
  };

  const calculateTotalAmount = () => {
    return selectedTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getStatusSummary = () => {
    const summary: Record<TransactionStatus, number> = {
      Successful: 0,
      Pending: 0,
      Failed: 0,
      Cancelled: 0,
      Refunded: 0,
    };

    selectedTransactions.forEach((transaction) => {
      summary[transaction.status]++;
    });

    return Object.entries(summary)
      .filter(([, count]) => count > 0) // Fixed: removed unused underscore parameter
      .map(([status, count]) => ({ status: status as TransactionStatus, count }));
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight="600">
            Selected Transactions ({selectedTransactions.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {calculateTotalAmount() > 0 &&
              `Total Amount: ${formatCurrency(calculateTotalAmount())}`}
          </Typography>
        </Box>

        <Tooltip title="Clear selection">
          <IconButton size="small" onClick={onClearSelection} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Status Summary */}
      {getStatusSummary().length > 0 && (
        <Box mb={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {getStatusSummary().map(({ status, count }) => (
              <Chip
                key={status}
                label={`${formatTransactionStatus(status)}: ${count}`}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(status),
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Transactions List */}
      <Stack spacing={2}>
        {selectedTransactions.map((transaction) => (
          <Paper
            key={transaction.id}
            variant="outlined"
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              {/* Transaction Info */}
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="subtitle1" fontWeight="600">
                    #{transaction.reference}
                  </Typography>
                  <Chip
                    label={formatTransactionStatus(transaction.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(transaction.status),
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Chip
                    label={formatPaymentMethod(transaction.paymentMethod || transaction.channel)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: getPaymentMethodColor(transaction.paymentMethod || transaction.channel),
                      color: getPaymentMethodColor(transaction.paymentMethod || transaction.channel),
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  {transaction.customerName || transaction.email.split('@')[0]} • {transaction.customerEmail || transaction.email}
                </Typography>

                <Typography variant="body1" fontWeight="600">
                  {formatCurrency(transaction.amount, transaction.currency || 'NGN')}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {new Date(transaction.createdAt || transaction.dateCreated).toLocaleDateString()} • {transaction.type || transaction.paymentType}
                </Typography>
              </Box>

              {/* Actions */}
              <Box display="flex" alignItems="center" gap={0.5} ml={2}>
                {getAvailableActions(transaction).map((action) => (
                  <Tooltip key={action.action} title={action.label}>
                    <IconButton
                      size="small"
                      onClick={() => onTransactionAction(transaction, action.action)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {action.icon}
                    </IconButton>
                  </Tooltip>
                ))}

                <Tooltip title="Remove from selection">
                  <IconButton
                    size="small"
                    onClick={() => onRemoveTransaction(transaction.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

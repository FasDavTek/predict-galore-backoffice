import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Transaction, TransactionStatus, PaymentMethod } from '../types/transaction.types';
import { TableLoadingState } from '@/components/LoadingState';
import { formatCurrency, formatPaymentMethod, formatTransactionStatus } from '../utils/transactionTransformers';

interface TransactionsTableProps {
  transactions: Transaction[];
  selectedTransactionIds: string[];
  onTransactionSelect: (transaction: Transaction) => void;
  onToggleSelection: (transactionId: string) => void;
  onSelectAll: (transactions: Transaction[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  selectedTransactionIds,
  onTransactionSelect,
  onToggleSelection,
  onSelectAll,
  isLoading = false,
  hasError = false,
}) => {
  const theme = useTheme();

  const isEmpty = transactions.length === 0;

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

  const handleSelectAll = () => {
    onSelectAll(transactions);
  };

  const handleViewDetails = (transaction: Transaction, event: React.MouseEvent) => {
    event.stopPropagation();
    onTransactionSelect(transaction);
  };

  if (isLoading) {
    return <TableLoadingState />;
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTransactionIds.length > 0 && 
                    selectedTransactionIds.length < transactions.length
                  }
                  checked={
                    transactions.length > 0 && 
                    selectedTransactionIds.length === transactions.length
                  }
                  onChange={handleSelectAll}
                  disabled={isEmpty || hasError}
                />
              </TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hasError ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                  <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" color="error.main" gutterBottom>
                    Unable to Load Transactions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    There was an error loading the transactions data
                  </Typography>
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                  <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Transactions Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transactions will appear here once they are processed
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  hover 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => onTransactionSelect(transaction)}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedTransactionIds.includes(transaction.id)} 
                      onChange={() => onToggleSelection(transaction.id)} 
                    />
                  </TableCell>

                  {/* Transaction ID */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{transaction.reference}
                    </Typography>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {transaction.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.customerEmail}
                    </Typography>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </Typography>
                  </TableCell>

                  {/* Payment Method */}
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getPaymentMethodColor(transaction.paymentMethod),
                        fontWeight: 500,
                      }}
                    >
                      {formatPaymentMethod(transaction.paymentMethod)}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getStatusColor(transaction.status),
                        fontWeight: 500,
                      }}
                    >
                      {formatTransactionStatus(transaction.status)}
                    </Typography>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  {/* Actions - Only View Details */}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleViewDetails(transaction, e)}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status indicator */}
      {!hasError && !isEmpty && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </>
  );
};
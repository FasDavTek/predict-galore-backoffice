// components/dashboard/transactions/TransactionDetail.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Breadcrumbs,
  Link,
  Stack,
  Dialog
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useDispatch } from 'react-redux';
import { markAsPaid, retryCharge, refundTransaction } from '@/store/slices/transactionSlice';

const TransactionDetail = ({ transaction, onBack }) => {
  const dispatch = useDispatch();
  const [openMarkPaidDialog, setOpenMarkPaidDialog] = useState(false);
  const [openRetryDialog, setOpenRetryDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!transaction) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back to Transactions
        </Button>
        <Typography variant="h6">Transaction data not available</Typography>
      </Box>
    );
  }

  // Action handlers
  const handleMarkPaidConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(markAsPaid(transaction.id));
      onBack(); // Return to list after action
    } finally {
      setActionLoading(false);
      setOpenMarkPaidDialog(false);
    }
  };

  const handleRetryConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(retryCharge(transaction.id));
      onBack();
    } finally {
      setActionLoading(false);
      setOpenRetryDialog(false);
    }
  };

  const handleRefundConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(refundTransaction(transaction.id));
      onBack();
    } finally {
      setActionLoading(false);
      setOpenRefundDialog(false);
    }
  };

  // Safely handle all possible undefined values
  const firstName = transaction.customerName ? transaction.customerName.split(' ')[0] : 'N/A';
  const lastName = transaction.customerName ? transaction.customerName.split(' ').slice(1).join(' ') : 'N/A';
  const formattedDate = transaction.date ? new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  return (
    <Box>
      {/* Header with breadcrumb and action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            onClick={onBack}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Transactions
          </Link>
          <Typography color="text.primary">Transaction #{transaction.id || 'N/A'}</Typography>
        </Breadcrumbs>

        <Stack direction="row" spacing={2}>
          {transaction.status === 'failed' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setOpenRetryDialog(true)}
            >
              Retry Charge
            </Button>
          )}
          {transaction.status === 'pending' && (
            <Button 
              variant="contained" 
              onClick={() => setOpenMarkPaidDialog(true)}
            >
              Mark as Paid
            </Button>
          )}
          {transaction.status === 'completed' && (
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setOpenRefundDialog(true)}
            >
              Issue Refund
            </Button>
          )}

        </Stack>
      </Box>

      {/* Transaction summary card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Transaction Summary
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell>{firstName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell>{lastName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                <TableCell>#{transaction.id || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell>{transaction.amount || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell>{formattedDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Method</TableCell>
                <TableCell>{(transaction.paymentMethod || 'N/A').replace('_', ' ')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.status || 'N/A'} 
                    color={
                      transaction.status === 'completed' ? 'success' :
                      transaction.status === 'failed' ? 'error' : 
                      transaction.status === 'pending' ? 'warning' : 'default'
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation dialogs */}
      <Dialog open={openMarkPaidDialog} onClose={() => setOpenMarkPaidDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Mark as Paid</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to mark transaction #{transaction.id} as paid?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenMarkPaidDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleMarkPaidConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={openRetryDialog} onClose={() => setOpenRetryDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Retry Charge</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Retry failed transaction #{transaction.id}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenRetryDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleRetryConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Retry'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Issue Refund</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Refund transaction #{transaction.id} for {transaction.amount}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenRefundDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleRefundConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Confirm Refund'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TransactionDetail;
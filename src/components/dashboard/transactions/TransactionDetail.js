// components/dashboard/transactions/TransactionDetailView.js
import React from 'react';
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
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

const TransactionDetail = ({ transaction, onBack }) => {
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

  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          color="inherit" 
          onClick={onBack}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Transactions
        </Link>
        <Typography color="text.primary">Transaction #{transaction.id}</Typography>
      </Breadcrumbs>

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
                <TableCell>{transaction.fullName.split(' ')[0]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell>{transaction.fullName.split(' ').slice(1).join(' ')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                <TableCell>#{transaction.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell>{transaction.plan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.status} 
                    color={
                      transaction.status === 'Completed' ? 'success' :
                      transaction.status === 'Failed' ? 'error' : 'warning'
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
            >
              Back to Transactions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionDetail;
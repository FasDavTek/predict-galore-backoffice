/**
 * Transaction Details Page
 * Comprehensive view of a single transaction
 */

'use client';

import { useCallback, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Grid,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { designTokens } from '@/shared/styles/tokens';
import withAuth from '@/hoc/with-auth';
import { useTransaction, formatCurrency, formatPaymentMethod, formatTransactionStatus } from '@/features/transactions';
import { generateUserInitials } from '@/features/users/lib/transformers';

// Helper to extract name from email
const extractNameFromEmail = (email: string): { firstName: string; lastName: string } => {
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
};

function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = String(params.id);

  const { data: transaction, isLoading, error } = useTransaction(transactionId);

  const handleBack = useCallback(() => {
    router.push('/transactions');
  }, [router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          px: { xs: 2, sm: 3, md: 4 },
          py: designTokens.spacing.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !transaction) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          px: { xs: 2, sm: 3, md: 4 },
          py: designTokens.spacing.xl,
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Transactions
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Transaction not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The transaction you&apos;re looking for doesn&apos;t exist or has been removed.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const name = extractNameFromEmail(transaction.email);
  const userInitials = generateUserInitials(name.firstName, name.lastName);
  const fullName = name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return { bgcolor: '#EDF7ED', color: '#4CAF50' };
      case 'Failed':
        return { bgcolor: '#FFEBEE', color: '#F44336' };
      case 'Pending':
        return { bgcolor: '#FFF3E0', color: '#FF9800' };
      default:
        return { bgcolor: '#F5F5F5', color: '#757575' };
    }
  };

  const statusChipStyle = getStatusColor(transaction.status);

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4 },
        py: designTokens.spacing.xl,
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: designTokens.spacing.itemGap }}>
        <Link
          color="inherit"
          href="/transactions"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Transactions
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          Transaction Details
        </Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
          overflow: 'hidden',
          mb: designTokens.spacing.sectionGap,
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ p: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 54,
                height: 54,
                bgcolor: transaction.status === 'Failed' ? '#F9B4B4' : '#B4F9B4',
                color: '#333',
                fontSize: '16px',
                fontWeight: 500,
                border: '1px solid',
                borderColor: transaction.status === 'Failed' ? '#E57373' : '#81C784',
              }}
            >
              {userInitials}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111', fontSize: '1.1rem' }}>
                  {fullName}
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: transaction.status === 'Failed' ? '#FF5252' : '#4CAF50',
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
                Transaction ID: #{transaction.reference}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={formatTransactionStatus(transaction.status)}
            sx={{
              ...statusChipStyle,
              fontWeight: 600,
              borderRadius: '20px',
              px: 1,
              height: '36px',
              '& .MuiChip-label': { fontSize: '0.95rem' },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: '#F0F0F0' }} />

        {/* Transaction Details */}
        <Box sx={{ p: '24px' }}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Transaction Reference
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    #{transaction.reference}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Gateway Reference
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {transaction.gatewayReference || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Amount
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {formatCurrency(transaction.amount, 'NGN')}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {formatCurrency(transaction.totalAmount, 'NGN')}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {formatPaymentMethod(transaction.channel)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Transaction Type
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {transaction.paymentType}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Email Address
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {transaction.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#8E8E93',
                      display: 'block',
                      mb: 1,
                      fontSize: '14px',
                      fontWeight: 400,
                    }}
                  >
                    Buyer ID
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                    {transaction.buyerId}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#F0F0F0' }} />

          {/* Date Information */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  sx={{
                    color: '#8E8E93',
                    display: 'block',
                    mb: 1,
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  Date Created
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                  {formatDate(transaction.dateCreated)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  sx={{
                    color: '#8E8E93',
                    display: 'block',
                    mb: 1,
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  Completed At
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                  {formatDate(transaction.completedAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Back Button */}
      <Box sx={{ mt: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
          Back to Transactions
        </Button>
      </Box>
    </Box>
  );
}

export default withAuth(memo(TransactionDetailsPage));

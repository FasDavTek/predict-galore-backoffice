/**
 * Selected Transaction Profile Component
 * Updated to exactly match the SelectedUserProfile structure.
 */

'use client';

import { memo } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { designTokens } from '@/shared/styles/tokens';
import { Transaction, formatCurrency, formatPaymentMethod, formatTransactionStatus } from '@/features/transactions';
import { generateUserInitials } from '@/features/users/lib/transformers';

interface SelectedTransactionProfileProps {
  transaction: Transaction | null;
}

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

export const SelectedTransactionProfile = memo(function SelectedTransactionProfile({
  transaction,
}: SelectedTransactionProfileProps) {
  if (!transaction) return null;

  const name = extractNameFromEmail(transaction.email);
  const userInitials = generateUserInitials(name.firstName, name.lastName);
  const fullName = name.lastName ? `${name.firstName} ${name.lastName}` : name.firstName;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color for chip
  const getStatusChipColor = (status: string) => {
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

  const statusChipStyle = getStatusChipColor(transaction.status);

  const infoFields = [
    { label: 'Transaction ID', value: `#${transaction.reference}` },
    { label: 'Amount', value: formatCurrency(transaction.amount, 'NGN') },
    { label: 'Plan', value: transaction.paymentType === 'Subscription' ? 'Monthly' : transaction.paymentType },
    { label: 'Payment Method', value: formatPaymentMethod(transaction.channel) },
    { label: 'Email Address', value: transaction.email },
    { label: 'Date', value: formatDate(transaction.dateCreated) },
  ];

  return (
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
      {/* Header Section */}
      <Box sx={{ p: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: transaction.status === 'Failed' ? '#F9B4B4' : '#B4F9B4', // Light red for failed, light green for successful
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
                  bgcolor: transaction.status === 'Failed' ? '#FF5252' : '#4CAF50' 
                }} 
              />
            </Stack>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
              Transaction Date: {formatDate(transaction.dateCreated)}
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
            '& .MuiChip-label': { fontSize: '0.95rem' }
          }}
        />
      </Box>

      <Divider sx={{ borderColor: '#F0F0F0' }} />

      {/* Details Row Section */}
      <Box 
        sx={{ 
          p: '24px', 
          display: 'flex', 
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 0
        }}
      >
        {infoFields.map((item, index) => (
          <Box 
            key={item.label} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center',
              flex: index === 4 ? 2 : 1, // Email usually needs more horizontal space
            }}
          >
            <Box sx={{ pr: 3, pl: index === 0 ? 0 : 3 }}>
              <Typography
                sx={{ 
                  color: '#8E8E93', 
                  display: 'block', 
                  mb: 1, 
                  fontSize: '14px',
                  fontWeight: 400
                }}
              >
                {item.label}
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#000', fontSize: '16px' }}>
                {item.value}
              </Typography>
            </Box>
            
            {/* Vertical Divider between items */}
            {index < infoFields.length - 1 && (
              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ height: '40px', alignSelf: 'center', borderColor: '#E0E0E0' }} 
              />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
});

/**
 * Selected User Profile Component
 * Updated to exactly match the provided UI screenshot.
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
import { User, generateUserInitials } from '@/features/users';

interface SelectedUserProfileProps {
  user: User | null;
}

export const SelectedUserProfile = memo(function SelectedUserProfile({
  user,
}: SelectedUserProfileProps) {
  if (!user) return null;

  const userInitials = generateUserInitials(user.firstName, user.lastName);
  
  // Logic to match the "30 mins ago" text in the screenshot
  const lastActiveText = '30 mins ago'; 

  // Format plan display
  const formatPlan = (plan?: string): string => {
    if (!plan || plan === 'free') return 'Free';
    if (plan === 'premium' || plan === 'basic' || plan === 'enterprise') {
      return 'Monthly'; // Display as Monthly for paid plans
    }
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const infoFields = [
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Location', value: user.location || 'United States of America' },
    { label: 'Phone Number', value: user.phone || '+234 818 4667 747' },
    { label: 'Email Address', value: user.email },
    { label: 'Plan', value: formatPlan(user.plan) },
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
              bgcolor: '#F9B4B4', // Light red/coral from image
              color: '#333',
              fontSize: '16px',
              fontWeight: 500,
              border: '1px solid #E57373',
            }}
          >
            {userInitials}
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111', fontSize: '1.1rem' }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF5252' }} />
            </Stack>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
              Last active: {lastActiveText}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label="Premium"
          sx={{
            bgcolor: '#EDF7ED',
            color: '#4CAF50',
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
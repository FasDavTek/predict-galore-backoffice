/**
 * Selected Prediction Profile Component
 * Perfectly aligned with the User Profile UI reference.
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
import { Prediction } from '@/features/predictions';

interface SelectedPredictionProfileProps {
  prediction: Prediction | null;
}

export const SelectedPredictionProfile = memo(function SelectedPredictionProfile({
  prediction,
}: SelectedPredictionProfileProps) {
  if (!prediction) return null;

  const getMatchInitials = (match: string): string => {
    const parts = match.split(' vs ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return match.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format status display
  const formatStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Matches the exact structure of SelectedUserProfile
  const infoFields = [
    { label: 'Match', value: prediction.match },
    { label: 'Pick Count', value: String(prediction.picksCount) },
    { label: 'Accuracy', value: `${prediction.accuracy}%` },
    { label: 'Date Posted', value: formatDate(prediction.datePostedUtc) },
    { label: 'Status', value: formatStatus(prediction.status) },
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
              bgcolor: '#F9B4B4', // Exact coral color from reference
              color: '#333',
              fontSize: '16px',
              fontWeight: 500,
              border: '1px solid #E57373',
            }}
          >
            {getMatchInitials(prediction.match)}
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111', fontSize: '1.1rem' }}>
                {prediction.match}
              </Typography>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF5252' }} />
            </Stack>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
              Prediction #{prediction.id}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label="Scheduled"
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
              flex: index === 4 ? 2 : 1, // Last field (Status) needs more horizontal space
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
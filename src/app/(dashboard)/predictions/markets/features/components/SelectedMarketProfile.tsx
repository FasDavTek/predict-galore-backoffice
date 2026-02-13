/**
 * Selected Market Profile Component
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
import { Market } from '@/features/markets';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface SelectedMarketProfileProps {
  market: Market | null;
}

export const SelectedMarketProfile = memo(function SelectedMarketProfile({
  market,
}: SelectedMarketProfileProps) {
  if (!market) return null;

  // Format status display
  const formatStatus = (isActive: boolean): string => {
    return isActive ? 'Active' : 'Inactive';
  };

  // Matches the exact structure of SelectedPredictionProfile
  const infoFields = [
    { label: 'Market Name', value: market.name },
    { label: 'Category', value: market.category },
    { label: 'Selections', value: String(market.selections?.length || 0) },
    { label: 'Sort Order', value: String(market.sortOrder) },
    { label: 'Status', value: formatStatus(market.isActive) },
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
              bgcolor: '#E3F2FD',
              color: '#1976D2',
              fontSize: '16px',
              fontWeight: 500,
              border: '1px solid #90CAF9',
            }}
          >
            <StorefrontIcon />
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#111', fontSize: '1.1rem' }}>
                {market.displayName}
              </Typography>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: market.isActive ? '#4CAF50' : '#9E9E9E' }} />
            </Stack>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
              Market #{market.id}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={market.isActive ? 'Active' : 'Inactive'}
          sx={{
            bgcolor: market.isActive ? '#EDF7ED' : '#F5F5F5',
            color: market.isActive ? '#4CAF50' : '#757575',
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
              flex: index === 4 ? 2 : 1,
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

      {/* Description Section */}
      {market.description && (
        <>
          <Divider sx={{ borderColor: '#F0F0F0' }} />
          <Box sx={{ p: '20px 24px' }}>
            <Typography
              sx={{ 
                color: '#8E8E93', 
                display: 'block', 
                mb: 1, 
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              Description
            </Typography>
            <Typography sx={{ color: '#333', fontSize: '15px', lineHeight: 1.6 }}>
              {market.description}
            </Typography>
          </Box>
        </>
      )}

      {/* Selections Section */}
      {market.selections && market.selections.length > 0 && (
        <>
          <Divider sx={{ borderColor: '#F0F0F0' }} />
          <Box sx={{ p: '20px 24px' }}>
            <Typography
              sx={{ 
                color: '#8E8E93', 
                display: 'block', 
                mb: 2, 
                fontSize: '14px',
                fontWeight: 400
              }}
            >
              Selections ({market.selections.length})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {market.selections.map((selection, index) => (
                <Chip
                  key={selection.id || index}
                  label={selection.selectionLabel}
                  size="small"
                  sx={{
                    bgcolor: selection.isActive ? '#E8F5E9' : '#F5F5F5',
                    color: selection.isActive ? '#2E7D32' : '#757575',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );
});

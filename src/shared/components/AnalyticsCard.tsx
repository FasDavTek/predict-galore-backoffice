/**
 * Shared analytics card component
 * Provides reusable analytics card with consistent styling
 */

import React, { memo } from 'react';
import { Box, Card, CardContent, Typography, Skeleton, Stack } from '@mui/material';
import { designTokens } from '../styles/tokens';
import { TrendingUp as ArrowUpIcon, TrendingDown as ArrowDownIcon } from '@mui/icons-material';

// ====================
// Types
// ====================

export interface AnalyticsCardConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  format: (value: number | undefined) => string;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number | undefined;
  change?: string | number;
  loading?: boolean;
  config: AnalyticsCardConfig;
  icon: React.ReactElement;
  error?: boolean;
}

// ====================
// Constants
// ====================

const BORDER_COLOR_MAP: Record<string, string> = {
  '#F0F9FF': '#0EA5E920',
  '#ECFDF5': '#10B98120',
  '#FFFBEB': '#F59E0B20',
  '#FEF2F2': '#EF444420',
  '#EFF6FF': '#3B82F620',
};

// ====================
// Utility Functions
// ====================

const getBorderColor = (bgColor: string, iconColor: string): string => {
  return BORDER_COLOR_MAP[bgColor] || `${iconColor}20`;
};

// ====================
// Sub-Components
// ====================

const ChangeIndicator: React.FC<{ change: string }> = memo(function ChangeIndicator({ change }) {
  const isPositive = parseFloat(change) >= 0;
  const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Icon
        sx={{
          fontSize: 16,
          color: isPositive ? designTokens.colors.success[500] : designTokens.colors.error[500],
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: isPositive ? designTokens.colors.success[500] : designTokens.colors.error[500],
          fontWeight: designTokens.typography.fontWeight.semibold,
        }}
      >
        {change}
      </Typography>
    </Stack>
  );
});

const AnalyticsCardSkeleton: React.FC = () => (
  <Card sx={{ border: 'none', boxShadow: designTokens.shadows.none, height: '140px' }}>
    <CardContent sx={{ p: designTokens.spacing.sectionGap }}>
      <Stack direction="row" justifyContent="space-between">
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={32} sx={{ my: 1 }} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Stack>
    </CardContent>
  </Card>
);

const ErrorAnalyticsCard: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <Card
      sx={{
        border: `1px solid ${designTokens.colors.error[200]}`,
        backgroundColor: designTokens.colors.semantic.errorBackground,
        boxShadow: designTokens.shadows.none,
        height: '140px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${designTokens.colors.error[500]} 0%, ${designTokens.colors.error[300]} 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: designTokens.spacing.sectionGap, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: designTokens.colors.error[700], fontWeight: designTokens.typography.fontWeight.medium, mb: 1 }}>
            Error Loading Data
          </Typography>
          <Typography variant="caption" sx={{ color: designTokens.colors.error[700], display: 'block' }}>
            {onRetry ? 'Click to retry' : 'Please refresh the page'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// ====================
// Main Component
// ====================

export const AnalyticsCard: React.FC<AnalyticsCardProps> = memo(({
  title,
  value,
  change,
  loading,
  config,
  icon,
  error,
}) => {
  if (loading) {
    return <AnalyticsCardSkeleton />;
  }

  if (error) {
    return <ErrorAnalyticsCard />;
  }

  const formattedValue = typeof value === 'number' ? config.format(value) : value || 'N/A';
  const formattedChange =
    change !== undefined
      ? typeof change === 'number'
        ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
        : change
      : undefined;

  const borderColor = getBorderColor(config.bgColor, config.iconColor);

  return (
    <Card
      sx={{
        border: `1px solid ${borderColor}`,
        backgroundColor: config.bgColor,
        boxShadow: designTokens.shadows.none,
        height: '140px',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${designTokens.transitions.duration.slow} ${designTokens.transitions.easing.easeInOut}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: designTokens.shadows.lg,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${config.iconColor} 0%, ${config.iconColor}80 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: designTokens.spacing.sectionGap, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: config.textColor,
                fontWeight: designTokens.typography.fontWeight.medium,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: config.textColor,
                fontWeight: designTokens.typography.fontWeight.bold,
                mb: formattedChange ? 0.5 : 0,
              }}
            >
              {formattedValue}
            </Typography>
            {formattedChange && <ChangeIndicator change={formattedChange} />}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: designTokens.borderRadius.md,
              backgroundColor: `${config.iconColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: config.iconColor,
            }}
          >
            <Box sx={{ fontSize: 24 }}>
              {React.cloneElement(icon as React.ReactElement)}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
});

AnalyticsCard.displayName = 'AnalyticsCard';

export default AnalyticsCard;

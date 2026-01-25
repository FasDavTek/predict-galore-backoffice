/**
 * Shared page header component
 * Provides consistent header layout across all pages
 */

import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { User as AuthUser } from '@/features/auth';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';
import { TimeRange } from '../types/common.types';

// ====================
// Types
// ====================

export type { TimeRange };

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  defaultSubtitle?: string;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onRefresh?: () => void;
  user?: AuthUser | null;
  refreshTooltip?: string;
  showTimeRange?: boolean;
  actions?: React.ReactNode;
}

// ====================
// Component
// ====================

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  defaultSubtitle,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  user,
  refreshTooltip = 'Refresh data',
  showTimeRange = true,
  actions,
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Generate the subtitle
  const getSubtitle = () => {
    if (subtitle) {
      return subtitle;
    }

    if (defaultSubtitle) {
      const firstName = user?.firstName || 'there';
      return defaultSubtitle.replace('{firstName}', firstName);
    }

    return undefined;
  };

  const displaySubtitle = getSubtitle();

  return (
    <Box sx={{ mb: designTokens.spacing.xl }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: designTokens.spacing.itemGap }}
      >
        <Box>
          <Typography variant="h5" fontWeight={designTokens.typography.fontWeight.semibold} gutterBottom>
            {title}
          </Typography>
          {displaySubtitle && (
            <Typography variant="body2" color="text.secondary">
              {displaySubtitle}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {showTimeRange && timeRange !== undefined && onTimeRangeChange && (
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e: SelectChangeEvent<TimeRange>) =>
                  onTimeRangeChange(e.target.value as TimeRange)
                }
                label="Time Range"
              >
                <MenuItem value="default">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
              </Select>
            </FormControl>
          )}

          {onRefresh && (
            <Button
              onClick={handleRefresh}
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                textTransform: 'none',
                minWidth: 'auto',
              }}
            >
              Refresh Page
            </Button>
          )}

          {actions}
        </Stack>
      </Stack>
      <Divider />
    </Box>
  );
};

export default PageHeader;

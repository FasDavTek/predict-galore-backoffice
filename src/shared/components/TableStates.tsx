/**
 * Shared table state components
 * Provides reusable error, empty, and loading states for tables
 */

import React from 'react';
import { TableRow, TableCell, Typography, Button, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';
import { Warning as WarningIcon } from '@mui/icons-material';

// ====================
// Types
// ====================

export interface TableErrorStateProps {
  colSpan: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export interface TableEmptyStateProps {
  colSpan: number;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export interface TableLoadingStateProps {
  message?: string;
}

// ====================
// Components
// ====================

/**
 * Error state row for tables
 */
export const TableErrorState: React.FC<TableErrorStateProps> = ({
  colSpan,
  title = 'Unable to Load Data',
  message = 'There was an error loading the data',
  onRetry,
  retryLabel = 'Retry Loading',
}) => {
  return (
    <TableRow sx={{
      backgroundColor: designTokens.colors.semantic.errorBackground,
      borderColor: designTokens.colors.semantic.errorBorder,
      color: designTokens.colors.error[600],
    }}>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center', py: designTokens.spacing.emptyStatePadding }}>
        <Stack spacing={designTokens.spacing.itemGap} alignItems="center">
          <WarningIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography variant="h6" color="error.main" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          {onRetry && (
            <Button variant="outlined" onClick={onRetry} sx={{ mt: designTokens.spacing.itemGap }}>
              {retryLabel}
            </Button>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
};

/**
 * Empty state row for tables
 */
export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  colSpan,
  title = 'No Data Found',
  message = 'Data will appear here once available',
  icon,
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center', py: designTokens.spacing.emptyStatePadding }}>
        <Stack spacing={designTokens.spacing.itemGap} alignItems="center">
          {icon || <WarningIcon sx={{ fontSize: 48, color: 'grey.400' }} />}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

/**
 * Loading state for tables
 */
export const TableLoadingState: React.FC<TableLoadingStateProps> = ({
  message = 'Loading data...',
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

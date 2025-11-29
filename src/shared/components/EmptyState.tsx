import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  SearchOff as SearchOffIcon,
  FolderOff as FolderOffIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export interface EmptyStateProps {
  /**
   * Type of empty state
   * - 'data': No data available
   * - 'search': No search results
   * - 'error': Error state (use ErrorState instead)
   */
  variant?: 'data' | 'search';
  
  /**
   * Custom title for the empty state
   */
  title?: string;
  
  /**
   * Custom description for the empty state
   */
  description?: string;
  
  /**
   * Primary action button configuration
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  
  /**
   * Secondary action button configuration
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  
  /**
   * Height of the container
   */
  height?: number | string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A reusable empty state component for when there's no data to display
 * Can be used across all pages in the application
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'data',
  title,
  description,
  primaryAction,
  secondaryAction,
  height = 400,
  className,
}) => {
  // Default configurations based on variant
  const getDefaultConfig = () => {
    switch (variant) {
      case 'search':
        return {
          icon: <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />,
          defaultTitle: 'No Results Found',
          defaultDescription: 'Try adjusting your search criteria or filters to find what you\'re looking for.',
        };
      case 'data':
      default:
        return {
          icon: <FolderOffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />,
          defaultTitle: 'No Data Available',
          defaultDescription: 'There\'s no data to display at the moment. Get started by creating your first item.',
        };
    }
  };

  const config = getDefaultConfig();

  return (
    <Paper 
      elevation={0}
      className={className}
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.default',
      }}
    >
      {/* Icon */}
      <Box sx={{ mb: 3 }}>
        {config.icon}
      </Box>

      {/* Title */}
      <Typography 
        variant="h6" 
        color="text.primary" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 1 }}
      >
        {title || config.defaultTitle}
      </Typography>

      {/* Description */}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          maxWidth: 400,
          mb: 4,
          lineHeight: 1.6 
        }}
      >
        {description || config.defaultDescription}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {primaryAction && (
          <Button
            variant="contained"
            startIcon={primaryAction.icon || <AddIcon />}
            onClick={primaryAction.onClick}
            size="large"
          >
            {primaryAction.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button
            variant="outlined"
            startIcon={secondaryAction.icon || <RefreshIcon />}
            onClick={secondaryAction.onClick}
            size="large"
          >
            {secondaryAction.label}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EmptyState;
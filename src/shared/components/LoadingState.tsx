// components/LoadingState.tsx
import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress, Skeleton, Paper } from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';

export interface LoadingStateProps {
  /**
   * Type of loading state
   * - 'spinner': Circular progress indicator (default)
   * - 'linear': Linear progress bar
   * - 'skeleton': Skeleton loading animation
   * - 'text': Simple text loading message
   */
  variant?: 'spinner' | 'linear' | 'skeleton' | 'text';

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Subtitle or additional description
   */
  subtitle?: string;

  /**
   * Height of the container
   */
  height?: number | string;

  /**
   * Size of the spinner (only for 'spinner' variant)
   */
  size?: number;

  /**
   * Color of the loading indicator
   */
  color?: 'primary' | 'secondary' | 'inherit';

  /**
   * Number of skeleton lines (only for 'skeleton' variant)
   */
  skeletonLines?: number;

  /**
   * Show progress percentage (only for 'linear' variant)
   */
  showProgress?: boolean;

  /**
   * Progress value (0-100) for linear progress
   */
  progress?: number;

  /**
   * Whether the loading is indeterminate
   */
  indeterminate?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show in a contained paper
   */
  contained?: boolean;

  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
}

/**
 * A reusable loading state component for when data is being fetched
 * Can be used across all pages and components in the application
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  message,
  subtitle,
  height = 200,
  size = 40,
  color = 'primary',
  skeletonLines = 3,
  showProgress = false,
  progress,
  indeterminate = true,
  className,
  contained = false,
  icon,
}) => {
  // Default messages based on variant
  const getDefaultMessage = () => {
    switch (variant) {
      case 'skeleton':
        return 'Loading content...';
      case 'linear':
        return 'Loading...';
      case 'text':
        return 'Loading, please wait...';
      case 'spinner':
      default:
        return 'Loading...';
    }
  };

  const loadingMessage = message || getDefaultMessage();

  // Render the loading indicator based on variant
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <LinearProgress
              variant={indeterminate ? 'indeterminate' : 'determinate'}
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
            {showProgress && !indeterminate && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progress}% complete
              </Typography>
            )}
          </Box>
        );

      case 'skeleton':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={20}
              sx={{ mb: 2, borderRadius: 1 }}
            />
            {Array.from({ length: skeletonLines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={`${100 - index * 10}%`}
                height={16}
                sx={{ mb: 1, borderRadius: 1 }}
              />
            ))}
          </Box>
        );

      case 'text':
        return (
          <Typography variant="body1" color="text.secondary">
            {loadingMessage}
          </Typography>
        );

      case 'spinner':
      default:
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={size} color={color} thickness={4} />
            {icon && (
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
            )}
          </Box>
        );
    }
  };

  const content = (
    <Box
      className={className}
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: contained ? designTokens.spacing.xl : 0,
        ...(contained && {
          borderRadius: designTokens.borderRadius.md,
          border: '1px dashed',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }),
      }}
    >
      <Stack spacing={variant === 'skeleton' ? designTokens.spacing.sectionGap : designTokens.spacing.itemGap} alignItems="center">
        {/* Loading Indicator */}
        <Box>{renderLoadingIndicator()}</Box>

        {/* Message */}
        {variant !== 'skeleton' && variant !== 'text' && (
          <Typography variant="body1" color="text.primary" gutterBottom sx={{ fontWeight: designTokens.typography.fontWeight.medium }}>
            {loadingMessage}
          </Typography>
        )}

        {/* Subtitle */}
        {subtitle && variant !== 'skeleton' && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: 300,
              lineHeight: designTokens.typography.lineHeight.normal,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );

  // Wrap in Paper if contained
  if (contained) {
    return <Paper elevation={0}>{content}</Paper>;
  }

  return content;
};

// Pre-configured loading states for common use cases
export const PageLoadingState: React.FC<Partial<LoadingStateProps>> = (props) => (
  <LoadingState
    variant="spinner"
    message="Loading page..."
    height={400}
    size={60}
    contained={true}
    {...props}
  />
);

export const CardLoadingState: React.FC<Partial<LoadingStateProps>> = (props) => (
  <LoadingState variant="skeleton" skeletonLines={4} height={200} contained={true} {...props} />
);

export const TableLoadingState: React.FC<Partial<LoadingStateProps>> = (props) => (
  <LoadingState
    variant="skeleton"
    skeletonLines={6}
    height={300}
    message="Loading table data..."
    {...props}
  />
);

export const ButtonLoadingState: React.FC<Partial<LoadingStateProps>> = (props) => (
  <LoadingState variant="spinner" size={20} height="auto" message="" {...props} />
);

export default LoadingState;

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon,
  ReportProblem as ReportProblemIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';

export interface ErrorStateProps {
  /**
   * Type of error
   * - 'api': API/server error
   * - 'network': Network connection error
   * - 'not-found': Resource not found
   * - 'generic': Generic error
   */
  variant?: 'api' | 'network' | 'not-found' | 'generic';
  
  /**
   * Error title
   */
  title?: string;
  
  /**
   * Error message or description
   */
  message?: string;
  
  /**
   * Detailed error information for debugging
   */
  errorDetails?: string;
  
  /**
   * Retry action configuration
   */
  retryAction?: {
    label?: string;
    onClick: () => void;
  };
  
  /**
   * Contact support action
   */
  supportAction?: {
    label?: string;
    onClick: () => void;
  };
  
  /**
   * Height of the container
   */
  height?: number | string;
  
  /**
   * Show error details (for debugging)
   */
  showDetails?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A reusable error state component for when there are server or network errors
 * Can be used across all pages in the application
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'generic',
  title,
  message,
  errorDetails,
  retryAction,
  supportAction,
  height = 400,
  showDetails = false,
  className,
}) => {
  // Default configurations based on variant
  const getDefaultConfig = () => {
    switch (variant) {
      case 'api':
        return {
        //   icon: <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />,
          defaultTitle: 'Server Error',
          defaultMessage: 'We encountered an issue while processing your request. Please try again in a moment.',
          severity: 'error' as const,
        };
      case 'network':
        return {
        //   icon: <CloudOffIcon sx={{ fontSize: 64, color: 'warning.main' }} />,
          defaultTitle: 'Connection Lost',
          defaultMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
          severity: 'warning' as const,
        };
      case 'not-found':
        return {
          icon: <ReportProblemIcon sx={{ fontSize: 64, color: 'info.main' }} />,
          defaultTitle: 'Resource Not Found',
          defaultMessage: 'The requested resource could not be found. It may have been moved or deleted.',
          severity: 'info' as const,
        };
      case 'generic':
      default:
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />,
          defaultTitle: 'Something Went Wrong',
          defaultMessage: 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.',
          severity: 'error' as const,
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
        border: '1px solid',
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

      {/* Message */}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          maxWidth: 400,
          mb: 3,
          lineHeight: 1.6 
        }}
      >
        {message || config.defaultMessage}
      </Typography>

      {/* Error Alert (if details provided) */}
      {errorDetails && showDetails && (
        <Alert 
          severity={config.severity} 
          sx={{ 
            maxWidth: 400, 
            mb: 3,
            textAlign: 'left',
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="caption" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
            Error Details:
          </Typography>
          <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
            {errorDetails}
          </Typography>
        </Alert>
      )}

      {/* Actions */}
      {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {retryAction && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={retryAction.onClick}
            size="large"
          >
            {retryAction.label || 'Try Again'}
          </Button>
        )}
        
        {supportAction && (
          <Button
            variant="outlined"
            onClick={supportAction.onClick}
            size="large"
          >
            {supportAction.label || 'Contact Support'}
          </Button>
        )}
      </Box> */}
    </Paper>
  );
};

export default ErrorState;
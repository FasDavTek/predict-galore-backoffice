// features/auth/components/ErrorMessage.tsx
import React, { memo, useMemo } from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

export interface ErrorMessageProps {
  error: unknown;
  title?: string;
  severity?: 'error' | 'warning' | 'info';
  showDetails?: boolean;
  className?: string;
}

export const ErrorMessage = memo<ErrorMessageProps>(({
  error,
  title,
  severity = 'error',
  showDetails = false,
  className,
}) => {
  const { message, statusCode, type } = useMemo(() => parseError(error), [error]);

  const errorTitle = useMemo(() => {
    if (title) return title;

    switch (type) {
      case 'network':
        return 'Network Error';
      case 'server':
        return 'Server Error';
      case 'client':
        return 'Request Error';
      case 'authentication':
        return 'Authentication Failed';
      case 'authorization':
        return 'Access Denied';
      case 'validation':
        return 'Validation Error';
      case 'not_found':
        return 'Not Found';
      case 'rate_limit':
        return 'Too Many Requests';
      default:
        return 'Error';
    }
  }, [title, type]);

  const errorSeverity = useMemo(() => {
    if (severity) return severity;

    switch (type) {
      case 'network':
      case 'server':
        return 'error';
      case 'authentication':
      case 'authorization':
        return 'warning';
      case 'validation':
      case 'rate_limit':
        return 'info';
      default:
        return 'error';
    }
  }, [severity, type]);

  return (
    <Alert severity={errorSeverity} className={className} sx={{ width: '100%', mb: 2 }}>
      <AlertTitle>{errorTitle}</AlertTitle>
      {message}
      {showDetails && statusCode && (
        <Box sx={{ mt: 1, fontSize: '0.75rem', opacity: 0.7 }}>Status: {statusCode}</Box>
      )}
    </Alert>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

// Helper function to parse different error formats
export const parseError = (
  error: unknown
): {
  message: string;
  statusCode?: number;
  type: string;
} => {
  if (!error) {
    return { message: 'An unknown error occurred', type: 'unknown' };
  }

  // Network errors
  const errorObj = error as Record<string, unknown>;
  if ((errorObj.message as string)?.includes('Network Error') || (errorObj.message as string)?.includes('Failed to fetch')) {
    return {
      message:
        'Unable to connect to the server. Please check your internet connection and try again.',
      type: 'network',
    };
  }

  // Axios-like errors
  if (errorObj.status || errorObj.code) {
    const status = errorObj.status as number || errorObj.code as number;
    const data = (errorObj.data as Record<string, unknown>) || errorObj;

    switch (status) {
      case 400:
        return {
          message: (data.message as string) || 'Invalid request. Please check your input and try again.',
          statusCode: 400,
          type: 'validation',
        };
      case 401:
        return {
          message:
            (data.message as string) || 'Authentication failed. Please check your credentials and try again.',
          statusCode: 401,
          type: 'authentication',
        };
      case 403:
        return {
          message: (data.message as string) || 'You do not have permission to perform this action.',
          statusCode: 403,
          type: 'authorization',
        };
      case 404:
        return {
          message: (data.message as string) || 'The requested resource was not found.',
          statusCode: 404,
          type: 'not_found',
        };
      case 409:
        return {
          message: (data.message as string) || 'A conflict occurred. This resource may already exist.',
          statusCode: 409,
          type: 'validation',
        };
      case 422:
        return {
          message: (data.message as string) || 'Validation failed. Please check your input.',
          statusCode: 422,
          type: 'validation',
        };
      case 429:
        return {
          message: (data.message as string) || 'Too many requests. Please wait a moment and try again.',
          statusCode: 429,
          type: 'rate_limit',
        };
      case 500:
        return {
          message: (data.message as string) || 'Internal server error. Please try again later.',
          statusCode: 500,
          type: 'server',
        };
      case 502:
      case 503:
      case 504:
        return {
          message: (data.message as string) || 'Service temporarily unavailable. Please try again later.',
          statusCode: status,
          type: 'server',
        };
      default:
        return {
          message: (data.message as string) || `An error occurred (${status}). Please try again.`,
          statusCode: status,
          type: 'server',
        };
    }
  }

  // Generic error with message
  if (errorObj.message) {
    return {
      message: errorObj.message as string,
      type: 'client',
    };
  }

  // String errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'client',
    };
  }

  // Fallback for unknown error types
  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
  };

  // Fallback
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown',
  };
};

// Hook for showing toast notifications based on error type
export const useErrorToast = () => {
  const showErrorToast = React.useCallback((error: unknown, options?: Record<string, unknown>) => {
    const { message, type } = parseError(error);

    // Using react-hot-toast (already in providers)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const toast = require('react-hot-toast');

    switch (type) {
      case 'network':
        toast.error(message, { duration: 7000, ...options });
        break;
      case 'authentication':
        toast(message, { icon: '⚠️', duration: 5000, ...options });
        break;
      case 'rate_limit':
        toast(message, { duration: 6000, icon: 'ℹ️', ...options });
        break;
      case 'validation':
        toast(message, { icon: '⚠️', duration: 5000, ...options });
        break;
      default:
        toast.error(message, { duration: 5000, ...options });
    }
  }, []);

  return { showErrorToast };
};

export default ErrorMessage;

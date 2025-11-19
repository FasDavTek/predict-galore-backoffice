// features/auth/components/ErrorMessage.tsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { toast } from 'react-toastify';

export interface ErrorMessageProps {
  error: any;
  title?: string;
  severity?: 'error' | 'warning' | 'info';
  showDetails?: boolean;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  title,
  severity = 'error',
  showDetails = false,
  className,
}) => {
  const { message, statusCode, type } = parseError(error);

  const getErrorTitle = () => {
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
  };

  const getErrorSeverity = () => {
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
  };

  return (
    <Alert 
      severity={getErrorSeverity()} 
      className={className}
      sx={{ width: '100%', mb: 2 }}
    >
      <AlertTitle>{getErrorTitle()}</AlertTitle>
      {message}
      {showDetails && statusCode && (
        <Box sx={{ mt: 1, fontSize: '0.75rem', opacity: 0.7 }}>
          Status: {statusCode}
        </Box>
      )}
    </Alert>
  );
};

// Helper function to parse different error formats
export const parseError = (error: any): { 
  message: string; 
  statusCode?: number; 
  type: string;
} => {
  if (!error) {
    return { message: 'An unknown error occurred', type: 'unknown' };
  }

  // Network errors
  if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
    return { 
      message: 'Unable to connect to the server. Please check your internet connection and try again.', 
      type: 'network' 
    };
  }

  // Axios-like errors
  if (error.status || error.code) {
    const status = error.status || error.code;
    const data = error.data || error;
    
    switch (status) {
      case 400:
        return { 
          message: data.message || 'Invalid request. Please check your input and try again.', 
          statusCode: 400,
          type: 'validation'
        };
      case 401:
        return { 
          message: data.message || 'Authentication failed. Please check your credentials and try again.', 
          statusCode: 401,
          type: 'authentication'
        };
      case 403:
        return { 
          message: data.message || 'You do not have permission to perform this action.', 
          statusCode: 403,
          type: 'authorization'
        };
      case 404:
        return { 
          message: data.message || 'The requested resource was not found.', 
          statusCode: 404,
          type: 'not_found'
        };
      case 409:
        return { 
          message: data.message || 'A conflict occurred. This resource may already exist.', 
          statusCode: 409,
          type: 'validation'
        };
      case 422:
        return { 
          message: data.message || 'Validation failed. Please check your input.', 
          statusCode: 422,
          type: 'validation'
        };
      case 429:
        return { 
          message: data.message || 'Too many requests. Please wait a moment and try again.', 
          statusCode: 429,
          type: 'rate_limit'
        };
      case 500:
        return { 
          message: data.message || 'Internal server error. Please try again later.', 
          statusCode: 500,
          type: 'server'
        };
      case 502:
      case 503:
      case 504:
        return { 
          message: data.message || 'Service temporarily unavailable. Please try again later.', 
          statusCode: status,
          type: 'server'
        };
      default:
        return { 
          message: data.message || `An error occurred (${status}). Please try again.`, 
          statusCode: status,
          type: 'server'
        };
    }
  }

  // Generic error with message
  if (error.message) {
    return { 
      message: error.message, 
      type: 'client'
    };
  }

  // String errors
  if (typeof error === 'string') {
    return { 
      message: error, 
      type: 'client'
    };
  }

  // Fallback
  return { 
    message: 'An unexpected error occurred. Please try again.', 
    type: 'unknown'
  };
};

// Hook for showing toast notifications based on error type
export const useErrorToast = () => {
  const showErrorToast = (error: any, options?: any) => {
    const { message, type } = parseError(error);
    
    const toastConfig = {
      position: "top-center" as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case 'network':
        toast.error(message, { ...toastConfig, autoClose: 7000 });
        break;
      case 'authentication':
        toast.warning(message, toastConfig);
        break;
      case 'rate_limit':
        toast.info(message, { ...toastConfig, autoClose: 6000 });
        break;
      case 'validation':
        toast.warning(message, toastConfig);
        break;
      default:
        toast.error(message, toastConfig);
    }
  };

  return { showErrorToast };
};

export default ErrorMessage;
/**
 * Design Token Utilities
 * Helper functions and utilities for using design tokens
 */

import { SxProps, Theme } from '@mui/material/styles';
import { createLogger } from '@/shared/api';
import { designTokens } from '@/theme/tokens';

const logger = createLogger('Utils:Tokens');

// ====================
// Color Utilities
// ====================

export const getColor = (path: string): string => {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      logger.warn(`Color token not found: ${path}`);
      return '#000000';
    }
  }
  
  return value as string;
};

// ====================
// Spacing Utilities
// ====================

export const getSpacing = (key: keyof typeof designTokens.spacing): number => {
  return designTokens.spacing[key];
};

// ====================
// Typography Utilities
// ====================

export const getTypography = (path: string): string => {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = designTokens.typography;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      logger.warn(`Typography token not found: ${path}`);
      return 'inherit';
    }
  }
  
  return value as string;
};

// ====================
// Responsive Utilities
// ====================

export const responsive = <T>(
  values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  }
): SxProps<Theme> => {
  return {
    ...(values.xs !== undefined && { xs: values.xs }),
    ...(values.sm !== undefined && { sm: values.sm }),
    ...(values.md !== undefined && { md: values.md }),
    ...(values.lg !== undefined && { lg: values.lg }),
    ...(values.xl !== undefined && { xl: values.xl }),
  };
};

// ====================
// Common Style Patterns
// ====================

export const commonStyles = {
  // Error states
  errorState: {
    backgroundColor: designTokens.colors.semantic.errorBackground,
    borderColor: designTokens.colors.semantic.errorBorder,
    color: designTokens.colors.error[600],
  },
  
  // Success states
  successState: {
    backgroundColor: designTokens.colors.semantic.successBackground,
    color: designTokens.colors.success[600],
  },
  
  // Warning states
  warningState: {
    backgroundColor: designTokens.colors.semantic.warningBackground,
    color: designTokens.colors.warning[600],
  },
  
  // Info states
  infoState: {
    backgroundColor: designTokens.colors.semantic.infoBackground,
    color: designTokens.colors.info[600],
  },
  
  // Card styles
  card: {
    borderRadius: designTokens.borderRadius.lg,
    boxShadow: designTokens.shadows.md,
    padding: designTokens.spacing.cardPadding,
  },
  
  // Container styles
  container: {
    padding: {
      xs: designTokens.spacing.md,
      sm: designTokens.spacing.lg,
      md: designTokens.spacing.xl,
    },
  },
  
  // Flex utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
} as const;

// ====================
// Export
// ====================

export { designTokens } from '@/theme/tokens';


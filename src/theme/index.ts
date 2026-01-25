'use client';

import { createTheme } from '@mui/material/styles';
import { designTokens } from './tokens';

const theme = createTheme({
  palette: {
    primary: {
      main: designTokens.colors.primary[500],
      light: designTokens.colors.primary[400],
      dark: designTokens.colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: designTokens.colors.secondary[500],
      light: designTokens.colors.secondary[400],
      dark: designTokens.colors.secondary[700],
    },
    error: {
      main: designTokens.colors.error[600],
      light: designTokens.colors.error[400],
      dark: designTokens.colors.error[700],
    },
    success: {
      main: designTokens.colors.success[600],
      light: designTokens.colors.success[400],
      dark: designTokens.colors.success[700],
    },
    warning: {
      main: designTokens.colors.warning[500],
      light: designTokens.colors.warning[400],
      dark: designTokens.colors.warning[700],
    },
    info: {
      main: designTokens.colors.info[500],
      light: designTokens.colors.info[400],
      dark: designTokens.colors.info[700],
    },
    background: {
      default: designTokens.colors.semantic.background,
      paper: designTokens.colors.semantic.background,
    },
    text: {
      primary: designTokens.colors.semantic.textPrimary,
      secondary: designTokens.colors.semantic.textSecondary,
      disabled: designTokens.colors.semantic.textDisabled,
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily.primary,
    h1: {
      fontSize: designTokens.typography.fontSize['3xl'],
      lineHeight: designTokens.typography.lineHeight.tight,
      fontWeight: designTokens.typography.fontWeight.semibold,
      color: designTokens.colors.neutral[500],
    },
    h2: {
      fontSize: designTokens.typography.fontSize['2xl'],
      lineHeight: designTokens.typography.lineHeight.tight,
      fontWeight: designTokens.typography.fontWeight.semibold,
      color: designTokens.colors.neutral[500],
    },
    h3: {
      fontSize: designTokens.typography.fontSize.xl,
      lineHeight: designTokens.typography.lineHeight.normal,
      fontWeight: designTokens.typography.fontWeight.semibold,
      color: designTokens.colors.neutral[500],
    },
    h4: {
      fontFamily: designTokens.typography.fontFamily.secondary,
      fontWeight: designTokens.typography.fontWeight.normal,
      fontSize: designTokens.typography.fontSize.xl,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    h5: {
      fontFamily: designTokens.typography.fontFamily.secondary,
      fontWeight: designTokens.typography.fontWeight.normal,
      fontSize: designTokens.typography.fontSize.base,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    body1: {
      fontSize: designTokens.typography.fontSize.base,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.neutral[500],
    },
    body2: {
      fontSize: designTokens.typography.fontSize.sm,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.neutral[500],
    },
    caption: {
      fontSize: designTokens.typography.fontSize.xs,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.neutral[500],
    },
  },
  shape: {
    borderRadius: designTokens.borderRadius.lg,
  },
  breakpoints: {
    values: designTokens.breakpoints,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: designTokens.borderRadius.md,
          padding: `${designTokens.spacing.sm * designTokens.spacing.base}px ${designTokens.spacing.lg * designTokens.spacing.base}px`,
          fontWeight: designTokens.typography.fontWeight.semibold,
          transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: designTokens.shadows.none,
          },
        },
        outlined: {
          border: '1px solid',
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
          },
        },
        contained: {
          backgroundColor: designTokens.colors.primary[500],
          boxShadow: designTokens.shadows.none,
          '&:hover': {
            boxShadow: designTokens.shadows.lg,
          },
        },
        containedPrimary: {
          backgroundColor: designTokens.colors.primary[500],
          color: '#fff',
          '&:hover': {
            backgroundColor: designTokens.colors.primary[100],
          },
          '&:disabled': {
            backgroundColor: designTokens.colors.primary[200],
            color: designTokens.colors.primary[400],
          },
        },
      },
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontFamily: designTokens.typography.fontFamily.primary,
          color: designTokens.colors.secondary[500],
          '&:hover': {
            backgroundColor: `${designTokens.colors.primary[500]}14`, // 8% opacity
            color: designTokens.colors.primary[500],
          },
          '&.Mui-selected, &.Mui-active': {
            color: designTokens.colors.primary[500],
            backgroundColor: `${designTokens.colors.primary[500]}1F`, // 12% opacity
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: designTokens.typography.fontFamily.primary,
          borderRadius: designTokens.borderRadius.md,
          '& .MuiInputBase-root': {
            fontFamily: designTokens.typography.fontFamily.primary,
            borderRadius: designTokens.borderRadius.md,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.borderRadius.md,
            transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.easing.easeInOut}`,
            '& fieldset': {
              borderColor: designTokens.colors.semantic.border,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: designTokens.colors.semantic.borderHover,
            },
            '&.Mui-focused fieldset': {
              borderColor: designTokens.colors.primary[500],
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${designTokens.colors.primary[100]}`,
            },
            '&.Mui-disabled': {
              backgroundColor: designTokens.colors.semantic.backgroundSecondary,
              '& fieldset': {
                borderColor: designTokens.colors.semantic.border,
              },
            },
            '&.Mui-error fieldset': {
              borderColor: designTokens.colors.error[500],
            },
            '&.Mui-error.Mui-focused fieldset': {
              borderColor: designTokens.colors.error[500],
              boxShadow: `0 0 0 3px ${designTokens.colors.error[100]}`,
            },
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: designTokens.colors.neutral[500],
          fontWeight: designTokens.typography.fontWeight.medium,
          '&.Mui-focused': {
            color: designTokens.colors.primary[600],
          },
          '&.Mui-error': {
            color: designTokens.colors.error[600],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.md,
        },
      },
    },
  },
});

export default theme;

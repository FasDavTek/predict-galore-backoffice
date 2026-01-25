/**
 * Design Tokens
 * Centralized design system tokens for consistent styling
 */

// ====================
// Color Tokens
// ====================

export const colorTokens = {
  // Primary Brand Colors
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#42A605', // Main brand color
    600: '#28914b',
    700: '#22733d',
    800: '#1e5a32',
    900: '#1a4a2a',
  },
  // Secondary Colors
  secondary: {
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#41414B', // Main secondary
    600: '#34343a',
    700: '#2a2a2f',
    800: '#1f1f23',
    900: '#141417',
  },
  // Error/Red Colors
  error: {
    50: '#fef2f2',
    100: '#fee8e5',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f5777e',
    500: '#ec4251',
    600: '#e72838',
    700: '#b61a2e',
    800: '#99151f',
    900: '#7d1119',
  },
  // Success/Green Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#28914b',
    700: '#22733d',
    800: '#1e5a32',
    900: '#1a4a2a',
  },
  // Warning/Amber Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Info/Blue Colors
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Neutral/Gray Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737584',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Semantic Colors
  semantic: {
    errorBackground: '#FEF2F2',
    errorBorder: '#FEE2E2',
    successBackground: '#F0FDF4',
    warningBackground: '#FFFBEB',
    infoBackground: '#EFF6FF',
    disabled: '#CBD5E1',
    border: '#E2E8F0',
    borderHover: '#CBD5E1',
    background: '#ffffff',
    backgroundSecondary: '#F8FAFC',
    textPrimary: '#101012',
    textSecondary: '#5D5E6C',
    textDisabled: '#CBD5E1',
  },
} as const;

// ====================
// Spacing Tokens
// ====================

export const spacingTokens = {
  // Base spacing unit (4px)
  base: 4,
  // Spacing scale (in base units)
  xs: 1, // 4px
  sm: 2, // 8px
  md: 3, // 12px
  lg: 4, // 16px
  xl: 6, // 24px
  '2xl': 8, // 32px
  '3xl': 12, // 48px
  '4xl': 16, // 64px
  '5xl': 20, // 80px
  // Semantic spacing
  cardPadding: 3, // 12px
  sectionGap: 3, // 12px
  itemGap: 2, // 8px
  smallGap: 1, // 4px
  emptyStatePadding: 8, // 32px
  tableCellPadding: 2, // 8px
} as const;

// ====================
// Typography Tokens
// ====================

export const typographyTokens = {
  fontFamily: {
    primary: 'Inter, sans-serif',
    secondary: 'Inter, serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// ====================
// Breakpoint Tokens
// ====================

export const breakpointTokens = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// ====================
// Border Radius Tokens
// ====================

export const borderRadiusTokens = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ====================
// Shadow Tokens
// ====================

export const shadowTokens = {
  none: 'none',
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  lg: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  xl: '0px 8px 24px rgba(0, 0, 0, 0.2)',
} as const;

// ====================
// Z-Index Tokens
// ====================

export const zIndexTokens = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ====================
// Transition Tokens
// ====================

export const transitionTokens = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ====================
// Export All Tokens
// ====================

export const designTokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  breakpoints: breakpointTokens,
  borderRadius: borderRadiusTokens,
  shadows: shadowTokens,
  zIndex: zIndexTokens,
  transitions: transitionTokens,
} as const;


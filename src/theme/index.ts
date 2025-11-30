"use client";

import { createTheme } from "@mui/material/styles";

const colors = {
  green: {
    100: "#e0f8e7",
    200: "#c2f0d0",
    400: "#5ccc80",
    500: "#42A605",
    600: "#28914b",
    700: "#22733d",
  },
  red: {
    100: "#fee8e5",
    400: "#f5777e",
    500: "#ec4251",
    600: "#e72838",
    700: "#b61a2e",
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#42A605',
      light: '#5bbd1a',
      dark: colors.green[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#41414B',
      light: colors.red[500],
      dark: colors.red[700],
    },
    error: {
      main: colors.red[600],
      light: colors.red[400],
      dark: colors.red[700],
    },
    success: {
      main: colors.green[600],
      light: colors.green[400],
      dark: colors.green[700],
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
    text: {
      primary: "#101012",
      secondary: "#5D5E6C",
      disabled: "#CBD5E1",
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: 600,
      color: '#737584',
    },
    h2: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
      color: '#737584',
    },
    h3: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
      color: '#737584',
    },
    h4: {
      fontFamily: 'Inter, serif',
      fontWeight: 400,
      fontSize: "20px",
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'Inter, serif',
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#737584',
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#737584',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      color: '#737584',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
          '&:hover': {
            boxShadow: 'none',
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
          backgroundColor: '#42A605',
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        containedPrimary: {
          backgroundColor: '#42A605',
          color: "#fff",
          "&:hover": {
            backgroundColor: colors.green[100],
          },
          "&:disabled": {
            backgroundColor: colors.green[200],
            color: colors.green[400],
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
          fontFamily: 'Inter, sans-serif',
          color: '#41414B',
          '&:hover': {
            backgroundColor: 'rgba(66, 166, 5, 0.08)',
            color: '#42A605',
          },
          '&.Mui-selected, &.Mui-active': {
            color: '#42A605',
            backgroundColor: 'rgba(66, 166, 5, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
          '& .MuiInputBase-root': {
            fontFamily: 'Inter, sans-serif',
            borderRadius: '8px',
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "#E2E8F0",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#CBD5E1",
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.green[500],
              borderWidth: "2px",
              boxShadow: `0 0 0 3px ${colors.green[100]}`,
            },
            "&.Mui-disabled": {
              backgroundColor: "#F8FAFC",
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
            },
            "&.Mui-error fieldset": {
              borderColor: colors.red[500],
            },
            "&.Mui-error.Mui-focused fieldset": {
              borderColor: colors.red[500],
              boxShadow: `0 0 0 3px ${colors.red[100]}`,
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
          color: "#64748B",
          fontWeight: 500,
          "&.Mui-focused": {
            color: colors.green[600],
          },
          "&.Mui-error": {
            color: colors.red[600],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
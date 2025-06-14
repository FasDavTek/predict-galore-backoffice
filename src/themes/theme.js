// theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#42A605', // Main green color
      light: '#5bbd1a', // Slightly lighter version for hover/active

      contrastText: '#ffffff', // White text for better contrast on primary
    },
    secondary: {
      main: '#41414B', // Inactive icon color
    },
    text: {
      primary: '#101012', // Default text and heading color
      secondary: '#5D5E6C', // Secondary text color
    },
    // Custom palette extensions for specific use cases
    custom: {
      iconActive: '#42A605',
      iconInactive: '#41414B',
      iconHoverBg: 'rgba(66, 166, 5, 0.08)', // Light background on hover
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: 600,
      color: '#737584', // Heading color
    },
    h2: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
      color: '#737584', // Heading color
    },
    h3: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
      color: '#737584', // Heading color
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#737584', // Default text color
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#737584', // Default text color
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      color: '#737584', // Default text color
    },
  },
  components: {
   MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 600,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        // Add specific overrides for outlined variant
        outlined: {
          border: '1px solid',
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText', // white text
            borderColor: 'primary.main',
          },
          '&:active': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          },
        },
      },
      defaultProps: {
        variant: 'contained',
        color: 'primary',
        fontFamily: "Inter",
        fontWeight: 600,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          color: '#41414B', // Inactive icon color
          '&:hover': {
            backgroundColor: 'rgba(66, 166, 5, 0.08)', // Light green bg on hover
            color: '#42A605', // Active color on hover
          },
          '&.Mui-selected, &.Mui-active': {
            color: '#42A605', // Active color
            backgroundColor: 'rgba(66, 166, 5, 0.12)',
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          body1: 'p',
          body2: 'p',
          caption: 'span',
        },
      },
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          color: '#101012', 

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
          '& .MuiInputLabel-root': {
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif',
          borderRadius: '8px',
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
    // Add more component customizations as needed
  },
});

export default theme;
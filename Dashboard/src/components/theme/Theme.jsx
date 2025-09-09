// Enhanced Theme Configuration for Dashboard
import { createTheme } from '@mui/material/styles';

// Color constants for consistency
const COLORS = {
  primary: '#4faa84',
  primaryDark: '#3c7168',
  secondary: '#ec4899',
  secondaryDark: '#f472b6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

// Common theme configuration
const commonTheme = {
  direction: 'rtl',
  typography: {
    fontFamily: 'Dubai, Tajawal, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.primary,
      dark: COLORS.primaryDark,
      light: '#6bc49f',
      contrastText: '#ffffff'
    },
    secondary: {
      main: COLORS.secondary,
      dark: '#be185d',
      light: '#f9a8d4'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    },
    divider: '#e2e8f0',
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.error },
    info: { main: COLORS.info }
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid #f1f5f9'
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#6bc49f',
      dark: COLORS.primary,
      light: '#8dd3b7',
      contrastText: '#ffffff'
    },
    secondary: {
      main: COLORS.secondaryDark,
      dark: '#ec4899',
      light: '#fbb6ce'
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1'
    },
    divider: '#334155',
    success: { main: '#22c55e' },
    warning: { main: '#fbbf24' },
    error: { main: '#f87171' },
    info: { main: '#60a5fa' }
  },
  components: {
    ...commonTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)',
          border: '1px solid #334155',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }
      }
    }
  }
});

// Theme persistence utilities
export const saveThemePreference = (isDark) => {
  localStorage.setItem('darkMode', JSON.stringify(isDark));
};

export const getThemePreference = () => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    return JSON.parse(saved);
  }
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
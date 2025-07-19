// src/theme/index.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Tajawal, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});

export const darkTheme = createTheme({
    direction: 'rtl', // إضافة هذا السطر
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8',
    },
    secondary: {
      main: '#f472b6',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
  },
  typography: {
    fontFamily: 'Tajawal, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});
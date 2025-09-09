// Theme utilities for dark mode fixes
export const applyThemeToDocument = (isDark) => {
  const root = document.documentElement;
  
  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('--background-color', '#0f172a');
    root.style.setProperty('--text-color', '#f8fafc');
    root.style.setProperty('--paper-color', '#1e293b');
    root.style.setProperty('--divider-color', '#334155');
  } else {
    root.setAttribute('data-theme', 'light');
    root.style.setProperty('--background-color', '#f8fafc');
    root.style.setProperty('--text-color', '#1e293b');
    root.style.setProperty('--paper-color', '#ffffff');
    root.style.setProperty('--divider-color', '#e2e8f0');
  }
};

// Fix for components that don't respect theme
export const getThemeAwareStyles = (theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 4px 6px -1px rgba(0,0,0,0.3)' 
      : '0 1px 3px rgba(0,0,0,0.1)'
  },
  text: {
    primary: theme.palette.text.primary,
    secondary: theme.palette.text.secondary
  },
  background: {
    default: theme.palette.background.default,
    paper: theme.palette.background.paper
  }
});

// Force theme colors for stubborn components
export const forceThemeColors = (theme) => {
  const isDark = theme.palette.mode === 'dark';
  
  return {
    '--mui-palette-background-default': theme.palette.background.default,
    '--mui-palette-background-paper': theme.palette.background.paper,
    '--mui-palette-text-primary': theme.palette.text.primary,
    '--mui-palette-text-secondary': theme.palette.text.secondary,
    '--mui-palette-divider': theme.palette.divider,
    
    // Force specific component colors
    '.MuiPaper-root': {
      backgroundColor: `${theme.palette.background.paper} !important`,
      color: `${theme.palette.text.primary} !important`
    },
    '.MuiTypography-root': {
      color: `${theme.palette.text.primary} !important`
    },
    '.MuiTableCell-root': {
      color: `${theme.palette.text.primary} !important`,
      borderBottomColor: `${theme.palette.divider} !important`
    }
  };
};
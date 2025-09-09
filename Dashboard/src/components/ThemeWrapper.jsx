import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { getThemeAwareStyles } from '../utils/themeUtils';

/**
 * مكون مساعد لضمان تطبيق النظام المظلم بشكل صحيح
 */
const ThemeWrapper = ({ children, sx = {}, ...props }) => {
  const theme = useTheme();
  const themeStyles = getThemeAwareStyles(theme);

  useEffect(() => {
    // تطبيق الألوان على المستند
    const root = document.documentElement;
    root.style.setProperty('--theme-background', theme.palette.background.default);
    root.style.setProperty('--theme-paper', theme.palette.background.paper);
    root.style.setProperty('--theme-text-primary', theme.palette.text.primary);
    root.style.setProperty('--theme-text-secondary', theme.palette.text.secondary);
    root.style.setProperty('--theme-divider', theme.palette.divider);
  }, [theme]);

  const combinedSx = {
    ...themeStyles.background,
    color: themeStyles.text.primary,
    ...sx
  };

  return React.cloneElement(children, {
    ...props,
    sx: combinedSx
  });
};

export default ThemeWrapper;
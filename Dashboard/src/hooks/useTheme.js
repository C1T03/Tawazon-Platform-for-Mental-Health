import { useState, useEffect, useCallback } from 'react';
import { saveThemePreference, getThemePreference } from '../components/theme/Theme';

/**
 * Custom hook for managing theme state and persistence
 * @returns {Object} Theme state and controls
 */
export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => getThemePreference());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't set a preference
      const savedPreference = localStorage.getItem('darkMode');
      if (savedPreference === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Enhanced toggle with smooth transition
  const toggleDarkMode = useCallback(() => {
    setIsTransitioning(true);
    
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveThemePreference(newDarkMode);
    
    // Add smooth transition effect
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    setTimeout(() => {
      document.documentElement.style.transition = '';
      setIsTransitioning(false);
    }, 300);
  }, [darkMode]);

  // Reset to system preference
  const resetToSystemTheme = useCallback(() => {
    localStorage.removeItem('darkMode');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPreference);
  }, []);

  return {
    darkMode,
    toggleDarkMode,
    resetToSystemTheme,
    isTransitioning
  };
};
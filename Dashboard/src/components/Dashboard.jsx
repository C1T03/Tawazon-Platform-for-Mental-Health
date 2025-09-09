import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { darkTheme, lightTheme } from './theme/Theme';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import ContentArea from './ContentArea';
import MobileHeader from './MobileHeader';
import Sidebar from './SideBar';
import AuthGuard from './AuthGuard';
import { useTheme } from '../hooks/useTheme';
import { applyThemeToDocument } from '../utils/themeUtils';

// Debounce utility for resize events
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  return useCallback((...args) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setDebounceTimer(setTimeout(() => callback(...args), delay));
  }, [callback, delay, debounceTimer]);
};

export default function Dashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("statistics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { darkMode, toggleDarkMode, isTransitioning } = useTheme();

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);
  
  const debouncedHandleResize = useDebounce(handleResize, 150);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, [handleResize, debouncedHandleResize]);

  // Memoize theme to prevent unnecessary re-renders
  const currentTheme = useMemo(() => darkMode ? darkTheme : lightTheme, [darkMode]);
  
  // Apply theme to document
  useEffect(() => {
    applyThemeToDocument(darkMode);
  }, [darkMode]);

  // Check authentication status - DISABLED TEMPORARILY
  useEffect(() => {
    // مؤقتاً: السماح بالدخول بدون فحص المصادقة
    setIsAuthenticated(true);
    setShowAuthGuard(false);
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleCloseAuthGuard = () => {
    setShowAuthGuard(false);
  };

  // مؤقتاً معطل
  // if (!isAuthenticated) {
  //   return (
  //     <ThemeProvider theme={currentTheme}>
  //       <CssBaseline />
  //       <AuthGuard 
  //         open={showAuthGuard}
  //         onLogin={handleLogin}
  //         onClose={handleCloseAuthGuard}
  //         darkMode={darkMode}
  //       />
  //     </ThemeProvider>
  //   );
  // }
    
  return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <div
          data-theme={darkMode ? 'dark' : 'light'}
          style={{
            display: "flex",
            position: "relative",
            direction: "rtl",
            padding: 0,
            overflow: "hidden",
            minHeight: "100vh",
            background: darkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #f8fdfc 0%, #e8f5f0 100%)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Sidebar يأخذ مساحة ثابتة */}
          <Box
            sx={{
              flexShrink: 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: 'relative',
              zIndex: 10
            }}
          >
            <Sidebar
              selectedMenuItem={selectedMenuItem}
              setSelectedMenuItem={setSelectedMenuItem}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </Box>

          {/* المحتوى الرئيسي يأخذ المساحة المتبقية */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              position: 'relative',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: darkMode
                  ? 'radial-gradient(circle at 20% 80%, rgba(79, 170, 132, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.03) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 20% 80%, rgba(79, 170, 132, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.02) 0%, transparent 50%)',
                pointerEvents: 'none',
                zIndex: -1
              }
            }}
          >
            <MobileHeader
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              selectedMenuItem={selectedMenuItem}
            />

            <ContentArea selectedMenuItem={selectedMenuItem} />
          </Box>
        </div>{" "}
        <AuthGuard 
          open={showAuthGuard}
          onLogin={handleLogin}
          onClose={handleCloseAuthGuard}
          darkMode={darkMode}
        />
      </ThemeProvider>
  )
}

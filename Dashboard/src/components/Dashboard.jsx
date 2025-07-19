import React from 'react'
import { useEffect,useState } from 'react';
import { darkTheme,lightTheme } from './theme/Theme';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import ContentArea from './ContentArea';
import MobileHeader from './MobileHeader';
import Sidebar from './SideBar';
export default function Dashboard() {
      const [selectedMenuItem, setSelectedMenuItem] = useState("statistics");
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [darkMode, setDarkMode] = useState(false);
    
      useEffect(() => {
        const handleResize = () => {
          setIsSidebarOpen(window.innerWidth >= 768);
        };
    
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      const toggleDarkMode = () => {
        setDarkMode(!darkMode);
      };
    
      const currentTheme = darkMode ? darkTheme : lightTheme;
    
  return (
    
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <div
          style={{
            display: "flex",

            position: "relative",
            direction: "rtl",
            padding: 0,
            overflow: "hidden", // تغيير من scroll إلى hidden
          }}
        >
          {/* Sidebar يأخذ مساحة ثابتة */}
          <Box
            sx={{
              width: isSidebarOpen ? 280 : 0,
              flexShrink: 0,
              transition: "width 0.3s ease",
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
      </ThemeProvider>
  )
}

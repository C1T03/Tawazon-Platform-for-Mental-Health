// src/components/MobileHeader.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function MobileHeader({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  selectedMenuItem
}) {
  const menuTitles = {
    statistics: 'الإحصائيات',
    dashboard: 'لوحة التحكم',
    users: 'التقارير',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي'
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        display: { md: 'none' },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          edge="end" // تغيير من start إلى end
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          sx={{ color: 'inherit' }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {menuTitles[selectedMenuItem]}
        </Typography>
        <IconButton edge="start" sx={{ visibility: 'hidden' }}> {/* تغيير من end إلى start */}
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
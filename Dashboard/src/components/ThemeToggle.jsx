import React from 'react';
import {
  Box,
  Switch,
  Typography,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  SettingsBrightness
} from '@mui/icons-material';

/**
 * Enhanced Theme Toggle Component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current dark mode state
 * @param {Function} props.toggleDarkMode - Function to toggle dark mode
 * @param {boolean} props.collapsed - Whether the sidebar is collapsed
 * @param {boolean} props.showSystemOption - Show system preference option
 */
const ThemeToggle = ({ 
  darkMode, 
  toggleDarkMode, 
  collapsed = false, 
  showSystemOption = false,
  onResetToSystem 
}) => {
  const theme = useTheme();

  const getThemeIcon = () => {
    if (darkMode) {
      return <Brightness7 sx={{ color: '#fbbf24', fontSize: collapsed ? 18 : 20 }} />;
    }
    return <Brightness4 sx={{ color: theme.palette.text.secondary, fontSize: collapsed ? 18 : 20 }} />;
  };

  const getThemeLabel = () => {
    return darkMode ? 'الوضع المظلم' : 'الوضع الفاتح';
  };

  if (collapsed) {
    return (
      <Tooltip title={getThemeLabel()} placement="left">
        <IconButton
          onClick={toggleDarkMode}
          sx={{
            p: 1,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(0,0,0,0.05)',
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.15)' 
                : 'rgba(0,0,0,0.08)',
              transform: 'scale(1.05)'
            }
          }}
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.05)',
          borderRadius: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(0,0,0,0.08)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getThemeIcon()}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              color: theme.palette.text.primary
            }}
          >
            {getThemeLabel()}
          </Typography>
        </Box>

        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          size="small"
          sx={{
            '& .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#d1d5db',
            },
            '& .MuiSwitch-thumb': {
              backgroundColor: darkMode ? '#fbbf24' : '#6b7280',
            }
          }}
        />
      </Box>

      {showSystemOption && (
        <Tooltip title="العودة لإعدادات النظام">
          <IconButton
            onClick={onResetToSystem}
            size="small"
            sx={{
              mt: 1,
              width: '100%',
              justifyContent: 'flex-start',
              gap: 1,
              color: theme.palette.text.secondary,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <SettingsBrightness fontSize="small" />
            <Typography variant="caption">
              إعدادات النظام
            </Typography>
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ThemeToggle;
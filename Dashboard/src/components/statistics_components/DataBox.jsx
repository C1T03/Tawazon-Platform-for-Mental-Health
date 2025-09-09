import { MedicalServices, Psychology } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';

export default function DataBox({ 
  title = "بدون عنوان", 
  count = "بدون رقم", 
  icon
}) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{
        width: 250,
        height: 120,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        cursor: 'pointer',
        m: 2,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
       
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1.5
      }}>
         
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: theme.palette.action.hover,
          ml: 1
        }}>
          {icon}
        </Box>
        <Typography 
          variant="subtitle1"
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'right',
            flexGrow: 1,
            lineHeight: 1.3,
            fontFamily: 'Dubai'
          }}
        >
          {title}
        </Typography>
       
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
       
        pr: 6,
        flexGrow: 1
      }}>
        <Typography 
          variant="p"
          sx={{ 
            fontWeight: 700,
            lineHeight: 1,
          
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
}
// src/components/sections/Dashboard.js
import React from 'react';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';

export default function Dashboard() {
 
  
  return (
    <Box sx={{ direction: 'rtl' }}>
      <Typography paragraph sx={{ mb: 4, textAlign: 'right' }}>
        هذا قسم لوحة التحكم حيث يمكنك إدارة النظام وإعداداته.
      </Typography>
      
    
    </Box>
  );
}
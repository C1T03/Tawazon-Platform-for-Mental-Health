// src/components/sections/Reports.js
import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';

export default function Reports() {
 
  return (
    <Box sx={{ direction: 'rtl' }}>
      <Typography paragraph sx={{ mb: 4, textAlign: 'right' }}>
        هذا قسم التقارير حيث يمكنك عرض وتنزيل التقارير المختلفة.
      </Typography>
   
    </Box>
  );
}
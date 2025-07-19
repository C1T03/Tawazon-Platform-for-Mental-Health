import { Box, Typography } from '@mui/material';
import React from 'react';

export default function DataBox({ 
  title = "بدون عنوان", 
  count = "بدون رقم", 
  
}) {
  return (
    <Box 
      sx={{
        width: 250,
        height: 150,
        backgroundColor: "#3c7168",
        boxShadow: 3,
        borderRadius: 2,
        cursor: 'pointer',
        p: 3,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <Typography 
        variant='h5' 
        color='#fff' 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'right',
          fontFamily: 'Dubai'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant='h6' 
        color='#fff' 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mt: 1,
        }}
      >
        {count}
      </Typography>
    </Box>
  );
}
import React from 'react';
import { Paper, Box, Typography, useTheme } from '@mui/material';
import ProgressCircle from './ProgressCircle';

const SecondaryProgressCard = ({ 
  title = "المشروع الفرعي",
  percentage = 50,
  tasks = 15,
  strokeColor,
  textColor,   
  bgStrokeColor
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        minWidth: 250,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 3
        }
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ 
          width: 80, 
          height: 80,
          flexShrink: 0 
        }}>
          <ProgressCircle 
            width={80}
            height={80}
            percentage={percentage}
            strokeColor={strokeColor || theme.palette.secondary.main}
            textColor={textColor || theme.palette.secondary.dark}
            bgStrokeColor={bgStrokeColor || theme.palette.grey[300]}
            fontSize={18}
            strokeWidth={8}
            bgStrokeWidth={5}
            description=""
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" fontFamily="Dubai" >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} fontFamily="Dubai">
            {`${tasks} مهمة`}
          </Typography>
          <Box sx={{ 
            width: '100%',
            height: 4,
            bgcolor: 'action.hover',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              width: `${percentage}%`,
              height: '100%',
              bgcolor: strokeColor || theme.palette.secondary.main,
              transition: 'width 0.5s ease'
            }} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SecondaryProgressCard;
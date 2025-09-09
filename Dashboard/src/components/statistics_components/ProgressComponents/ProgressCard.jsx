import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import ProgressCircle from './ProgressCircle';

const ProgressCard = ({ 
  title = "الفريق النفسي",
  description = "مجموعة من المتخصصين في الصحة النفسية العاملين في منصة توازن للعلاج النفسي",
  percentage = 75,
  stats = [
    { label: "عدد الاختصاصات", value: "24" },
    { label: "العدد الكلي للمتخصصين", value: "12" },
  ]
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 8,
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 4,
        bgcolor: 'background.default',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 4px 6px -1px rgba(0,0,0,0.3)' 
          : '0 1px 3px rgba(0,0,0,0.1)',
    
      }}
    >
      <Box sx={{ 
        flexShrink: 0,
        width: { xs: '100%', sm: 180, md: 200 },
        height: { xs: 180, sm: 180, md: 200 },
        display: 'flex',
        justifyContent: 'center'
      }}>
        <ProgressCircle percentage={percentage} />
      </Box>
      
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary" fontFamily="Dubai">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" fontFamily="Dubai">
          {description}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mt: 1
        }}>
          {stats.map((stat, index) => (
            <Box key={index}>
                <Typography variant="caption" color="text.disabled" fontFamily="Dubai">{stat.label}</Typography>
              <Typography variant="body1" fontWeight="bold" fontFamily="Dubai">{stat.value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProgressCard;
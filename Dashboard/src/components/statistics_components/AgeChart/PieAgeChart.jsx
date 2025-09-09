import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieAgeChart = ({
  title = 'توزيع الفئات العمرية',
  ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'],
  ageData = [30, 25, 20, 15, 10],
  height = 450,
  width = '100%',
  showLegend = true,
  legendPosition = 'right',
  showPercentage = true
}) => {
  const theme = useTheme();

  // تدرج ألوان أخضر أنيق مع تباين جيد
  const colorPalette = [
    '#E0F2F1', // فاتح جداً
    '#B2DFDB', // فاتح
    '#80CBC4', // متوسط
    '#4DB6AC', // غامق قليلاً
    '#26A69A', // غامق
    '#00897B', // غامق جداً
    '#00796B', // داكن
    '#00695C', // داكن جداً
  ];

  const chartData = {
    labels: ageGroups,
    datasets: [{
      data: ageData,
      backgroundColor: colorPalette,
      borderColor: theme.palette.mode === 'dark' 
        ? theme.palette.background.paper 
        : '#FFFFFF',
      borderWidth: 2,
      hoverBackgroundColor: colorPalette.map(color => 
        theme.palette.mode === 'dark' 
          ? `${color}CC` 
          : `${color}99`
      ),
      hoverBorderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            family: theme.typography.fontFamily,
            weight: 500
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
        onHover: (event) => {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: (event) => {
          event.native.target.style.cursor = 'default';
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            
            return showPercentage 
              ? ` ${label}: ${value} (${percentage}%)`
              : ` ${label}: ${value}`;
          },
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 13,
          weight: '500'
        },
        boxPadding: 6,
      },
    },
    // إزالة خاصية cutout ليكون مخطط دائرة كاملة
    animation: {
      animateScale: true,
      animateRotate: true
    },
    elements: {
      arc: {
        borderRadius: 4, // زوايا مدورة للشرائح
      }
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width,
        height,
        p: 3,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{
          width: '90%',
          height: '90%',
          maxWidth: 500,
          position: 'relative'
        }}>
          <Pie 
            data={chartData} 
            options={chartOptions} 
          />
        </Box>
      </Box>
    </Paper>
  );
};

PieAgeChart.propTypes = {
  title: PropTypes.string,
  ageGroups: PropTypes.arrayOf(PropTypes.string),
  ageData: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showPercentage: PropTypes.bool
};

export default PieAgeChart;
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

// تسجيل مكونات Chart.js المطلوبة
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieAgeChart = ({
  ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'],
  ageData = [30, 25, 20, 15, 10],
  height = 450,
  width = '100%',
  showLegend = true,
  legendPosition = 'right',
  showPercentage = true
}) => {
  const theme = useTheme();

  // الألوان الخضراء المطلوبة مع تدرجاتها
  const baseColors = [
    '#004030', // أخضر داكن جداً
    '#4A9782', // أخضر متوسط
    '#03A6A1', // أخضر مزرق
    '#028760', // أخضر غامق
    '#026C56'  // أخضر داكن
  ];

  // إضافة شفافية للألوان الأساسية
  const backgroundColors = baseColors.map(color => `${color}${Math.floor(0.7 * 255).toString(16).padStart(2, '0')}`);
  const borderColors = baseColors;

  const chartData = {
    labels: ageGroups,
    datasets: [{
      data: ageData,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
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
            family: theme.typography.fontFamily
          },
          padding: 20, // زيادة المسافة بين العناصر في الليجند
        boxWidth: 15 // تقليل عرض مربع اللون
      },
      // التحكم في المسافة بين الليجند والمخطط
      padding: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
      }
    
      },
      title: {
        display: true,
        font: {
          size: 0,
          family: theme.typography.fontFamily
        },
        color: theme.palette.text.primary,
        padding: {
          top: 2,
          bottom: 2
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            
            return showPercentage 
              ? `${label}: ${value} فرد (${percentage}%)`
              : `${label}: ${value} فرد`;
          },
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 14
        }
      },
    },
    cutout: '60%'
  };

  return (
    <Box sx={{ 
      width, 
      height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{ 
            width: '100%', 
            height: '100%',
            maxHeight: height - 24,
            position: 'relative'
          }}>
            <Pie 
              data={chartData} 
              options={chartOptions} 
            />
          </Box>
        </Box>
     
    </Box>
  );
};

PieAgeChart.propTypes = {
  ageGroups: PropTypes.arrayOf(PropTypes.string),
  ageData: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showLegend: PropTypes.bool,
  legendPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showPercentage: PropTypes.bool
};

export default PieAgeChart;
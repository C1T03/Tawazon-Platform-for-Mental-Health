import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopulationPyramid = ({
  title = "هرم المستخدمين حسب العمر والجنس",
  fontFamily = 'Dubai',
  ageGroups = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+'],
  maleData = [15, 18, 20, 18, 15, 12, 8, 5],
  femaleData = [14, 17, 19, 17, 14, 11, 9, 6],
  maleColor = '#4a8fe7',
  femaleColor = '#e67c96',
  height = 500,
  width = '100%'
}) => {
  const theme = useTheme();

  // جعل بيانات الذكور سالبة لعرضها على الجانب الأيسر
  const formattedMaleData = maleData.map(value => -value);

  const data = {
    labels: ageGroups,
    datasets: [
      {
        label: 'ذكور',
        data: formattedMaleData,
        backgroundColor: maleColor,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: `${maleColor}CC`,
        barThickness: 20,
      },
      {
        label: 'إناث',
        data: femaleData,
        backgroundColor: femaleColor,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: `${femaleColor}CC`,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: fontFamily,
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
        onHover: (event) => {
          event.native.target.style.cursor = 'pointer';
        },
        onLeave: (event) => {
          event.native.target.style.cancel = 'default';
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
            const label = context.dataset.label || '';
            const value = Math.abs(context.raw);
            return ` ${label}: ${value}%`;
          },
        },
        bodyFont: {
          family: fontFamily,
          size: 14,
          weight: '500'
        },
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          callback: (value) => Math.abs(value),
          font: {
            family: fontFamily,
          },
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'النسبة المئوية (%)',
          color: theme.palette.text.primary,
          font: {
            family: fontFamily,
            size: 14,
            weight: 'bold'
          },
        },
        min: -Math.max(...maleData) * 1.1,
        max: Math.max(...femaleData) * 1.1,
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: fontFamily,
          },
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'الفئات العمرية',
          color: theme.palette.text.primary,
          font: {
            family: fontFamily,
            size: 14,
            weight: 'bold'
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
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
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'text.primary',
          textAlign: 'center',
          fontFamily: fontFamily,
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        flex: 1,
        position: 'relative',
      }}>
        <Bar 
          data={data} 
          options={options} 
        />
      </Box>
    </Paper>
  );
};

PopulationPyramid.propTypes = {
  title: PropTypes.string,
  fontFamily: PropTypes.string,
  ageGroups: PropTypes.arrayOf(PropTypes.string),
  maleData: PropTypes.arrayOf(PropTypes.number),
  femaleData: PropTypes.arrayOf(PropTypes.number),
  maleColor: PropTypes.string,
  femaleColor: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PopulationPyramid;
import React from 'react';
import {
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
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

// تسجيل العناصر اللازمة
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AgeBarChart = ({
  title = 'توزيع المستخدمين حسب الفئات العمرية',
  labels = ['18-24', '25-34', '35-44', '45-54', '55+'],
  dataValues = [120, 250, 180, 90, 60],
  datasetLabel = 'عدد المستخدمين',
  height = 400,
  width = '100%'
}) => {
  const theme = useTheme();

  // ألوان متدرجة بناءً على الثيم
  const getGradientColors = () => {
    return [
      '#8fd3b6', // أخضر فاتح
      '#4faa84', // اللون الأصلي
      '#3a7d63'  // أخضر غامق
    ];
  };

  const data = {
    labels,
    datasets: [{
      label: datasetLabel,
      data: dataValues,
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return theme.palette.primary.main;
        
        const gradient = ctx.createLinearGradient(
          0, chartArea.bottom, 
          0, chartArea.top
        );
        const colors = getGradientColors();
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        return gradient;
      },
      borderWidth: 0,
      borderRadius: {
        topLeft: 12,
        topRight: 12,
        bottomLeft: 0,
        bottomRight: 0
      },
      barThickness: 40,
      hoverBackgroundColor: '#3a7d63', // أخضر غامق,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return `الفئة العمرية: ${context[0].label}`;
          },
          label: (context) => {
            return ` عدد المستخدمين: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          padding: 8,
          callback: (value) => `${value} مستخدم`
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          padding: 12,
          font: {
            weight: 500,
          }
        },
      }
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
          textAlign: 'right',
          fontFamily: 'Dubai'
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        pr: 1,
        mb: 1
      }}>
        <Bar data={data} options={options} />
      </Box>
    </Paper>
  );
};

  AgeBarChart.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  dataValues: PropTypes.arrayOf(PropTypes.number),
  datasetLabel: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default AgeBarChart;
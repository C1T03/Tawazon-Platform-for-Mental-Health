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

// تسجيل مكونات Chart.js المطلوبة
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
  maleColor = 'rgba(54, 162, 235, 0.7)',
  femaleColor = 'rgba(255, 99, 132, 0.7)',
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
        borderColor: maleColor.replace('0.7', '1'),
        borderWidth: 1,
      },
      {
        label: 'إناث',
        data: femaleData,
        backgroundColor: femaleColor,
        borderColor: femaleColor.replace('0.7', '1'),
        borderWidth: 1,
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
            family: theme.typography.fontFamily,
          }
        },
      },
      title: {
        display: true,
        text: title,

        color: theme.palette.text.primary,
        font: {
          size: 18,
          family: fontFamily,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = Math.abs(context.raw);
            return `${label}: ${value}%`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          callback: function(value) {
            return Math.abs(value);
          },
        },
        grid: {
          color: theme.palette.divider,
        },
        title: {
          display: true,
          text: 'النسبة المئوية',
          color: theme.palette.text.primary,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
        title: {
          display: true,
          text: 'الفئات العمرية',
          color: theme.palette.text.primary,
        },
      },
    },
  };

  return (
    <Box sx={{ width, height }}>
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
     
        <Box sx={{ height: height - 30 }}>
          <Bar data={data} options={options} />
        </Box>
      </Paper>
    </Box>
  );
};

PopulationPyramid.propTypes = {
  title: PropTypes.string,
  ageGroups: PropTypes.arrayOf(PropTypes.string),
  maleData: PropTypes.arrayOf(PropTypes.number),
  femaleData: PropTypes.arrayOf(PropTypes.number),
  maleColor: PropTypes.string,
  femaleColor: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PopulationPyramid;
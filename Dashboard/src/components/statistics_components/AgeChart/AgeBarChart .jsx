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
  title = 'متوسط أعمار الأشخاص حسب المجموعة',
  labels = ['مجموعة A', 'مجموعة B', 'مجموعة C', 'مجموعة D', 'مجموعة E'],
  dataValues = [24, 30, 26, 35, 28],
  datasetLabel = 'متوسط العمر',
  height = 400,
  width = '100%'
}) => {
  const theme = useTheme();

  // اللون الثابت #4faa84 مع تباين في الشفافية
  const mainColor = '#4faa84';
  const backgroundColors = dataValues.map(() => `${mainColor}80`); // 80 = 50% opacity in hex
  const borderColors = dataValues.map(() => mainColor);

  const data = {
    labels,
    datasets: [{
      label: datasetLabel,
      data: dataValues,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
      borderRadius: {
        topLeft: 10,
        topRight: 10,
        bottomLeft: 0,
        bottomRight: 0
      },
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
        },
        color: theme.palette.text.primary
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw} سنة`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.divider
        }
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary
        },
        grid: {
          color: theme.palette.divider
        }
      }
    },
  };

  return (
    <Box sx={{ width, height }}>
     
        <Typography variant="h5" gutterBottom align="center" fontFamily={'Dubai'}>
          مخطط متوسط الأعمار
        </Typography>
        <Box sx={{ height: height - 100, mx: 4 }}>
          <Bar data={data} options={options} />
        </Box>
    
    </Box>
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
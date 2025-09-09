import React, { useState, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
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
  useTheme,
  MenuItem,
  FormControl,
  Select,
  Grid
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PropTypes from 'prop-types';

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UsersByCityBarChart = ({
  title = 'توزيع المستخدمين في منصة توازن للرعاية النفسية',
  labels = [],
  dataValues = [],
  height = 800,
 
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filteredLabels, setFilteredLabels] = useState(labels);
  const [filteredData, setFilteredData] = useState(dataValues);
  const [showAll, setShowAll] = useState(true);

  // ألوان متدرجة لكل مدينة
  const backgroundColors = [
    '#4faa84', '#3a7d63', '#8fd3b6', '#2e5d4a', 
    '#6bbf9d', '#1f3d30', '#a8e6cf', '#45a787',
    '#3d9970', '#2c7d5a', '#5cb08d', '#4a8c6d',
    '#6cbf9c', '#5aab8a'
  ];

  // فرز البيانات حسب الترتيب المحدد
  useEffect(() => {
    const data = labels.map((label, index) => ({
      label,
      value: dataValues[index]
    }));

    const sortedData = [...data].sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

    setFilteredLabels(sortedData.map(item => item.label));
    setFilteredData(sortedData.map(item => item.value));
  }, [sortOrder, labels, dataValues]);

  // تصفية المدن
  const handleFilterChange = (value) => {
    if (value === 'all') {
      setFilteredLabels(labels);
      setFilteredData(dataValues);
      setShowAll(true);
    } else {
      const top10 = [...labels]
        .map((label, index) => ({ label, value: dataValues[index] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      
      setFilteredLabels(top10.map(item => item.label));
      setFilteredData(top10.map(item => item.value));
      setShowAll(false);
    }
  };

  const data = {
    labels: filteredLabels,
    datasets: [{
      label: 'عدد المستخدمين',
      data: filteredData,
      backgroundColor: backgroundColors,
      borderWidth: 0,
      borderRadius: 8,
      barThickness: 40,
    }],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
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
            return ` ${context.raw.toLocaleString('en-US')} مستخدم`;
          },
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString('en-US')} مستخدم`,
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: 'Dubai, Arial'
          }
        },
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'عدد المستخدمين',
          color: theme.palette.text.primary,
          font: {
            size: 14,
            weight: 'bold',
            family: 'Dubai, Arial'
          }
        }
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
            weight: 'bold',
            family: 'Dubai, Arial'
          },
          padding: 10,
          mirror: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
       width: 900,
        height, 
        p: 3, 
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            textAlign: 'right',
            fontFamily: 'Dubai, Arial'
          }}>
            {title}
          </Typography>
         
        </Grid>
        
        <Grid item>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, ml: 1 }}>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              IconComponent={FilterListIcon}
              sx={{
                fontFamily: 'Dubai, Arial',
                '& .MuiSelect-icon': {
                  right: 'auto',
                  left: -8
                },
                // إزالة الحدود والخلفية
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <MenuItem value="desc" sx={{ fontFamily: 'Dubai, Arial'}}>
                الأكثر استخداماً
              </MenuItem>
              <MenuItem value="asc" sx={{ fontFamily: 'Dubai, Arial' }}>
                الأقل استخداماً
              </MenuItem>
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, ml: 1 }}>
            <Select
              value={showAll ? 'all' : 'top10'}
              onChange={(e) => handleFilterChange(e.target.value)}
              IconComponent={FilterListIcon}
              sx={{
                fontFamily: 'Dubai, Arial',
                '& .MuiSelect-icon': {
                  right: 'auto',
                  left: -8
                },
                // إزالة الحدود والخلفية
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: 'Dubai, Arial' }}>
                جميع المدن
              </MenuItem>
              <MenuItem value="top10" sx={{ fontFamily: 'Dubai, Arial' }}>
                أهم 10 مدن
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box 
        ref={chartRef}
        sx={{ 
          flex: 1,
          position: 'relative',
          pr: 1,
          mb: 1,
          minHeight: '400px'
        }}
      >
        <Bar data={data} options={options} />
      </Box>
      
      <Box sx={{ 
        mt: 2,
        pt: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
        <Typography variant="caption" sx={{ 
          color: 'text.secondary',
          fontFamily: 'Dubai, Arial'
        }}>
          آخر تحديث: {new Date().toLocaleDateString('ar-EG')} | المصدر: قاعدة بيانات منصة توازن
        </Typography>
      </Box>
    </Paper>
  );
};

UsersByCityBarChart.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  dataValues: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default UsersByCityBarChart;
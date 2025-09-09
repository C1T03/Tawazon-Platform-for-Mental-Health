import React from 'react';
import CityBarChart from './CityBarChart';

const SyrianPopulationChart = ({ cityData }) => {
  // تحويل بيانات المدن الحقيقية
  const processCityData = () => {
    if (!cityData || cityData.length === 0) {
      return {
        labels: ['لا توجد بيانات'],
        populations: [0]
      };
    }
    
    const labels = cityData.map(item => item.city || 'غير محدد');
    const populations = cityData.map(item => item.count);
    
    return { labels, populations };
  };

  const { labels, populations } = processCityData();

  return (
    <CityBarChart 
      labels={labels}
      dataValues={populations}
    />
  );
};

export default SyrianPopulationChart;
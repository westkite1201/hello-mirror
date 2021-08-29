import React from 'react';
import WeatherChart from '../components/charts/WeatherChart';
import TestChats from '../components/charts/TestCharts';
const Test = () => {
  return (
    <>
      <div style={{ width: '100%', height: '400px' }}>
        <WeatherChart />
      </div>
      <div style={{ width: '100%', height: '400px' }}>
        <TestChats />
      </div>
    </>
  );
};

export default Test;

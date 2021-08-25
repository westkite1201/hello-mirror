import React, { useEffect, useState } from 'react';
import { getWeatherDataShortTermLive } from '../../store/weather/reducer';
import {
  Legend,
  Area,
  Bar,
  LabelList,
  Line,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import {
  getWeatherRequest,
  WeatherInfoData,
} from '../../store/weather/reducer';

// import corona_data from './corona.json';
// import useData from '../../hooks/useData';
//일별 확진자
//월별 확진자
//누적 합
//swr사용시 args가 많은 경우 무한루프에 봉착하는 경우로 redux 로 전환

const WeatherComposeChart = () => {
  const dispatch = useDispatch();
  const { weatherInfo, loading } = useSelector(
    (state: RootState) => state.weather,
  );
  const [weatherInfoItems, setWeatheInfoItmes] = useState<WeatherInfoData[]>();

  useEffect(() => {
    const nx = '55';
    const ny = '127';
    const isShortTeamYn = false;
    dispatch(getWeatherRequest({ nx, ny, isShortTeamYn }));
  }, []);

  // useEffect(() => {
  //   if (weatherInfo) {
  //     setWeatheInfoItmes(weatherInfo);
  //   }
  // }, [weatherInfo]);

  const formatXAxis = (tickItem: any) => {
    return tickItem;
  };

  const formatYAxis = (tickItem: any) => tickItem.toLocaleString();
  const formatTooltip = (tickItem: any) => tickItem.toLocaleString();

  console.log('weatherInfo = ', weatherInfo);
  return (
    <ResponsiveContainer>
      <ComposedChart
        width={500}
        height={400}
        data={weatherInfo}
        margin={{ top: 80, right: 40, bottom: 30 }}
      >
        <XAxis
          dataKey="baseDateTime"
          padding={{ left: 20, right: 10 }}
          tickFormatter={formatXAxis}
        />
        <YAxis yAxisId="left" />
        <Tooltip />
        <Legend />
        <Area
          yAxisId="left"
          name="습도"
          type="monotone"
          dataKey="humidityNow"
          fill="#8884d8"
          stroke="#8884d8"
          isAnimationActive={true}
          animationDuration={400}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperatureNow"
          stroke="#f59f00"
          strokeWidth="2"
          name="온도"
          isAnimationActive={true}
          animationDuration={400}
        />
        <Bar
          yAxisId="left"
          name="강수량"
          dataKey="rainNow"
          barSize={20}
          fill="#413ea0"
          isAnimationActive={true}
          animationDuration={400}
        />

        <Area
          yAxisId="left"
          name="강수확률"
          type="monotone"
          dataKey="precipitation"
          fill="#748ffc"
          stroke="#748ffc"
          isAnimationActive={true}
          animationDuration={400}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default WeatherComposeChart;

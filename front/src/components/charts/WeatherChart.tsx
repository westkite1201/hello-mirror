import React, { useEffect, useState } from 'react';
import { getWeatherDataShortTermLive } from '../../store/weather/reducer';
import {
  Legend,
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
type CoronaChartProps = {
  tabButtonKey: string;
};
const WeatherComposeChart: React.FC<CoronaChartProps> = ({ tabButtonKey }) => {
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

  useEffect(() => {
    if (weatherInfo) {
      setWeatheInfoItmes(weatherInfo);
    }
  }, [weatherInfo]);

  const formatXAxis = (tickItem: any) => {
    return tickItem;
  };

  const formatYAxis = (tickItem: any) => tickItem.toLocaleString();
  const formatTooltip = (tickItem: any) => tickItem.toLocaleString();

  return (
    <ResponsiveContainer>
      <ComposedChart
        data={usageStatus}
        margin={{ top: 80, right: 40, bottom: 30, left: 40 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="stateDt"
          padding={
            tabButtonKey === 'weekStatus'
              ? { left: 50, right: 10 }
              : { left: 20, right: 10 }
          }
          tickFormatter={formatXAxis}
        />
        <YAxis
          type="number"
          yAxisId="left"
          label={{ value: '확진자 수', offset: 30, angle: 0, position: 'top' }}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={formatTooltip}
          labelFormatter={formatXAxis}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="decideCnt"
          stroke="#fcac8d"
          strokeWidth="2"
          name="누적 확진자"
          isAnimationActive={true}
          animationDuration={400}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default WeatherComposeChart;

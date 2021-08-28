import React, { useEffect, useState } from 'react';
import {
  AreaChart,
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
  Customized,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/rootReducer';
import {
  getWeatherDataShortTermLive,
  getWeatherRequest,
  WeatherInfoData,
} from '../../store/weather/reducer';

const St = {
  WeatherIconWrapper: styled.div`
    text-align: center;
    .weather_icon {
      font-size: 8rem;
      //background: linear-gradient(to right, #dd5e89, #f7bb97); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .weather-info-name {
      margin-top: 10px;
      font-size: 1.5rem;
      font-style: bold;
    }
  `,
};

//swr사용시 args가 많은 경우 무한루프에 봉착하는 경우로 redux 로 전환

// type CustomTooltipProps = {
//   active?: any;
//   payload?: any;
//   label?: any;
// };
// const CustomTooltip: React.FC<CustomTooltipProps> = ({
//   active,
//   payload,
//   label,
// }) => {
//   if (active && payload && payload.length) {
//     console.log('payload ', payload);
//     return (
//       <St.CustomTooltip className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value}`}</p>
//         <p className="intro">{label}</p>
//         <p className="desc">Anything you want can be displayed here.</p>
//       </St.CustomTooltip>
//     );
//   }

//   return null;
// };

const WeatherComposeChart = () => {
  const dispatch = useDispatch();
  const { weatherInfo, loading } = useSelector(
    (state: RootState) => state.weather,
  );

  useEffect(() => {
    const nx = '55';
    const ny = '127';
    const isShortTeamYn = false;
    dispatch(getWeatherRequest({ nx, ny, isShortTeamYn }));
  }, []);

  const formatXAxis = (tickItem: any) => {
    return moment(tickItem).format('MM-DD HH시').toLocaleString();
  };

  const formatYAxis = (tickItem: any) => tickItem.toLocaleString();
  const formatTooltip = (tickItem: any) => {
    console.log('tickItem', tickItem);
    return tickItem.toLocaleString();
  };
  console.log('weatherInfo = ', weatherInfo);

  return (
    <ResponsiveContainer>
      <ComposedChart
        width={500}
        height={400}
        data={weatherInfo}
        margin={{ top: 80, right: 40, bottom: 30 }}
      >
        <defs>
          <linearGradient id="humidityNow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          // xAxisId="date"
          // type="category"
          dataKey="baseDateTime"
          tickFormatter={formatXAxis}
        />
        <YAxis yAxisId="left" type="number" />
        <YAxis
          yAxisId="right"
          type="number"
          domain={[0, 80]}
          orientation="right"
          stroke="#413ea0"
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 4' }}
          formatter={formatTooltip}
          // content={<CustomTooltip />}
        />
        <Legend />

        <Area
          yAxisId="left"
          name="습도"
          type="monotone"
          dataKey="humidityNow"
          fill="url(#humidityNow)"
          fillOpacity={1}
          isAnimationActive
          animationDuration={400}
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperatureNow"
          stroke="#f59f00"
          strokeWidth="2"
          name="온도"
          isAnimationActive
          animationDuration={400}
        />
        <Bar
          yAxisId="right"
          name="강수량"
          dataKey="rainNow"
          barSize={20}
          fill="#413ea0"
          isAnimationActive
          animationDuration={400}
        />

        <Line
          yAxisId="left"
          name="강수확률"
          type="monotone"
          dataKey="precipitation"
          stroke="#748ffc"
          strokeWidth="2"
          isAnimationActive
          animationDuration={400}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default WeatherComposeChart;

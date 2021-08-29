import React, { useEffect, useState, Component } from 'react';
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
  ReferenceDot,
} from 'recharts';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/rootReducer';
import { getWeatherRequest } from '../../store/weather/reducer';
import { ReturnIconMap } from '../../lib/iconMap';

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

// const weatherInfoTest = [
//   {
//     baseDate: '2012',
//     baseDateTime: '2021-08-28 21:00:00',
//     baseTime: 21,
//     humidityNow: 85,
//     precipitation: 0,
//     rainNow: 0,
//     temperatureNow: 23,
//     weatherClassName: 'wi wi-night-clear',
//   },
//   {
//     baseDate: '2013',
//     baseDateTime: '2021-08-28 24:00:00',
//     baseTime: 3,
//     humidityNow: 85,
//     precipitation: 0,
//     rainNow: 0,
//     temperatureNow: 23,
//     weatherClassName: 'wi wi-night-clear',
//   },

//   {
//     baseDate: '2014',
//     baseDateTime: '2021-08-29 03:00:00',
//     baseTime: 6,
//     humidityNow: 85,
//     precipitation: 0,
//     rainNow: 0,
//     temperatureNow: 23,
//     weatherClassName: 'wi wi-night-clear',
//   },
//   {
//     baseDate: '2015',
//     baseDateTime: '2021-08-29 06:00:00',
//     baseTime: 9,
//     humidityNow: 85,
//     precipitation: 0,
//     rainNow: 0,
//     temperatureNow: 23,
//     weatherClassName: 'wi wi-night-clear',
//   },
// ];

// const CustomizedLabel = props => {
//   const { x, y, stroke, value } = props;

//   return (
//     <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
//       {value}
//     </text>
//   );
// };
const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <>{ReturnIconMap({ iconClassname: payload.weatherClassName, cx, cy })}</>
  );
};
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
  // const formatTooltip = (tickItem: any) => {
  //   console.log('tickItem', tickItem);
  //   return tickItem.toLocaleString();
  // };
  console.log('weatherInfo = ', weatherInfo);
  function CustomReferenceDot() {
    return <ReferenceDot x={24} y={2000} />;
  }

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
        <Tooltip
          cursor={{ strokeDasharray: '3 4' }}
          //formatter={formatTooltip}
          // content={<CustomTooltip />}
        />
        <XAxis dataKey="baseDateTime" tickFormatter={formatXAxis} />
        <YAxis yAxisId="left" type="number" />
        <YAxis
          yAxisId="right"
          type="number"
          domain={[0, 80]}
          orientation="right"
          stroke="#413ea0"
        />
        <Legend />
        <Area
          yAxisId="left"
          name="습도"
          type="monotone"
          dataKey="humidityNow"
          fill="url(#humidityNow)"
          fillOpacity={1}
          isAnimationActive={false}
          animationDuration={400}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidityNow"
          stroke="#f59f00"
          strokeWidth="2"
          name="온도"
          isAnimationActive
          animationDuration={400}
          dot={<CustomizedDot />}
        />

        <Bar
          yAxisId="right"
          name="강수량"
          dataKey="rainNow"
          barSize={10}
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
        {/* <ReferenceLine
          x={'2021-08-29 03:00:00'}
          yAxisId="left"
          label={CustomLabel}
        />

        {/* <foreignObject x="230" y="10" width="600" height="160">
          <h1>Hello from HTML</h1>
        </foreignObject> */}

        <CustomReferenceDot />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default WeatherComposeChart;

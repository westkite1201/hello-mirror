import React, { useEffect, useState } from 'react';
import { getWeatherDataShortTermLive } from '../../store/weather/reducer';
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
import { RootState } from '../../store/rootReducer';
import styled from 'styled-components';
import {
  getWeatherRequest,
  WeatherInfoData,
} from '../../store/weather/reducer';
import { ReactComponent as Avatar1 } from '../../svg/images/weather-animated/cloudy-day-1.svg';

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

const weatherInfoTest = [
  {
    baseDate: '2012',
    baseDateTime: '2021-08-28 21:00:00',
    baseTime: 21,
    humidityNow: 85,
    precipitation: 0,
    rainNow: 0,
    temperatureNow: 23,
    weatherClassName: 'wi wi-night-clear',
  },
  {
    baseDate: '2013',
    baseDateTime: '2021-08-28 24:00:00',
    baseTime: 3,
    humidityNow: 85,
    precipitation: 0,
    rainNow: 0,
    temperatureNow: 23,
    weatherClassName: 'wi wi-night-clear',
  },

  {
    baseDate: '2014',
    baseDateTime: '2021-08-29 03:00:00',
    baseTime: 6,
    humidityNow: 85,
    precipitation: 0,
    rainNow: 0,
    temperatureNow: 23,
    weatherClassName: 'wi wi-night-clear',
  },
  {
    baseDate: '2015',
    baseDateTime: '2021-08-29 06:00:00',
    baseTime: 9,
    humidityNow: 85,
    precipitation: 0,
    rainNow: 0,
    temperatureNow: 23,
    weatherClassName: 'wi wi-night-clear',
  },
];
const CustomLabel = ({ props }: any) => {
  console.log('any = ', props);
  return (
    <foreignObject className="label-wrapper" x={'100'} y="0">
      {/* <div
        className="custom-label"
        style={{
          background: '#aaa',
          color: '#111',
          fontSize: '14px',
          width: '100px',
        }}
      >
        Label
      </div> */}
    </foreignObject>
  );
};

// const CustomizedLabel = props => {
//   const { x, y, stroke, value } = props;

//   return (
//     <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
//       {value}
//     </text>
//   );
// };
const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;
  console.log('props ', props);
  if (value > 2500) {
    return (
      <svg
        x={cx - 10}
        y={cy - 10}
        width={20}
        height={20}
        fill="red"
        viewBox="0 0 1024 1024"
      >
        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
      </svg>
    );
  }

  return (
    <>
      <svg
        x={cx - 10}
        y={cy - 40}
        width={20}
        height={20}
        fill="green"
        viewBox="0 0 1024 1024"
      >
        <Avatar1 x={cx - 10} y={cy - 40} width={20} height={20} />
      </svg>
    </>
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

  const DisplayWeatherIcons = () => {
    console.log('DisplayWeatherIconsz ', weatherInfo);
    weatherInfo.map(item => {
      return (
        <ReferenceLine
          yAxisId="left"
          x={item.baseDateTime}
          label={CustomLabel}
        />
      );
    });
  };
  function CustomReferenceDot() {
    return <ReferenceDot x={24} y={2000} />;
  }

  return (
    <ResponsiveContainer>
      <ComposedChart
        width={500}
        height={400}
        data={weatherInfoTest}
        // margin={{ top: 80, right: 40, bottom: 30 }}
      >
        <defs>
          <linearGradient id="humidityNow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
        //cursor={{ strokeDasharray: '3 4' }}
        //formatter={formatTooltip}
        // content={<CustomTooltip />}
        />
        <XAxis
          dataKey="baseTime"
          label="Devices"

          // tickFormatter={formatXAxis}
        />
        <YAxis yAxisId="left" type="number" />
        {/* <YAxis
          yAxisId="right"
          type="number"
          domain={[0, 80]}
          orientation="right"
          stroke="#413ea0"
        /> */}

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
          label={<CustomLabel />}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidityNow"
          stroke="#f59f00"
          strokeWidth="2"
          name="온도"
          isAnimationActive={true}
          animationDuration={400}
          dot={<CustomizedDot />}
        />
        {/*
        <Bar
          yAxisId="right"
          name="강수량"
          dataKey="rainNow"
          barSize={20}
          fill="#413ea0"
          isAnimationActive={true}
          animationDuration={400}
          label={<CustomLabel />}
        />
        <Line
          yAxisId="left"
          name="강수확률"
          type="monotone"
          dataKey="precipitation"
          stroke="#748ffc"
          strokeWidth="2"
          isAnimationActive={true}
          animationDuration={400}
        /> */}
        {/* <ReferenceLine
          x={'2021-08-29 03:00:00'}
          yAxisId="left"
          label={CustomLabel}
        />
        {DisplayWeatherIcons()} */}
        <foreignObject x="230" y="10" width="600" height="160">
          <h1>Hello from HTML</h1>
        </foreignObject>

        <CustomReferenceDot />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default WeatherComposeChart;

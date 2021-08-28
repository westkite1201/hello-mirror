import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import { RootState } from '../../store/rootReducer';
import {
  getWeatherRequest,
  WeatherInfoData,
} from '../../store/weather/reducer';
import WeatherItem from '../../components/weather/WeatherItem';
import 'weather-icons/css/weather-icons.css';

const START = 0;
const END = 5;
const WeatherInfoOverview = () => {
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

  return (
    <St.WeatherItensWrapper>
      {weatherInfoItems &&
        weatherInfoItems.slice(START, END).map((weatherItem, key) => {
          return <WeatherItem weatherItem={weatherItem} key={key} />;
        })}
    </St.WeatherItensWrapper>
  );
};

export default React.memo(WeatherInfoOverview);
// 스타일드-컴포넌트 정의
const St = {
  WeatherItensWrapper: styled.div`
    width: 100%;
    display: flex;
    color: #e9ecef;
  `,
};

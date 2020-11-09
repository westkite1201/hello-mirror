import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import {
  getWeatherRequest,
  WeatherShortInfoData,
  WeatherInfoData,
} from '../../store/weather/reducer';
import styled from 'styled-components';
import _ from 'lodash';
import WeatherItem from '../../components/weather/WeatherItem';
import 'weather-icons/css/weather-icons.css';
import './WeatherContainer.scss';
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
    <S_weatherItensWrapper>
      {weatherInfoItems &&
        weatherInfoItems.slice(START, END).map((weatherItem, key) => {
          console.log('weatherItme ', weatherItem);
          return <WeatherItem weatherItem={weatherItem.value} key={key} />;
        })}
    </S_weatherItensWrapper>
  );
};

export default WeatherInfoOverview;
// 스타일드-컴포넌트 정의
const S_weatherItensWrapper = styled.div`
  width: 100%;
  display: flex;
  color: #e9ecef;
`;

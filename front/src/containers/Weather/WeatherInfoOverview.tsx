import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { getWeatherRequest } from '../../store/weather/reducer';
import styled from 'styled-components';
import _ from 'lodash';
import 'weather-icons/css/weather-icons.css';
import './WeatherContainer.scss';
const WeatherInfoOverview = () => {
  const dispatch = useDispatch();
  const { weatherInfo, loading } = useSelector(
    (state: RootState) => state.weather,
  );
  const [weatherInfoItems, setWeatheInfoItmes] = useState();
  useEffect(() => {
    const nx = '55';
    const ny = '127';
    const isShortTeamYn = false;
    dispatch(getWeatherRequest({ nx, ny, isShortTeamYn }));
  }, []);

  useEffect(() => {
    if (weatherInfo) {
      console.log('weatherInfo', weatherInfo);
    }
  }, [weatherInfo]);
  return <div></div>;
};

export default WeatherInfoOverview;
// 스타일드-컴포넌트 정의
const S_weatherInfoWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  color: #e9ecef;
`;

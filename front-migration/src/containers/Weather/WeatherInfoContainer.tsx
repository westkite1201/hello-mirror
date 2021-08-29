import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/rootReducer';
import { getWeatherDataShortTermLive } from '../../store/weather/reducer';
import WeatherInfoLive from '../../components/weather/WeatherInfoLive';
import 'weather-icons/css/weather-icons.css';

const St = {
  WeatherInfoWrapper: styled.div`
    width: 100%;
    padding: 1rem;
    color: #e9ecef;
  `,
};
const WeatherInfoContainer = () => {
  const dispatch = useDispatch();
  const { shortWeatherInfo, isFetchingShort } = useSelector(
    (state: RootState) => state.weather,
  );

  useEffect(() => {
    const nx = '55';
    const ny = '127';
    const isShort = true;
    dispatch(getWeatherDataShortTermLive({ nx, ny, isShort }));
  }, [dispatch]);

  console.log('shortWeatherInfo');
  return (
    <St.WeatherInfoWrapper>
      <WeatherInfoLive
        shortWeatherInfo={shortWeatherInfo}
        isFetchingShort={isFetchingShort}
      />
    </St.WeatherInfoWrapper>
  );
};

export default React.memo(WeatherInfoContainer);

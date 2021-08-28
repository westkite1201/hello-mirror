import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { getWeatherDataShortTermLive } from '../../store/weather/reducer';
import WeatherInfoLive from '../../components/weather/WeatherInfoLive';
import styled from 'styled-components';
import 'weather-icons/css/weather-icons.css';

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
  }, []);

  console.log('shortWeatherInfo');
  return (
    <S_weatherInfoWrapper>
      <WeatherInfoLive
        shortWeatherInfo={shortWeatherInfo}
        isFetchingShort={isFetchingShort}
      />
    </S_weatherInfoWrapper>
  );
};

export default React.memo(WeatherInfoContainer);
// 스타일드-컴포넌트 정의
const S_weatherInfoWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  color: #e9ecef;
`;

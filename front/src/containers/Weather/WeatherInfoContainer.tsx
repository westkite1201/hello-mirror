import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { getWeatherShortTermLiveRequest } from '../../store/weather/reducer';
import { getWeatherDataShortTermLive } from '../../store/weather/sagas';
import 'weather-icons/css/weather-icons.css';
const WeatherInfoContainer = () => {
  const dispatch = useDispatch();
  const { weatherInfo } = useSelector((state: RootState) => state.count);

  useEffect(() => {
    const nx = '55';
    const ny = '127';
    const isShort = true;
    console.log(weatherInfo);
    dispatch(getWeatherDataShortTermLive({ nx, ny, isShort }));
  }, []);

  console.log('weatherInfo', weatherInfo);
  return (
    <div
      className="wi wi-day-lightning neon pink"
      style={{ fontSize: '3rem', margin: '5rem' }}
    >
      번개
    </div>
  );
};

export default WeatherInfoContainer;

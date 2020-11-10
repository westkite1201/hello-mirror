import React, { Fragment } from 'react';
import 'weather-icons/css/weather-icons.css';
import moment from 'moment';
import {
  WeatherShortInfoData,
  WeatherInfoData,
} from '../../store/weather/reducer';
import styled from 'styled-components';
interface WeatherItemProps {
  weatherItem?: WeatherInfoData;
}
const WeatherItem: React.FC<WeatherItemProps> = ({ weatherItem }) => {
  console.log('[seo] weatherItem', weatherItem);
  //   const override = `
  //   display: block;
  //   margin: 0 auto;
  //   border-color: red;
  // `;
  console.log('shortWeatherInfo');

  return (
    <div className="weather_wrapper" style={{ color: 'black' }}>
      {weatherItem && (
        <Fragment>
          <div className="location_info">
            {/*(LocationA, LocationB, LocationC)*/}
          </div>
          <div className="location-info-time">
            {moment(weatherItem.value.baseDate).format('YYYY월 MM월 DD일 ')}
            {weatherItem.value.baseTime}
          </div>
          <S_weatherInfoWrapper>
            <i className={weatherItem.value.weatherClassName}></i>
            <div className="weather-info-name">
              {weatherItem.value.weatherInfoName}
            </div>
            <S_weatherInfoContainer>
              <S_weatherInfoTemperture>
                {weatherItem.value.temperatureNow}
              </S_weatherInfoTemperture>
              <S_weatherInfopRain>
                {weatherItem.value.rainNow ? weatherItem.value.rainNow : 0}
              </S_weatherInfopRain>
              <S_weatherInfoTemHumidity>
                {weatherItem.value.humidityNow}
              </S_weatherInfoTemHumidity>
            </S_weatherInfoContainer>
          </S_weatherInfoWrapper>
        </Fragment>
      )}
    </div>
  );
};

export default WeatherItem;
const S_weatherInfoWrapper = styled.div``;
const S_weatherInfoContainer = styled.div``;
const S_weatherInfoTemperture = styled.div``;
const S_weatherInfopRain = styled.div``;
const S_weatherInfoTemHumidity = styled.div``;

import React, { Fragment } from 'react';
import 'weather-icons/css/weather-icons.css';
import moment from 'moment';
import {
  WeatherShortInfoData,
  WeatherInfoData,
} from '../../store/weather/reducer';

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
          <div className="weather_icon_wrapper">
            <i className={weatherItem.value.weatherClassName}></i>
            <div className="weather-info-name">
              {weatherItem.value.weatherInfoName}
            </div>
            <div className="weather-info-name">
              {weatherItem.value.temperatureNow}
            </div>
            <div className="weather-info-name">
              {weatherItem.value.rainNow ? weatherItem.value.rainNow : 0}
            </div>
            <div className="weather-info-name">
              {weatherItem.value.humidityNow}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default WeatherItem;

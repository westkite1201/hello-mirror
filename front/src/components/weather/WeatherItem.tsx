import React, { Fragment } from 'react';
import 'weather-icons/css/weather-icons.css';
import moment from 'moment';
import { WeatherShortInfoData } from '../../store/weather/reducer';

interface WeatherItemProps {
  weatherItem?: WeatherShortInfoData;
}
const WeatherItem: React.FC<WeatherItemProps> = ({ weatherItem }) => {
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
            {moment(weatherItem.baseDate).format('YYYY월 MM월 DD일 ')}
            {weatherItem.baseTime}
          </div>
          <div className="weather_icon_wrapper">
            <i className={weatherItem.weatherClassName}></i>
            <div className="weather-info-name">
              {weatherItem.weatherInfoName}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default WeatherItem;

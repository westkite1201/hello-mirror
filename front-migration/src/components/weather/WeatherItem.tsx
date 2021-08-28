import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {
  WeatherShortInfoData,
  WeatherInfoData,
} from '../../store/weather/reducer';

const St = {
  WeatherInfoWrapper: styled.div`
    text-align: center;
    border-radius: 4px;
    padding: 0.3rem;
    background-color: black;
    color: white;
  `,
  WeatherInfoContainer: styled.div`
    display: flex;
    justify-content: space-evenly;
  `,
  WeatherInfoWeatherRight: styled.div`
    font-size: 2rem;
    text-align: center;
  `,
  WeatherInfoWeatherLeft: styled.div`
    font-size: 1rem;
    text-align: left;
    margin: auto;
    div {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 0.8rem;
      }
    }
  `,
};

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
        <St.WeatherInfoWrapper>
          <div className="location-info-time">
            {moment(weatherItem.baseDate).format('YYYY월 MM월 DD일 ')}
            {weatherItem.baseTime}
          </div>
          <St.WeatherInfoContainer>
            <St.WeatherInfoWeatherRight>
              <i className={weatherItem.weatherClassName} />
              <div>{weatherItem.weatherInfoName}</div>
            </St.WeatherInfoWeatherRight>
            <St.WeatherInfoWeatherLeft>
              <div>
                <span>온도 : </span>
                <span>{weatherItem.temperatureNow} °C </span>
              </div>
              <div>
                <span>강수량 : </span>
                <span>{weatherItem.rainNow ? weatherItem.rainNow : 0} mm</span>
              </div>
              <div>
                <span>습도 : </span>
                <span> {weatherItem.humidityNow}% </span>
              </div>
            </St.WeatherInfoWeatherLeft>
          </St.WeatherInfoContainer>
        </St.WeatherInfoWrapper>
      )}
    </div>
  );
};

export default React.memo(WeatherItem);

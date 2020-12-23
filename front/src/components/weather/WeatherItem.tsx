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
        <S_weatherInfoWrapper>
          <div className="location-info-time">
            {moment(weatherItem.value.baseDate).format('YYYY월 MM월 DD일 ')}
            {weatherItem.value.baseTime}
          </div>
          <S_weatherInfoContainer>
            <S_weatherInfoWeatherRight>
              <i className={weatherItem.value.weatherClassName}></i>
              <div>{weatherItem.value.weatherInfoName}</div>
            </S_weatherInfoWeatherRight>
            <S_weatherInfoWeatherLeft>
              <div>
                <span>온도 : </span>
                <span>{weatherItem.value.temperatureNow} °C </span>
              </div>
              <div>
                <span>강수량 : </span>
                <span>
                  {weatherItem.value.rainNow ? weatherItem.value.rainNow : 0} mm
                </span>
              </div>
              <div>
                <span>습도 : </span>
                <span> {weatherItem.value.humidityNow}% </span>
              </div>
            </S_weatherInfoWeatherLeft>
          </S_weatherInfoContainer>
        </S_weatherInfoWrapper>
      )}
    </div>
  );
};

export default React.memo(WeatherItem);
const S_weatherInfoWrapper = styled.div`
  text-align: center;
  border-radius: 4px;
  padding: 0.3rem;
  background-color: black;
  color: white;
`;
const S_weatherInfoContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const S_weatherInfoWeatherRight = styled.div`
  font-size: 2rem;
  text-align: center;
`;
const S_weatherInfoWeatherLeft = styled.div`
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
`;

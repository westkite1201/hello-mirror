import React, { Fragment } from 'react';
import 'weather-icons/css/weather-icons.css';
import OpacityIcon from '@material-ui/icons/Opacity';
import moment from 'moment';
import ScaleLoader from 'react-spinners/ScaleLoader';
import Progress from '../common/Progress';
import { WeatherShortInfoData } from '../../store/weather/reducer';
import './WeatherInfoLive.scss';

interface WeatherInfoLiveProps {
  shortWeatherInfo?: WeatherShortInfoData;
  isFetchingShort?: boolean;
}
const WeatherInfoLive: React.FC<WeatherInfoLiveProps> = ({
  shortWeatherInfo,
  isFetchingShort,
}) => {
  const override = `
  display: block;
  margin: 0 auto;
  border-color: red;
`;
  console.log('shortWeatherInfo ', shortWeatherInfo);
  return (
    <div className="weather_wrapper" style={{ color: 'white' }}>
      {isFetchingShort ? (
        <ScaleLoader css={override} color="#b197fc" loading={isFetchingShort} />
      ) : (
        shortWeatherInfo && (
          <>
            <div className="location_info">
              {/*(LocationA, LocationB, LocationC)*/}
            </div>
            <div className="location-info-time">
              {moment(shortWeatherInfo.baseDate).format('YYYY월 MM월 DD일 ')}
              {shortWeatherInfo.baseTime}
            </div>
            <div className="weather_icon_wrapper">
              <i className={shortWeatherInfo.weatherClassName} />
              <div className="weather-info-name">
                {shortWeatherInfo.weatherInfoName}
              </div>
            </div>

            <div className="temperture" style={{ color: 'white' }}>
              {shortWeatherInfo.temperatureNow}
              <i className="wi wi-celsius" />
            </div>
            <hr />
            <div className="weather_info">
              <div className="rain">
                <span style={{ marginRight: '10px' }}>
                  <i className="wi wi-umbrella rain_icon" />
                </span>
                {shortWeatherInfo.rainNow}mm
                <Progress
                  backgroundColor="#1864ab"
                  fcstValue={shortWeatherInfo.rainNow}
                  value={shortWeatherInfo.rainNow}
                  height={10}
                />
              </div>
              <div className="humidity">
                <span style={{ marginRight: '15px' }}>
                  <OpacityIcon style={{ fontSize: '2rem', color: '#748ffc' }} />
                  {/*<i className = "wi wi-humidity humidity_icon"></i>*/}
                </span>
                {shortWeatherInfo.humidityNow} %
                <Progress
                  backgroundColor="#748ffc"
                  fcstValue={shortWeatherInfo.humidityNow}
                  value={shortWeatherInfo.humidityNow}
                  height={10}
                />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default WeatherInfoLive;

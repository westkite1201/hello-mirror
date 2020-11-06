import React, { Fragment } from 'react';
import 'weather-icons/css/weather-icons.css';
import Progress from '../../components/common/Progress';
import OpacityIcon from '@material-ui/icons/Opacity';
import moment from 'moment';
import ScaleLoader from 'react-spinners/ScaleLoader';
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
  console.log('shortWeatherInfo');
  return (
    <div className="weather_wrapper" style={{ color: 'black' }}>
      {isFetchingShort ? (
        <ScaleLoader
          css={override}
          //sizeUnit={'%'}
          //size={20}
          color={'#b197fc'}
          loading={isFetchingShort}
        />
      ) : (
        shortWeatherInfo && (
          <Fragment>
            <div className="location_info">
              {/*(LocationA, LocationB, LocationC)*/}
            </div>
            <div className="location-info-time">
              {moment(shortWeatherInfo.baseDate).format('YYYY월 MM월 DD일 ')}
              {shortWeatherInfo.baseTime}
            </div>
            <div className="weather_icon_wrapper">
              <i className={shortWeatherInfo.weatherClassName}></i>
              <div className="weather-info-name">
                {shortWeatherInfo.weatherInfoName}
              </div>
            </div>

            <div className="temperture" style={{ color: 'black' }}>
              {shortWeatherInfo.temperatureNow}
              <i className="wi wi-celsius"></i>
            </div>
            <hr></hr>
            <div className="weather_info">
              <div className="rain">
                <span style={{ marginRight: '10px' }}>
                  <i className="wi wi-umbrella rain_icon"></i>
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
                  <OpacityIcon style={{ fontSize: '50px' }} />
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
          </Fragment>
        )
      )}
    </div>
  );
};

export default WeatherInfoLive;

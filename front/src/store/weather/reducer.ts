import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import {
  WeatherItem,
  WeatherShortItem,
  WeatherRequestPayloadType,
} from '../../lib/api/weather';
import { getWeatherClassName } from '../../lib/helpers';
import _ from 'lodash';

export type WeatherShortInfoData = {
  baseDate: string;
  baseTime: string;
  temperatureNow: string;
  rainNow: string;
  humidityNow: string;
  weatherClassName: string;
  weatherInfoName: string;
};

export type WeatherInfoData = {
  dateTime: string;
  value: WeatherItem[];
};

type CurrentDisplayState = {
  clicks: number;
  weatherInfo: WeatherInfoData[];
  shortWeatherInfo?: WeatherShortInfoData;
  isFetchingShort: boolean;
  loading: boolean;
};

const initialState: CurrentDisplayState = {
  clicks: 0,
  weatherInfo: [],
  shortWeatherInfo: undefined,
  isFetchingShort: false,
  loading: false,
};

// createAction으로 액션 생성 함수를 만들 수 있다.
const GET_WEATHER_DATA_SHORT_TERM_LIVE =
  'WEATHER/GET_WEATEHR_DATA_SHORT_TERM_LIVE';
export const getWeatherDataShortTermLive = createAction(
  GET_WEATHER_DATA_SHORT_TERM_LIVE,
  param => {
    return { payload: param };
  },
);

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    addCount(state, action: PayloadAction<number>) {
      state.clicks += action.payload;
    },
    minusCount(state, action: PayloadAction<number>) {
      state.clicks -= action.payload;
    },

    getWeatherRequest(
      state,
      { payload }: PayloadAction<WeatherRequestPayloadType>,
    ) {
      state.loading = true;
    },
    getWeatherSuccess(state, { payload }: PayloadAction<WeatherItem[]>) {
      const temp = payload.map(item => {
        return {
          ...item,
          fcstDate_fcstTime: item.fcstDate + '_' + item.fcstTime,
        };
      });
      const weatherInfo = _.chain(temp)
        .groupBy('fcstDate_fcstTime')
        .map((item, key) => ({ dateTime: key, value: item }))
        .value();
      state.loading = false;
      state.weatherInfo = weatherInfo;
    },
    getWeatherShortTerm(state, action: PayloadAction<WeatherItem[]>) {
      //state.weatherInfo = action.payload;
    },
    getWeatherShortTermLive(state, { payload }: PayloadAction<number>) {
      state.loading = true;
    },
    getWeatherShortTermLiveRequest(state) {
      state.isFetchingShort = true;
    },
    getWeatherShortTermLiveSuccess(
      state,
      { payload }: PayloadAction<WeatherShortItem[]>,
    ) {
      let sky; //날씨
      let pty; //강수형태
      let temperatureNow;
      let humidityNow;
      let rainNow;
      let baseDate;
      let baseTime;
      let dayTimeYn;
      const weatherInfo = payload;
      console.log('weatjerImfo', weatherInfo);
      weatherInfo.map(item => {
        console.log('item', item.category);
        if (item.category === 'SKY') {
          sky = parseInt(item.obsrValue);
        }
        if (item.category === 'PTY') {
          pty = parseInt(item.obsrValue);
        }
        if (item.category === 'T1H') {
          temperatureNow = parseInt(item.obsrValue);
        }
        if (item.category === 'RN1') {
          rainNow = item.obsrValue;
        }
        if (item.category === 'REH') {
          humidityNow = parseInt(item.obsrValue);
        }
        baseDate = item.baseDate;
        baseTime = item.baseTime;
      });
      const skyInfoStr = String(sky) + String(pty);
      const weatherInfoData = getWeatherClassName(skyInfoStr, dayTimeYn);
      const shortWeatherInfoTemp = {
        baseDate: baseDate,
        baseTime: baseTime,
        weatherClassName: weatherInfoData.weatherClassName,
        weatherInfoName: weatherInfoData.weatherInfoName,
        temperatureNow: temperatureNow,
        rainNow: rainNow,
        humidityNow: humidityNow,
      };
      state.shortWeatherInfo = shortWeatherInfoTemp;
      state.isFetchingShort = false;
    },
  },
});

export const {
  addCount,
  minusCount,
  getWeatherRequest,
  getWeatherSuccess,
  getWeatherShortTerm,
  getWeatherShortTermLive,
  getWeatherShortTermLiveRequest,
  getWeatherShortTermLiveSuccess,
} = countSlice.actions;

export default countSlice.reducer;

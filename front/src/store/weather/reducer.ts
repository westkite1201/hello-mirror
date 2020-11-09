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
  value: WeatherShortInfoData;
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
      function processingItem(weatherDateTime, weatherInfos) {
        let sky; //날씨
        let pty; //강수형태
        let temperatureNow;
        let humidityNow;
        let rainNow;
        // POP	강수확률	%
        // PTY	강수형태	코드값
        // R06	6시간 강수량	범주 (1 mm)
        // REH	습도	%
        // S06	6시간 신적설	범주(1 cm)
        // SKY	하늘상태	코드값
        // T3H	3시간 기온	℃
        // TMN	아침 최저기온	℃
        // TMX	낮 최고기온	℃
        // UUU	풍속(동서성분)	m/s
        // VVV	풍속(남북성분)	m/s
        // WAV	파고	M
        // VEC	풍향	m/s
        // WSD	풍속	m/s

        let dayTimeYn;
        weatherInfos.map(item => {
          console.log('[seo] item ', item);
          if (item.category === 'SKY') {
            sky = parseInt(item.fcstValue);
          }
          if (item.category === 'PTY') {
            pty = parseInt(item.fcstValue);
          }
          if (item.category === 'T3H') {
            temperatureNow = parseInt(item.fcstValue);
          }
          if (item.category === 'R06') {
            rainNow = item.fcstValue;
          }
          if (item.category === 'REH') {
            humidityNow = parseInt(item.fcstValue);
          }
        });

        const dateTime = weatherDateTime.split('_');
        const baseDate = dateTime[0];
        const baseTime = dateTime[1];
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
        return shortWeatherInfoTemp;
      }
      const weatherInfo = _.chain(temp)
        .groupBy('fcstDate_fcstTime')
        .map((item, key) => ({
          dateTime: key,
          value: processingItem(key, item),
        }))
        .value();
      console.log('[seo][weatherInfo] ', weatherInfo);
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

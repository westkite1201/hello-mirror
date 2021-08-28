import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from 'moment';
import {
  WeatherItem,
  WeatherShortItem,
  WeatherRequestPayloadType,
  Ranks,
  RealtimeTermsPayload,
  Terms,
  NewsEnterRanks,
} from '../../lib/api/weather';
import { getWeatherClassName } from '../../lib/helpers';

export type WeatherShortInfoData = {
  baseDate: string;
  baseTime: string;
  temperatureNow: any;
  rainNow: any;
  humidityNow: any;
  weatherClassName: any;
  weatherInfoName: any;
};

export type WeatherInfoData = {
  baseDateTime: string;
  baseDate: string;
  baseTime: string;
  weatherClassName: string;
  weatherInfoName: string;
  temperatureNow: number;
  rainNow: number;
  humidityNow: number;
};

type CurrentDisplayState = {
  clicks: number;
  weatherInfo: WeatherInfoData[];
  shortWeatherInfo?: WeatherShortInfoData;
  isFetchingShort: boolean;
  loading: boolean;

  realtimeTerms: Ranks;
  realtimeTermsNext: Ranks;
  realtimeLoading: boolean;

  newsTopicTerms: Ranks;
  newsTopicTermsNext: Ranks;
  enterTopicTerms: Ranks;
  enterTopicTermsNext: Ranks;

  newsEnterTopicLoading: boolean;
};

const initialState: CurrentDisplayState = {
  clicks: 0,
  weatherInfo: [],
  shortWeatherInfo: undefined,
  isFetchingShort: false,
  loading: false,
  realtimeTerms: { ts: '', sm: '', data: [], message: '' },
  realtimeTermsNext: { ts: '', sm: '', data: [], message: '' },
  realtimeLoading: false,

  newsTopicTerms: { ts: '', sm: '', data: [], message: '' },
  newsTopicTermsNext: { ts: '', sm: '', data: [], message: '' },
  newsEnterTopicLoading: false,

  enterTopicTerms: { ts: '', sm: '', data: [], message: '' },
  enterTopicTermsNext: { ts: '', sm: '', data: [], message: '' },
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
function shuffleArray(a: Terms[]) {
  let j;
  let x;
  let i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  a = a.map((item, index) => {
    return {
      ...item,
      rank: index + 1,
    };
  });
  return a;
}
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
      console.log('payload ', payload);
      const temp = payload.map(item => {
        return {
          ...item,
          fcstDate_fcstTime: `${item.fcstDate}_${item.fcstTime}`,
        };
      });
      console.log('temp ', temp);
      function processingItem(weatherDateTime: any, weatherInfos: any) {
        let sky = 0; //날씨x
        let pty = 0; //강수형태
        let temperatureNow = 0;
        let humidityNow = 0;
        let rainNow = 0;
        let precipitation = 0;
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

        const dayTimeYn = false;
        weatherInfos.map((item: any) => {
          //console.log('[seo] item ', item);
          if (item.category === 'SKY') {
            sky = parseInt(item.fcstValue, 10);
          }
          if (item.category === 'PTY') {
            pty = parseInt(item.fcstValue, 10);
          }
          if (item.category === 'T3H') {
            temperatureNow = parseInt(item.fcstValue, 10);
          }
          if (item.category === 'R06') {
            rainNow = parseInt(item.fcstValue, 10);
          }
          if (item.category === 'REH') {
            humidityNow = parseInt(item.fcstValue, 10);
          }
          if (item.category === 'POP') {
            precipitation = parseInt(item.fcstValue, 10);
          }
        });

        //"2015-06-17 14:24:36"
        const dateTime = weatherDateTime.split('_');
        const baseDate = dateTime[0];
        const baseTime = dateTime[1];

        const skyInfoStr = String(sky) + String(pty);
        const weatherInfoData = getWeatherClassName(skyInfoStr, dayTimeYn);
        //202108260300
        const WeatherInfoTemp = {
          baseDateTime: `${moment(baseDate).format(
            'YYYY-MM-DD',
          )} ${baseTime.substring(0, 2)}:00:00`,
          baseDate,
          baseTime,
          weatherClassName: weatherInfoData.weatherClassName,
          weatherInfoName: weatherInfoData.weatherInfoName,
          temperatureNow,
          rainNow,
          humidityNow,
          precipitation,
        };
        return WeatherInfoTemp;
      }
      const weatherInfo = _.chain(temp)
        .groupBy('fcstDate_fcstTime')
        .map((item, key) => ({
          ...processingItem(key, item),
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
      let sky = 0; //날씨
      let pty = 0; //강수형태
      let temperatureNow = 0;
      let humidityNow = 0;
      let rainNow = 0;
      let baseDate = '';
      let baseTime = '';
      const dayTimeYn = false;
      const weatherInfo = payload;
      console.log('weatjerImfo', weatherInfo);

      weatherInfo.map(item => {
        console.log('item', item.category);
        if (item.category === 'SKY') {
          sky = parseInt(item.fcstValue, 10);
        }
        if (item.category === 'PTY') {
          pty = parseInt(item.fcstValue, 10);
        }
        if (item.category === 'T1H') {
          temperatureNow = parseInt(item.fcstValue, 10);
        }
        if (item.category === 'RN1') {
          rainNow = parseInt(item.fcstValue, 10);
        }
        if (item.category === 'REH') {
          humidityNow = parseInt(item.fcstValue, 10);
        }
        baseDate = item.baseDate;
        baseTime = item.baseTime;
      });
      const skyInfoStr = String(sky) + String(pty);
      const weatherInfoData = getWeatherClassName(skyInfoStr, dayTimeYn);
      const shortWeatherInfoTemp = {
        baseDate,
        baseTime,
        weatherClassName: weatherInfoData.weatherClassName,
        weatherInfoName: weatherInfoData.weatherInfoName,
        temperatureNow,
        rainNow,
        humidityNow,
      };
      state.shortWeatherInfo = shortWeatherInfoTemp;
      state.isFetchingShort = false;
    },
    getRealtimeTermsRequest(
      state,
      { payload }: PayloadAction<RealtimeTermsPayload>,
    ) {
      state.realtimeLoading = true;
    },

    getRealtimeTermsSuccess(state, { payload }: PayloadAction<Ranks>) {
      //첫번째 인경우
      if (
        state.realtimeTerms.data.length === 0 &&
        state.realtimeTermsNext.data.length === 0
      ) {
        console.log('[seo] reducer firstSetting ');
        state.realtimeTerms = payload;
        state.realtimeTermsNext = payload;
      }
      //setting 이 되어있으면
      else if (state.realtimeTermsNext.data.length !== 0) {
        console.log('[seo] reducer isSetting ');
        state.realtimeTerms = state.realtimeTermsNext;
        //test 용
        //payload.data = shuffleArray(payload.data);
        state.realtimeTermsNext = payload;
      }

      state.realtimeLoading = false;
    },
    getRealtimeTermsFailure(
      state,
      { payload }: PayloadAction<RealtimeTermsPayload>,
    ) {
      state.realtimeLoading = false;
    },

    getNewsEnterTopicRequest(
      state,
      { payload }: PayloadAction<RealtimeTermsPayload>,
    ) {
      state.newsEnterTopicLoading = true;
    },
    getNewsEnterTopicSuccess(
      state,
      { payload }: PayloadAction<NewsEnterRanks>,
    ) {
      //첫번째 인경우
      //newTopic
      if (
        state.newsTopicTerms.data.length === 0 &&
        state.newsTopicTermsNext.data.length === 0
      ) {
        state.newsTopicTerms.sm = payload.sm;
        state.newsTopicTerms.ts = payload.ts;
        state.newsTopicTerms.data = payload.newsTopic;
        state.newsTopicTerms.message = payload.message;
        /*set Next */
        state.newsTopicTermsNext.sm = payload.sm;
        state.newsTopicTermsNext.ts = payload.ts;
        state.newsTopicTermsNext.data = payload.newsTopic;
        state.newsTopicTermsNext.message = payload.message;
      }
      //setting 이 되어있으면
      else if (state.newsTopicTermsNext.data.length !== 0) {
        state.newsTopicTerms = state.newsTopicTermsNext;
        //test 용
        //payload.data = shuffleArray(payload.data);
        /*set Next */
        state.newsTopicTermsNext.sm = payload.sm;
        state.newsTopicTermsNext.ts = payload.ts;
        state.newsTopicTermsNext.data = payload.newsTopic;
        state.newsTopicTermsNext.message = payload.message;
      }
      //enterTopic
      if (
        state.enterTopicTerms.data.length === 0 &&
        state.enterTopicTermsNext.data.length === 0
      ) {
        state.enterTopicTerms.sm = payload.sm;
        state.enterTopicTerms.ts = payload.ts;
        state.enterTopicTerms.data = payload.enterTopic;
        state.enterTopicTerms.message = payload.message;
        /*set Next */
        state.enterTopicTermsNext.sm = payload.sm;
        state.enterTopicTermsNext.ts = payload.ts;
        state.enterTopicTermsNext.data = payload.enterTopic;
        state.enterTopicTermsNext.message = payload.message;
      }
      //setting 이 되어있으면
      else if (state.enterTopicTermsNext.data.length !== 0) {
        state.enterTopicTerms = state.enterTopicTermsNext;
        //test 용
        //payload.data = shuffleArray(payload.data);
        state.enterTopicTermsNext.sm = payload.sm;
        state.enterTopicTermsNext.ts = payload.ts;
        state.enterTopicTermsNext.data = payload.enterTopic;
        state.enterTopicTermsNext.message = payload.message;
      }
      state.newsEnterTopicLoading = false;
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
  getRealtimeTermsRequest,
  getRealtimeTermsSuccess,
  getRealtimeTermsFailure,
  getNewsEnterTopicRequest,
  getNewsEnterTopicSuccess,
} = countSlice.actions;

export default countSlice.reducer;

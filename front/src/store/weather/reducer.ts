import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { WeatherItem } from '../../lib/api/weather';

type CurrentDisplayState = {
  clicks: number;
  weatherInfo: WeatherItem[];
  shortWeatherInfo: WeatherItem[];
  loading: boolean;
};

const initialState: CurrentDisplayState = {
  clicks: 0,
  weatherInfo: [],
  shortWeatherInfo: [],
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
    getWeatherShortTerm(state, action: PayloadAction<WeatherItem[]>) {
      state.weatherInfo = action.payload;
    },
    getWeatherShortTermLive(state, { payload }: PayloadAction<number>) {
      state.loading = true;
    },
    getWeatherRequest(state) {
      state.loading = true;
    },
    getWeatherSuccess(state, { payload }: PayloadAction<WeatherItem[]>) {
      state.weatherInfo = payload;
      state.loading = false;
    },
    getWeatherShortTermLiveRequest(state) {
      state.loading = true;
    },
    getWeatherShortTermLiveSuccess(
      state,
      { payload }: PayloadAction<WeatherItem[]>,
    ) {
      state.shortWeatherInfo = payload;
      state.loading = false;
    },
  },
});

export const {
  addCount,
  minusCount,
  getWeatherShortTerm,
  getWeatherShortTermLive,
  getWeatherShortTermLiveRequest,
  getWeatherShortTermLiveSuccess,
} = countSlice.actions;

export default countSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherItem } from '../../lib/api/weather';

type CurrentDisplayState = {
  clicks: number;
  weatherInfo: WeatherItem[];
  loading: boolean;
};

const initialState: CurrentDisplayState = {
  clicks: 0,
  weatherInfo: [],
  loading: false,
};

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
    getWeatherShortTermLiveRequest(state) {
      state.loading = true;
    },
    getWeatherShortTermLiveSuccess(
      state,
      { payload }: PayloadAction<WeatherItem[]>,
    ) {
      state.weatherInfo = payload;
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

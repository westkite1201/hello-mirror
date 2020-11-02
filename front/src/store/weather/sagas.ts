import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
import { addCount, getWeatherShortTermLiveSuccess } from './reducer';
import { getWeatherDataPrivateMode, WeatherRes } from '../../lib/api/weather';
import { createAction, createReducer } from '@reduxjs/toolkit';
type payloadA = {
  nx: string;
  ny: string;
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

export function* incrementAsync() {
  yield delay(1000);
  yield put(addCount(1));
}

function* getWeatherShortTerm(action) {
  try {
    const weatherRes: WeatherRes = yield call(
      getWeatherDataPrivateMode,
      action.payload,
    );
    console.log('weatherRes ', weatherRes);
    yield put(getWeatherShortTermLiveSuccess(weatherRes.items));
  } catch (e) {
    console.log('error');
    // yield put({
    //   type: updateQuotesAsync.failure,
    //   payload: { message: e.message }
    // });
  }
}

export function* weatherSaga() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
  yield takeEvery(getWeatherDataShortTermLive, getWeatherShortTerm);
}

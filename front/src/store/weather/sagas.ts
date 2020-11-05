import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
import {
  addCount,
  getWeatherShortTermLiveSuccess,
  getWeatherDataShortTermLive,
} from './reducer';
import {
  getWeatherDataPrivateMode,
  getWeatherDataShortTermLivePrivateMode,
  WeatherRes,
  WeatherItem,
} from '../../lib/api/weather';
type payloadA = {
  nx: string;
  ny: string;
};

export function* incrementAsync() {
  yield delay(1000);
  yield put(addCount(1));
}
function* getWeather(action) {
  try {
    const weatherRes: WeatherItem[] = yield call(
      getWeatherDataPrivateMode,
      action.payload,
    );
    console.log('weatherRes ', weatherRes);
    yield put(getWeatherShortTermLiveSuccess(weatherRes));
  } catch (e) {
    console.log('error', e);
    // yield put({
    //   type: updateQuotesAsync.failure,
    //   payload: { message: e.message }
    // });
  }
}
function* getWeatherShortTerm(action) {
  try {
    const weatherRes: WeatherItem[] = yield call(
      getWeatherDataShortTermLivePrivateMode,
      action.payload,
    );
    console.log('weatherRes', weatherRes);
    yield put(getWeatherShortTermLiveSuccess(weatherRes));
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
  //yield takeEvery(getWeatherDataShortTermLive, getWeatherShortTerm);
}

import {
  all,
  call,
  delay,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  addCount,
  getWeatherRequest,
  getWeatherSuccess,
  getWeatherShortTermLiveSuccess,
  getWeatherDataShortTermLive,
  getRealtimeTermsRequest,
  getRealtimeTermsSuccess,
  getNewsEnterTopicRequest,
  getNewsEnterTopicSuccess,
} from './reducer';
import {
  getWeatherDataPrivateMode,
  getWeatherDataShortTermLivePrivateMode,
  WeatherRes,
  WeatherShortItem,
  WeatherItem,
  getRealtimeTerms,
  RealtimeTermsRes,
  getNewsEnterTerms,
  NewsEnterTermsRes,
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
    yield put(getWeatherSuccess(weatherRes));
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
    const weatherRes: WeatherShortItem[] = yield call(
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
function* getRealtimeTermsToApi(action) {
  try {
    const termsRes: RealtimeTermsRes = yield call(
      getRealtimeTerms,
      action.payload,
    );
    console.log('termsRes', termsRes);

    yield put(getRealtimeTermsSuccess(termsRes.ranks));
  } catch (e) {
    console.log('error');
  }
}

function* getNewsEnterTermsToApi(action) {
  try {
    const termsRes: NewsEnterTermsRes = yield call(getNewsEnterTerms);
    console.log('termsRes', termsRes);

    yield put(getNewsEnterTopicSuccess(termsRes.ranks));
  } catch (e) {
    console.log('error');
  }
}

export function* weatherSaga() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
  yield takeLatest(getWeatherDataShortTermLive, getWeatherShortTerm);
  yield takeLatest(getWeatherRequest, getWeather);
  yield takeLatest(getRealtimeTermsRequest, getRealtimeTermsToApi);
  yield takeLatest(getNewsEnterTopicRequest, getNewsEnterTermsToApi);
}

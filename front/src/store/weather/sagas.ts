import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
import { addCount } from './reducer';

export function* incrementAsync() {
  yield delay(1000);
  yield put(addCount(1));
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export function* getWeatherDataPrivateMode() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export function* getWeatherDataShortTerm() {
  yield takeEvery('', incrementAsync);
}

export function* weatherSaga() {
  yield all([call(watchIncrementAsync)]);
}

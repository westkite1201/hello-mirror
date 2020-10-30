import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import clicksReducer from './weather/reducer';
import { weatherSaga } from './weather/sagas';
const clicks = { count: clicksReducer };

export let rootReducer = combineReducers({
  ...clicks,
});

export default function createReducer(injectedReducers = {}) {
  rootReducer = combineReducers({
    ...clicks,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([weatherSaga()]);
}

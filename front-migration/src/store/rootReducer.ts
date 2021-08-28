import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import weatherReducer from './weather/reducer';
import editReducer from './edit/reducer';
import { weatherSaga } from './weather'; //test
const reducers = { weather: weatherReducer, edit: editReducer };

export let rootReducer = combineReducers({
  ...reducers,
});

export default function createReducer(injectedReducers = {}) {
  rootReducer = combineReducers({
    ...reducers,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  //test
  yield all([weatherSaga()]);
}

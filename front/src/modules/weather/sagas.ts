import {
  UPDATE_QUOTES_SUCCESS,
  UPDATE_QUOTES_REQUEST,
  updateQuotesAsync,
  GET_QUOTES_REQUEST,
  GET_QUOTES_SUCCESS,
  getQuotesAsync,
} from './reducer';
//import createAsyncSaga from '../../lib/utils/createAsyncSaga';
// import {
//   QuoteResData,
//   updateQuote,
//   getQuotes,
// } from '../../lib/api/quotes_saga';
import { put, call, takeEvery } from 'redux-saga/effects';

//const updatqQuotesSaga = createAsyncSaga(updateQuotesAsync, updateQuote);
// function* updateQuotesSaga(
//   action: ReturnType<typeof updateQuotesAsync.request>,
// ) {
//   try {
//     const quotesRes: QuoteResData = yield call(updateQuote, action.payload);
//     console.log('quotesRes ', quotesRes);
//     yield put({
//       type: UPDATE_QUOTES_SUCCESS,
//       payload: {
//         quotes_array: quotesRes.quotes_array,
//         totalCount: quotesRes.total_count,
//       },
//     });
//   } catch (e) {
//     yield put({
//       type: updateQuotesAsync.failure,
//       payload: { message: e.message },
//     });
//   }
// }

// function* getQuotesSaga(action: ReturnType<typeof getQuotesAsync.request>) {
//   try {
//     const quotesRes: QuoteResData = yield call(getQuotes, action.payload);
//     console.log('quotesRes ', quotesRes);
//     yield put({
//       type: GET_QUOTES_SUCCESS,
//       payload: {
//         quotes_array: quotesRes.quotes_array,
//         totalCount: quotesRes.total_count,
//       },
//     });
//   } catch (e) {
//     yield put({
//       type: updateQuotesAsync.failure,
//       payload: { message: e.message },
//     });
//   }
// }

export function* weatherSaga() {
  // yield takeEvery(UPDATE_QUOTES_REQUEST, updateQuotesSaga);
  // yield takeEvery(GET_QUOTES_REQUEST, getQuotesSaga);
}

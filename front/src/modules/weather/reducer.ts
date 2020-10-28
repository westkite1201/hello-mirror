import { QuoteResData, Quote } from '../../lib/api/weather';
import { AsyncState, asyncState } from '../../lib/utils/reducerUtils';
import { createReducer, createAsyncAction, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { produce } from 'immer';
export const UPDATE_QUOTES_REQUEST = 'QUOTES/UPDATE_QUOTES_REQUEST';
export const UPDATE_QUOTES_SUCCESS = 'QUOTES/UPDATE_QUOTES_SUCCESS';
export const UPDATE_QUOTES_FAILURE = 'QUOTES/UPDATE_QUOTES_FAILURE';

export const GET_QUOTES_REQUEST = 'QUOTES/GET_QUOTES_REQUEST';
export const GET_QUOTES_SUCCESS = 'QUOTES/GET_QUOTES_SUCCESS';
export const GET_QUOTES_FAILURE = 'QUOTES/GET_QUOTES_FAILURE';

export const updateQuotesAsync = createAsyncAction(
  UPDATE_QUOTES_REQUEST,
  UPDATE_QUOTES_SUCCESS,
  UPDATE_QUOTES_FAILURE,
)<Quote, QuoteResData, AxiosError>();

export const getQuotesAsync = createAsyncAction(
  GET_QUOTES_REQUEST,
  GET_QUOTES_SUCCESS,
  GET_QUOTES_FAILURE,
)<Quote, QuoteResData, AxiosError>();

const actions = { updateQuotesAsync, getQuotesAsync };

export type QuotesAction = ActionType<typeof actions>;

export type QuotesgState = {
  quotesData_: {
    loading: boolean;
    data: Quote[] | null;
    error: any | null;
    // totalCount: number;
    // isLast:boolean;
  };
};

const initialState: QuotesgState = {
  quotesData_: {
    loading: false,
    data: [],
    error: false,
    // totalCount: 0,
    // isLast:false
  },
};

const reducer = createReducer<QuotesgState, QuotesAction>(initialState, {
  [UPDATE_QUOTES_REQUEST]: state => ({
    ...state,
    quotesData_: asyncState.load([]),
  }),
  // [UPDATE_QUOTES_SUCCESS]: (state, action) => ({
  //   ...state,
  //   quotesData_: asyncState.success(action.payload.quotes_array)
  // }),
  //draft 사용
  [UPDATE_QUOTES_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.quotesData_.loading = false;
      draft.quotesData_.data = action.payload.quotes_array;
      //draft.quotesData_.totalCount = action.payload.total_count;
      draft.quotesData_.error = false;
    }),
  [GET_QUOTES_SUCCESS]: (state, action) =>
    produce(state, draft => {
      draft.quotesData_.loading = false;
      draft.quotesData_.data = action.payload.quotes_array;
      //draft.quotesData_.totalCount = action.payload.total_count;
      draft.quotesData_.error = false;
    }),

  // [UPDATE_QUOTES_FAILURE]: (state, action) => ({
  //   ...state,
  //   ...state.quotesData.error = action.payload
  // })
});

export default reducer;

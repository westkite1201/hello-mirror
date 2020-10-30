import { AsyncActionCreatorBuilder, getType } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

export type AsyncState<T, M, E = any> = {
  data: T | null;
  loading: boolean;
  error: E | null;
  lastPage?: number;
};

export const asyncState = {
  initial: <T, E = any>(initialData?: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData || null,
    error: null,
  }),
  load: <T, E = any>(data?: T): AsyncState<T, E> => ({
    loading: true,
    data: data || null,
    error: null,
  }),
  success: <T, E = any>(data: T, meta?: AxiosResponse): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null,
    lastPage: parseInt(meta?.headers['last-page'], 10),
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    data: null,
    error: error,
  }),
};

type AnyAsyncActionCreator = AsyncActionCreatorBuilder<
  [string, [any | undefined, undefined]],
  [string, [any, AxiosResponse]],
  [string, [AxiosError, undefined]]
>;

export function transformToArray<AC extends AnyAsyncActionCreator>(
  asyncActionCreator: AC,
) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}

export function createAsyncReducer<
  S,
  AC extends AnyAsyncActionCreator,
  K extends keyof S
>(asyncActionCreator: AC, key: K) {
  const [request, success, failure] = transformToArray(asyncActionCreator).map(
    getType,
  );
  return {
    [request]: (state: S) => ({
      ...state,
      [key]: asyncState.load(),
    }),
    [success]: (
      state: S,
      action: ReturnType<typeof asyncActionCreator.success>,
    ) => ({
      ...state,
      [key]: asyncState.success(action.payload, action.meta),
    }),
    [failure]: (
      state: S,
      action: ReturnType<typeof asyncActionCreator.failure>,
    ) => ({
      ...state,
      [key]: asyncState.error(action.payload),
    }),
  };
}

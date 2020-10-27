import {
  createReducer,
  createAsyncAction as asyncActionCreator,
  ActionType,
} from 'typesafe-actions';

/*
  AsyncAction은 비동기 상황에 대해 감시를 진행할 수 있도록 
  각각의 고유한 유니크 이름을 부여할 수 있게 모아둔 타입입니다.
  Redux의 reducer는 고유한 이름으로 
  현재 액션에 대한 타입을 감지하기 때문에 유니크한 이름이 필요합니다.
*/
export type AsyncAction = {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
};

/*
  createActionEntity는 createAsyncAction으로 만든 
  액션 이름을 가져와서 REQUEST, SUCCESS, FAILURE 액션에 대해 실제로 제작합니다.
*/
export const createActionEntity = <R, S, F>(asyncAction: AsyncAction) =>
  asyncActionCreator(
    asyncAction.REQUEST,
    asyncAction.SUCCESS,
    asyncAction.FAILURE,
  )<R, S, F>();

/*
  createAsyncAction은 비동기 액션 이름을 제작합니다. 
  위에서 언급한 AsyncAction에 알맞는 값을 넣어줍니다. 
  액션에 알맞는 이름을 받아 
  해당 액션 이름과 뒷 이름에는 REQUEST, SUCCESS, FAILURE와 같은 prefix를 붙여집니다. 
  이렇게 만들어진 고유의 이름은 액션을 제작하는데 쓰입니다.
*/

export const createAsyncAction = (actionName: string): AsyncAction => {
  const asyncTypeAction: string[] = ['_REQUEST', '_SUCCESS', '_FAILURE'];

  return {
    REQUEST: actionName + asyncTypeAction[0],
    SUCCESS: actionName + asyncTypeAction[1],
    FAILURE: actionName + asyncTypeAction[2],
  };
};
/*
  createCustomReducer는 Reducer를 쉽게 만들어주는 함수입니다. 
  이 함수를 사용하게 되면 state와 action에 대해서 타입을 생성하지 않아도 됩니다.
*/
export function createCustomReducer<S, A extends { [key: string]: any }>(
  state: S,
  action: A,
) {
  type Actions = ActionType<typeof action>;
  type States = typeof state;

  return createReducer<States, Actions>(state);
}

//
export type AsyncState<T, E = any> = {
  data: T | null;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  // 다음 코드는 화살표 함수에 Generic 을 설정 한 것입니다.
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
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null,
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    loading: false,
    data: null,
    error: error,
  }),
};

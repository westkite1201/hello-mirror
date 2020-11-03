import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { searchComponentByName } from '../../lib/helpers';
import _ from 'lodash';

export type RGLItem = {
  i: string;
  x: number;
  y: number; // puts it at the bottom
  w: number;
  h: number;
  item: any;
  TagName: any;
};

export type ComponentItem = {
  component: any;
  name: string;
  category: string;
  pageView: string; // puts it at the bottom
};

type CurrentDisplayState = {
  layout: RGLItem[];
  componentList: ComponentItem[];
  isEdit: boolean;
  isSidebarOpen: boolean;
};

const initialState: CurrentDisplayState = {
  layout: [],
  componentList: [],
  isEdit: true,
  isSidebarOpen: true,
};

// createAction으로 액션 생성 함수를 만들 수 있다.
const REMOVE_ITEM = 'EDIT/REMOVE_ITEM';
const CREATE_ITEM = 'EDIT/CREATE_ITEM';
const SET_COMPONENT_LIST = 'EDIT/SET_COMPONENT_LIST';

const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    initLayout(state) {
      state.layout = [0, 1, 2, 3, 4].map((i, key, list) => {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          item: null,
          TagName: null,
        };
      });
    },
    addComponent(state, action: PayloadAction<string>) {
      const tag = searchComponentByName(state.componentList, action.payload);
      const timeStamp = new Date().getTime();
      const data = {
        i: 'n' + timeStamp,
        x: (state.layout.length * 2) % (18 || 12),
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 2,
        item: tag,
        TagName: action.payload,
      };
      state.layout.push(data);
    },

    setComponentList(state, action: PayloadAction<ComponentItem[]>) {
      state.componentList = action.payload;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.layout = state.layout.filter(item => {
        return item.i !== action.payload;
      });
    },
    editHandle(state) {
      state.isEdit = !state.isEdit;
    },
  },
});

export const {
  initLayout,
  addComponent,
  setComponentList,
  removeItem,
  editHandle,
} = editSlice.actions;

export default editSlice.reducer;

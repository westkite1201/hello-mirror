import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import {
  searchComponentByName,
  handleDispatchEventResize,
} from '../../lib/helpers';
import _ from 'lodash';
let layoutTemporaryStorage;
export type RGLItem = {
  i: string;
  x: number;
  y: number; // puts it at the bottom
  w: number;
  h: number;
  item: any;
  name: any;
};

export type ComponentItem = {
  component: any;
  name: string;
  category: string;
  pageView: string; // puts it at the bottom
};

type CurrentDisplayState = {
  layout: RGLItem[];
  layoutTemp: string;
  componentList: ComponentItem[];
  isEdit: boolean;
  isSidebarOpen: boolean;
};

const initialState: CurrentDisplayState = {
  layout: [],
  layoutTemp: '',
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
          name: null,
        };
      });
    },
    addComponent(state, { payload }: PayloadAction<string>) {
      const tag = searchComponentByName(state.componentList, payload);
      const timeStamp = new Date().getTime();
      const data = {
        i: 'n' + timeStamp,
        x: (state.layout.length * 2) % (18 || 12),
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 2,
        item: tag,
        name: payload,
      };

      console.log('[seo][reducer] addComponent ', payload, data);
      state.layout.push(Object.assign({}, data));
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
    onLayoutChange(state, action: PayloadAction<RGLItem[]>) {
      const layout = action.payload;

      const layoutTemp = layout.map((item, i) => {
        return {
          ...item,
          item: layout[i].item,
          name: layout[i].name,
        };
      });
      const layoutTemporaryStorage = JSON.stringify({ ['layout']: layoutTemp });
      state.layoutTemp = layoutTemporaryStorage;
      console.log('[seo] layoutTemp', layoutTemporaryStorage);
      //localStorage.setItem('layout', layoutTemporaryStorage);
    },
    saveLayout(state) {
      localStorage.setItem('layout', state.layoutTemp);
      //localStorageMode
    },

    getLoadPage(state) {
      const layout = localStorage.getItem('layout');
      console.log('[seo] layout ', layout);
      if (layout) {
        state.layout = JSON.parse(layout).layout;
      } else {
        state.layout = [];
      }
    },
  },
});

export const {
  initLayout,
  addComponent,
  setComponentList,
  removeItem,
  editHandle,
  onLayoutChange,
  saveLayout,
  getLoadPage,
} = editSlice.actions;

export default editSlice.reducer;

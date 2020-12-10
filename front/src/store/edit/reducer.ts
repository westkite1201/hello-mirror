import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchComponentByName } from '../../lib/helpers';
import _ from 'lodash';
import { toast } from 'react-toastify';
export type RGLItem = {
  i: string;
  x: number;
  y: number; // puts it at the bottom
  w: number;
  h: number;
  item: any;
  name: any;
  static: boolean;
};

export type ComponentItem = {
  component: any;
  name: string;
  category: string;
  pageView: string; // puts it at the bottom
};

type ChangeStaticPayloadType = {
  checked: boolean;
  id: string;
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

// // createAction으로 액션 생성 함수를 만들 수 있다.
// const REMOVE_ITEM = 'EDIT/REMOVE_ITEM';
// const CREATE_ITEM = 'EDIT/CREATE_ITEM';
// const SET_COMPONENT_LIST = 'EDIT/SET_COMPONENT_LIST';

const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    changeStatic(state, { payload }: PayloadAction<ChangeStaticPayloadType>) {
      const id = payload.id;
      const checked = payload.checked;
      const layoutTemp = state.layout.map(item => {
        if (item.i === id) {
          item.static = checked;
        }
        return item;
      });
      state.layout = layoutTemp;
    },
    initLayout(state) {
      state.layout = [0, 1, 2, 3, 4].map(i => {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          item: null,
          name: null,
          static: false,
        };
      });
    },
    addComponent(state, { payload }: PayloadAction<string>) {
      const tag = searchComponentByName(state.componentList, payload);
      const timeStamp = new Date().getTime();
      const data = {
        i: 'n' + timeStamp,
        x: (state.layout.length * 2) % (18 || 12),
        y: 1,
        w: 6,
        h: 4,
        item: tag,
        name: payload,
        static: false,
      };

      const layoutTemp = state.layout.slice();
      layoutTemp.push(data);

      state.layout = layoutTemp.slice();
      // console.log('[seo][reducer] addComponent payload ', payload);
      // console.log('[seo][reducer] addComponent data ', data);
      // //state.layout.push(());
      // state.layout.push(Object.assign({}, data));
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
      const childs = document.getElementsByClassName('react-resizable-handle');
      if (childs && childs.length !== 0) {
        Array.from(childs).forEach((element: any) => {
          element.style.display = !state.isEdit ? 'initial' : 'none';
        });
      }
      state.isEdit = !state.isEdit;
    },
    onLayoutChange(state, action: PayloadAction<RGLItem[]>) {
      const layoutLocal = action.payload;
      state.layout = layoutLocal.map((item, i) => {
        console.log('[seo] layout item ', item);
        return {
          ...item,
          item: state.layout[i].item,
          name: state.layout[i].name,
        };
      });
      const layoutTemp = layoutLocal.map((item, i) => {
        console.log('[seo] layout item ', item);
        return {
          ...item,
          item: state.layout[i].item,
          name: state.layout[i].name,
        };
      });
      console.log('[seo] onLayoutChange  layoutTemp', layoutTemp);
      const layoutTemporaryStorage = JSON.stringify({ ['layout']: layoutTemp });
      state.layoutTemp = layoutTemporaryStorage;

      console.log(
        '[seo] onLayoutChange  layoutTemporaryStorage',
        layoutTemporaryStorage,
      );
      //localStorage.setItem('layout', layoutTemporaryStorage);
    },
    saveLayout(state) {
      console.log('[seo]saveLayout layout ', state.layout);
      console.log('[seo]saveLayout layoutTemp', state.layoutTemp);
      localStorage.setItem('layout', state.layoutTemp);
      toast.success('😋 현재 layout을 저장했어요! ✔');
      //localStorageMode
    },

    getLoadPage(state) {
      const layout = localStorage.getItem('layout');
      console.log('[seo] getLoadPage layout ', layout);
      if (layout) {
        console.log('[seo]-----------------');
        state.layout = JSON.parse(layout).layout;
        toast.success('✨불러오기 성공✨');
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
  changeStatic,
} = editSlice.actions;

export default editSlice.reducer;

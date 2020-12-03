import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { Responsive } from 'react-grid-layout';
import EditComponentList from './EditComponentList';
import classnames from 'classnames';
import _ from 'lodash';
import CSS from 'csstype';
import { RootState } from '../../store/rootReducer';
import {
  searchComponentByName,
  handleDispatchEventResize,
} from '../../lib/helpers';
import {
  removeItem,
  onLayoutChange,
  getLoadPage,
  RGLItem,
} from '../../store/edit/reducer';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(ReactGridLayout);

//const ResponsiveReactGridLayout = WidthProvider(Responsive);
const EditView = () => {
  const dispatch = useDispatch();
  const { layout, componentList, isEdit } = useSelector(
    (state: RootState) => state.edit,
  );

  React.useEffect(() => {
    dispatch(getLoadPage());
  }, []);
  console.log('[seo] edit view layout', layout);
  const onRemoveItem = (i: string) => {
    dispatch(removeItem(i));
  };
  const createElement = (el, key) => {
    console.log('[sep] createElement el', el);
    const removeStyle: CSS.Properties = {
      color: 'white',
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer',
      zIndex: 99,
    };
    const Tag = el.TagName
      ? 'div'
      : searchComponentByName(componentList, el.name);
    //let Tag = 'div
    console.log('TAG', Tag);
    return (
      <div className={classnames({ dragHandle: isEdit })} key={el.i}>
        <div className="componentContainer" id={el.i}>
          <Tag data={el.i} wrapperid={el.i} isEdit={isEdit} />
        </div>
        {isEdit === true ? (
          <span
            className="remove"
            style={removeStyle}
            onClick={() => onRemoveItem(el.i)}
          >
            x
          </span>
        ) : (
          <span></span>
        )}
      </div>
    );
  };
  const handleLayoutChange = layout => {
    dispatch(onLayoutChange(layout));
  };
  const handleResizeChildComponent = (allChild, target) => {
    console.log('[seo] onResize ', allChild, target);
    if (target && target.i) {
      const id = target.i;
      const rect = document.getElementById(id)?.getBoundingClientRect();
      //const rect = document.getElementById('id').getBoundingClientRect();
      const targetDiv = document.getElementById(id + '_c');
      if (targetDiv) {
        targetDiv.style.width = String(rect && rect.width);
        targetDiv.style.height = String(rect && rect.height);
      }
    }
  };

  return (
    <div className="dropLayout" style={{ width: '100%' }}>
      <ResponsiveReactGridLayout
        layout={layout}
        className="layout"
        cols={36}
        //cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={1}
        onResize={handleResizeChildComponent}
        measureBeforeMount={true}
        //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        draggableHandle=".dragHandle"
        verticalCompact={false}
        onLayoutChange={handleLayoutChange}
      >
        {layout.map((el, index) => createElement(el, index))}
      </ResponsiveReactGridLayout>
      <EditComponentList />
    </div>
  );
};
export default EditView;

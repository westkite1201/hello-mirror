import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import EditComponentList from './EditComponentList';
import classnames from 'classnames';
import _ from 'lodash';
import CSS from 'csstype';
import { RootState } from '../../store/rootReducer';
import {
  searchComponentByName,
  handleDispatchEventResize,
} from '../../lib/helpers';
import { removeItem, onLayoutChange } from '../../store/edit/reducer';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const EditView = () => {
  const dispatch = useDispatch();
  const { layout, componentList, isEdit } = useSelector(
    (state: RootState) => state.edit,
  );

  console.log('layout', layout);
  const onRemoveItem = (i: string) => {
    dispatch(removeItem(i));
  };
  const createElement = (el, key) => {
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
  // const handleResizeChildComponent = (allChild, target) => {
  //   console.log('[seo] onResize ', allChild, target);
  //   // let rect = document.getElementById(target.i).getBoundingClientRect();
  //   // let targetDiv = document.getElementById(target.i + '_c');
  //   // if (!helpers.isEmpty(targetDiv)) {
  //   //   targetDiv.style.width = rect.width;
  //   //   targetDiv.style.height = rect.height;
  //   // }
  // };

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={1}
        //onResize={handleResizeChildComponent}
        //measureBeforeMount={true}
        //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        //   cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
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

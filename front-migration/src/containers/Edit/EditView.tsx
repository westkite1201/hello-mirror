import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { Responsive } from 'react-grid-layout';
import classnames from 'classnames';
import CSS from 'csstype';
import { Switch } from 'antd';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import { RootState } from '../../store/rootReducer';
import { searchComponentByName } from '../../lib/helpers';
import './EditView.scss';
import {
  removeItem,
  onLayoutChange,
  getLoadPage,
  changeStatic,
} from '../../store/edit/reducer';
import EditComponentList from './EditComponentList';

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

  console.log('layout', layout);
  const onRemoveItem = (i: string) => {
    dispatch(removeItem(i));
  };
  const handleStatic = (checked: boolean, id: string) => {
    console.log('[seo] checked', checked, id);
    dispatch(changeStatic({ checked, id }));
  };
  const createElement = (el: any, key: number) => {
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
          {isEdit && (
            <>
              <Switch
                checked={el.static}
                onChange={checked => handleStatic(checked, el.i)}
                checkedChildren="고정"
                unCheckedChildren="이동"
              />
            </>
          )}
        </div>
        {isEdit === true ? (
          <span
            className="remove"
            style={removeStyle}
            onClick={() => onRemoveItem(el.i)}
            aria-hidden
          >
            x
          </span>
        ) : (
          <span />
        )}
      </div>
    );
  };
  const handleLayoutChange = (layout: any) => {
    console.log('handle');
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
    <div className="dropLayout" style={{ width: '100%' }}>
      <ResponsiveReactGridLayout
        layout={layout}
        className="layout"
        cols={36}
        //cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={1}
        //onResize={handleResizeChildComponent}
        //measureBeforeMount={true}
        //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        //   cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle=".dragHandle"
        margin={[25, 25]}
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

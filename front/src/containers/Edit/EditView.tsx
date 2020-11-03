import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactGridLayout, { Responsive, WidthProvider } from 'react-grid-layout';
import EditComponentList from './EditComponentList';
import classnames from 'classnames';
import _ from 'lodash';
import CSS from 'csstype';
import { RootState } from '../../store/rootReducer';
import { searchComponentByName } from '../../lib/helpers';
const ResponsiveWidth = WidthProvider(ReactGridLayout);
const EditView = () => {
  const dispatch = useDispatch();
  const { layout, componentList, isEdit } = useSelector(
    (state: RootState) => state.edit,
  );

  const onRemoveItem = i => {
    //dispatch();
  };
  const createElement = (el, key) => {
    const removeStyle: CSS.Properties = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer',
      zIndex: 99,
    };
    const Tag = el.TagName
      ? 'div'
      : searchComponentByName(componentList, el.TagName);
    //let Tag = 'div
    return (
      <div className={classnames({ dragHandle: isEdit })} key={el.i}>
        <div className={'componentContainer'} id={el.i}>
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

  return (
    <div>
      <ResponsiveWidth
        measureBeforeMount={true}
        //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        //   cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        verticalCompact={false}
      >
        {layout.map((el, index) => createElement(el, index))}
      </ResponsiveWidth>
      <EditComponentList />
    </div>
  );
};
export default EditView;

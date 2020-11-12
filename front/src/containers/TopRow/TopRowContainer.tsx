import React, { useState } from 'react';
import './TopRowContainer.scss';
import { Switch, Button } from 'antd';
import { useSpring, animated } from 'react-spring';
import * as easings from 'd3-ease';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
type ITopRowContainerProps = {
  handleEdit: () => void;
  saveLayout: () => void;
};

const TopRowContainer: React.FC<ITopRowContainerProps> = ({
  handleEdit,
  saveLayout,
}) => {
  const [isGrow, setIsGrow] = useState(false);
  const { isEdit } = useSelector((state: RootState) => state.edit);

  function handleMouseOver() {
    console.log('handleMouseOver');
    setIsGrow(true);
  }
  function handleMouseLeave() {
    setIsGrow(false);
  }
  function switchView(pageName) {
    //alert('switchView');
    // edit.setPageName(pageName);
    // edit.loadPage();
  }
  const topRowStyle = useSpring({
    config: { duration: 700, easing: easings.easeExpOut },
    transform: isGrow ? 'translate3d(0, 0, 0) ' : 'translate3d(0, -100%, 0)',
    opacity: isGrow ? 1 : 0,
    //backGroundColor: isGrow ? 'white' : '',
  });
  function onChange(checked) {
    handleEdit();
    console.log(`switch to ${checked}`);
  }
  const topRowClassName = isEdit ? 'top-row-hide' : 'top-row';
  //console.log('[seo] topRowClassName', topRowClassName);
  return (
    <React.Fragment>
      <div
        className="top-row-handler"
        onMouseOver={handleMouseOver}
        style={{ display: isGrow ? 'none' : '' }}
      ></div>
      <animated.div
        style={topRowStyle}
        className={topRowClassName}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <div className="edit-component">
          <Switch defaultChecked onChange={onChange} />
          {isEdit && <Button onClick={saveLayout}>컴포넌트 저장</Button>}
        </div>
        <div className="tob-row-tab-button"></div>
      </animated.div>
    </React.Fragment>
  );
};

export default TopRowContainer;

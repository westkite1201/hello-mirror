import React, { useState } from 'react';
import './TopRowContainer.scss';
import { Switch, Button } from 'antd';
import { useSpring, animated } from 'react-spring';
import * as easings from 'd3-ease';
import { useSelector } from 'react-redux';
import _ from 'lodash';
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

  const debouncedMouseOver = _.debounce(() => {
    handleMouseOver();
  }, 200);
  const debouncedMouseLeave = _.debounce(() => {
    handleMouseLeave();
  }, 200);

  function handleMouseOver() {
    //console.log('[seo] handleMouseOver');
    if (!isGrow) {
      setIsGrow(true);
    }
  }
  function handleMouseLeave() {
    //console.log('[seo] handleMouseLeave');
    if (isGrow) {
      setIsGrow(false);
    }
  }

  const topRowStyle = useSpring({
    config: { duration: 700, easing: easings.easeExpOut },
    transform: isGrow ? 'translate3d(0, 0, 0) ' : 'translate3d(0, -100%, 0)',
    opacity: isGrow ? 1 : 0,
    background: isEdit ? 'white' : 'black',
  });
  function onChange(checked: any) {
    handleEdit();
    console.log(`switch to ${checked}`);
  }
  const topRowClassName = isEdit ? 'top-row-hide' : 'top-row';
  //console.log('[seo] topRowClassName', topRowClassName);
  return (
    <>
      <div
        className="top-row-handler"
        onMouseOver={debouncedMouseOver}
        onFocus={debouncedMouseOver}
        style={{ display: isGrow ? 'none' : '' }}
      />
      <animated.div
        style={topRowStyle}
        className={topRowClassName}
        onMouseOver={debouncedMouseOver}
        onMouseLeave={debouncedMouseLeave}
      >
        <div className="edit-component">
          <Switch defaultChecked onChange={onChange} />
          {isEdit && <Button onClick={saveLayout}>컴포넌트 저장</Button>}
        </div>
        <div className="tob-row-tab-button" />
      </animated.div>
    </>
  );
};

export default TopRowContainer;

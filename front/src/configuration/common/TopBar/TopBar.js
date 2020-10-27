import React, { useState } from 'react';
import './TopBar.scss';
import { useSpring, animated } from 'react-spring';
import * as easings from 'd3-ease';
const TopBar = () => {
  const [isGrow, setIsGrow] = useState(false);

  function handleMouseOver() {
    console.log('handleMouseOver');
    setIsGrow(true);
  }
  function handleMouseLeave() {
    setIsGrow(false);
  }

  const topRowStyle = useSpring({
    config: { duration: 700, easing: easings.easeExpOut },
    transform: isGrow ? 'translate3d(0, 0, 0) ' : 'translate3d(0, -100%, 0)',
    opacity: isGrow ? 1 : 0
    //backGroundColor: isGrow ? 'white' : '',
  });

  let topRowClassName = isGrow ? 'top-row' : 'top-row-hide';
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
        <div className="tob-row-tab-button">
          <div>명언</div>
        </div>
      </animated.div>
    </React.Fragment>
  );
};

export default TopBar;

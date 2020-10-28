import React, { useState, useEffect } from 'react';
import moment from 'moment';
function ClockContainer() {
  let timer: any = null;
  const [time, setTime] = useState(moment());
  useEffect(() => {
    timer = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div className="neon pink"> {time.format('YYYY-MM-DD')}</div>
      <div className="neon blue"> {time.format('HH-mm-ss')}</div>
    </div>
  );
}

export default ClockContainer;

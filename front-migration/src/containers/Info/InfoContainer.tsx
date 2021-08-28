import React from 'react';
import Info from '../../components/Info/Info';
const InfoContainer = () => {
  const value = 'Awesome.';
  //오늘 멋지십니다.
  return (
    <div>
      <Info infoString={value} />
    </div>
  );
};

export default InfoContainer;

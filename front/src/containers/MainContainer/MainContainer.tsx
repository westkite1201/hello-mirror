import React, { useState, useEffect } from 'react';
import ClockContainer from '../Clock/ClockContainer';
import Info from '../../components/Info/Info';
import WeatherInfoContainer from '../Weather/WeatherInfoContainer';
function MainContainer() {
  //   useEffect(() => {
  //     const getPosition = options => {
  //       return new Promise((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject, options);
  //       });
  //     };
  //     const nowGeolocation = async () => {
  //       if (navigator.geolocation) {
  //         // GPS를 지원하면
  //         try {
  //           const position = await getPosition();
  //           const notLng = position.coords.longitude;
  //           const notLat = position.coords.latitude;
  //         } catch (e) {
  //           console.log('error ', e);
  //         }
  //       } else {
  //         alert('GPS를 지원하지 않습니다');
  //       }
  //     };
  //     //현재 위치 확인
  //     nowGeolocation();
  //   }, [dispatch]);

  return (
    <div>
      <ClockContainer />
      <Info infoString={'오늘 정말 멋지십니다'} />
      <WeatherInfoContainer />
    </div>
  );
}

export default MainContainer;

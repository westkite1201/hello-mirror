import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
//import GridWrapper from '../../components/common/GridWrapper';
import EditView from '../Edit/EditView';
import WeatherInfoContainer from '../Weather/WeatherInfoContainer';
import WeatherInfoOverview from '../Weather/WeatherInfoOverview';
export interface ICoordinates {
  latitude: number;
  longitude: number;
}
function MainContainer() {
  //const { riverTempData } = useSelector(state => state.count);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPosition: () => Promise<ICoordinates> = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve(position.coords);
          },
          err => {
            reject(err);
          },
        );
      });
    };
    const nowGeolocation = async () => {
      if (navigator.geolocation) {
        // GPS를 지원하면
        try {
          const coords = await getPosition();
          console.log('coords ', coords);
          const notLng = coords.longitude;
          const notLat = coords.latitude;
          //dispatch({});
        } catch (e) {
          console.log('error ', e);
        }
      } else {
        alert('GPS를 지원하지 않습니다');
      }
    };
    //현재 위치 확인
    nowGeolocation();
  }, []);

  return (
    <div>
      {/*<App />*/}
      {/*
      <ClockContainer />
      <Info infoString={'오늘 정말 멋지십니다'} />
      <WeatherInfoContainer />
      */}
      {<WeatherInfoOverview />}
      <EditView />
    </div>
  );
}

export default MainContainer;

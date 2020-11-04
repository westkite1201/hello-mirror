import React, { useEffect } from 'react';
import ClockContainer from '../Clock/ClockContainer';
import Info from '../Info/InfoContainer';
import WeatherInfoContainer from '../Weather/WeatherInfoContainer';
import { setComponentList } from '../../store/edit/reducer';
import { useDispatch } from 'react-redux';
const EditComponentList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const componentList = [
      {
        component: ClockContainer,
        name: 'clock',
        category: 'weather',
        pageView: 'seoPage',
      },
      {
        component: Info,
        name: 'info',
        category: 'weather',
        pageView: 'seoPage',
      },
      {
        component: WeatherInfoContainer,
        name: 'weatherInfo',
        category: 'weather',
        pageView: 'seoPage',
      },
    ];
    dispatch(setComponentList(componentList));
  }, []);

  return <React.Fragment />;
};
export default EditComponentList;

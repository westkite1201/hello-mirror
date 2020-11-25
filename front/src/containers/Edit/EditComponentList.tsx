import React, { useEffect } from 'react';
import ClockContainer from '../Clock/ClockContainer';
import Info from '../Info/InfoContainer';
import WeatherInfoContainer from '../Weather/WeatherInfoContainer';
import WeatherInfoOverview from '../Weather/WeatherInfoOverview';
import DndContainer from '../DndContainer/DndContainer';
import { setComponentList } from '../../store/edit/reducer';
import { useDispatch } from 'react-redux';

const EditComponentList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const componentList = [
      {
        component: DndContainer,
        name: 'DndContainer',
        category: 'weather',
        pageView: 'seoPage',
      },
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
      {
        component: WeatherInfoOverview,
        name: 'WeatherInfoOverview',
        category: 'weather',
        pageView: 'seoPage',
      },
    ];
    dispatch(setComponentList(componentList));
  }, []);

  return <React.Fragment />;
};
export default EditComponentList;

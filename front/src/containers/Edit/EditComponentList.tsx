import React, { useEffect } from 'react';
import ClockContainer from '../Clock/ClockContainer';
import Info from '../../components/Info/Info';
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
        name: 'weather',
        category: 'weather',
        pageView: 'seoPage',
      },
    ];
    dispatch(setComponentList(componentList));
  }, []);

  return <React.Fragment />;
};
export default EditComponentList;

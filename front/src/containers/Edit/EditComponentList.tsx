import React, { useEffect } from 'react';
import ClockContainer from '../Clock/ClockContainer';
import Info from '../Info/InfoContainer';
import WeatherInfoContainer from '../Weather/WeatherInfoContainer';
import WeatherInfoOverview from '../Weather/WeatherInfoOverview';
import { setComponentList } from '../../store/edit/reducer';
import {
  EnterTopicContainer,
  NewsTopicContainer,
  RealtimeTermsContainer,
} from '../Terms';
import { useDispatch } from 'react-redux';

const EditComponentList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const componentList = [
      {
        component: EnterTopicContainer,
        name: 'EnterTopicContainer',
        category: 'weather',
        pageView: 'seoPage',
      },
      {
        component: NewsTopicContainer,
        name: 'NewsTopicContainer',
        category: 'weather',
        pageView: 'seoPage',
      },
      {
        component: RealtimeTermsContainer,
        name: 'RealtimeTermsContainer',
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

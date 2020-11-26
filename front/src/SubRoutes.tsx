import { Route } from 'react-router-dom';
import React from 'react';
import Admin from './containers/Admin/Admin';
import MainContainer from './containers/MainContainer/MainContainer';
import DndContainer from './containers/DndContainer/DndContainer';
import {
  NewsTopicContainer,
  EnterTopicContainer,
} from './containers/NewsEnterTopic';
const SubRotues = ({}) => {
  return (
    <div>
      <Route exact path="/" component={MainContainer} history={history} />
      <Route exact path="/admin" component={Admin} history={history} />
      <Route
        exact
        path="/DndContainer"
        component={NewsTopicContainer}
        history={history}
      />
      <Route
        exact
        path="/EnterTopicContainer"
        component={EnterTopicContainer}
        history={history}
      />
    </div>
  );
};
export default SubRotues;

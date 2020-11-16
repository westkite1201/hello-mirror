import { Route } from 'react-router-dom';
import React from 'react';
import Admin from './containers/Admin/Admin';
import MainContainer from './containers/MainContainer/MainContainer';
import DndContainer from './containers/DndContainer/DndContainer';
const SubRotues = ({}) => {
  return (
    <div>
      <Route exact path="/" component={MainContainer} history={history} />
      <Route exact path="/admin" component={Admin} history={history} />
      <Route
        exact
        path="/DndContainer"
        component={DndContainer}
        history={history}
      />
    </div>
  );
};
export default SubRotues;

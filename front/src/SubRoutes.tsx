import { Route } from 'react-router-dom';
import React from 'react';
import Admin from './containers/Admin/Admin';
import MainContainer from './containers/MainContainer/MainContainer';
const SubRotues = ({}) => {
  return (
    <div>
      <Route exact path="/" component={MainContainer} history={history} />
      <Route exact path="/admin" component={Admin} history={history} />
    </div>
  );
};
export default SubRotues;

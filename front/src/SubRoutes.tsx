import { Route } from 'react-router-dom';
import React from 'react';
import Admin from './containers/Admin/Admin';
import MainContainer from './containers/MainContainer/MainContainer';
import Test from './containers/Test';

const SubRotues = ({}) => {
  return (
    <div>
      <Route exact path="/" component={MainContainer} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/test" component={Test} />
    </div>
  );
};
export default SubRotues;

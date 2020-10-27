import { Route } from 'react-router-dom';
import React from 'react';
import Admin from './containers/Admin/Admin';
export default () => {
  return (
    <div>
      <Route exact path="/admin" component={Admin} />
    </div>
  );
};

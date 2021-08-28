import React from 'react';
import { Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SubRoutes from './SubRoutes';

const Routes = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/*<SideBar pageWrapId={'page-wrap'} outerContainerId={'App'} />*/}
      <div id="page-wrap" style={{ overflow: 'hidden' }}>
        <Switch>
          <SubRoutes />
        </Switch>
      </div>
    </div>
  );
};

export default Routes;

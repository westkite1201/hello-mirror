import React from 'react';
import { Switch } from 'react-router-dom';
import SubRoutes from './SubRoutes';
//import SideBar from './component/common/SideBar';
import { ToastContainer } from 'react-toastify';
const Routes = ({ history }) => {
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
          <SubRoutes history={history} />
        </Switch>
      </div>
    </div>
  );
};

export default Routes;

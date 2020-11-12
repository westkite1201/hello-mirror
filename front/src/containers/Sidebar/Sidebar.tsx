import React from 'react';
import style from './SideBar.module.css';
import RecursiveTreeView from './RecursiveTreeView';
import { RootState } from '../../store/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import { addComponent } from '../../store/edit/reducer';
import CSS from 'csstype';
const Sidebar = () => {
  const { componentList, isEdit } = useSelector(
    (state: RootState) => state.edit,
  );
  const dispatch = useDispatch();
  const sideBarOpenStyle: CSS.Properties = {
    width: '340px',
    padding: '100px 20px 20px 20px',
    boxShadow: '5px 5px 5px 5px #e9ecef',
  };
  const sideBarCloseStyle: CSS.Properties = {
    width: '0',
    padding: '0px',
  };

  {
    /*
     const activeStyle: CSS.Properties = {
    color: 'black',
    fontSize: '1rem',
    };
    const link = routes.map((prop, key) => {
      if (prop.sideView) {
        return (
          <div className={style.styleNavigation} key={key}>
            <NavLink to={prop.path} activeStyle={activeStyle} key={key}>
              {prop.sidebarName}
            </NavLink>
          </div>
        );
      }
    });
  */
  }

  const addSelectedComponent = (componentName: string) => {
    dispatch(addComponent(componentName));
  };
  return (
    <div>
      <div
        id="mySidebar"
        className={style.sidenav}
        style={isEdit ? sideBarOpenStyle : sideBarCloseStyle}
      >
        <div className={style.myBlogName}>SMART MIRROR</div>

        <RecursiveTreeView
          pureComponents={componentList}
          addSelectedComponent={addSelectedComponent}
        ></RecursiveTreeView>
      </div>
    </div>
  );
};

export default Sidebar;

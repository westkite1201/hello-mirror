import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CSS from 'csstype';
import style from './SideBar.module.css';
import RecursiveTreeView from './RecursiveTreeView';
import { RootState } from '../../store/rootReducer';
import { addComponent } from '../../store/edit/reducer';

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

  const addSelectedComponent = (componentName: string) => {
    console.log('[seo] componentName ', componentName);
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
        />
      </div>
    </div>
  );
};

export default Sidebar;

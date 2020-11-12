import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './../src/styles/theme';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './containers/Sidebar/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/rootReducer';
import { editHandle, saveLayout } from './store/edit/reducer';
import { handleDispatchEventResize } from './lib/helpers';
import TopRowContainer from './containers/TopRow/TopRowContainer';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
}
// 스타일드-컴포넌트 정의
const Container = styled.div`
  height: 100vh;
  background-color: ${props => props.theme.light.mainBackground};
  color: ${props => props.theme.dark.primaryText};
  overflow: hidden;
`;

// 컴포넌트 정의
const Component = () => {
  const dispatch = useDispatch();
  const { isEdit } = useSelector((state: RootState) => state.edit);
  const openStyle = {
    zIndex: 10,
    marginLeft: '350px',
  };
  const closeStyle = {
    zIndex: 10,
    marginLeft: '0px',
  };
  function handleEdit() {
    dispatch(editHandle());
    handleDispatchEventResize();
  }
  function handleSaveLayout() {
    dispatch(saveLayout());
  }
  return (
    <Container>
      <TopRowContainer handleEdit={handleEdit} saveLayout={handleSaveLayout} />
      <Sidebar />
      <div style={isEdit ? openStyle : closeStyle}>
        <Router>
          <Routes />
        </Router>
      </div>
    </Container>
  );
};

export default App;

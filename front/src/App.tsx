import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './../src/styles/theme';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './containers/Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from './store/rootReducer';
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
  background-color: ${props => props.theme.dark.mainBackground};
  color: ${props => props.theme.dark.primaryText};
`;

// 컴포넌트 정의
const Component = () => {
  const { isSidebarOpen } = useSelector((state: RootState) => state.edit);
  const openStyle = {
    marginLeft: '350px',
  };
  const closeStyle = {
    marginLeft: '0px',
  };
  return (
    <Container>
      <Sidebar />

      <div style={isSidebarOpen ? openStyle : closeStyle}>
        <Router>
          <Routes />
        </Router>
      </div>
    </Container>
  );
};
export default App;

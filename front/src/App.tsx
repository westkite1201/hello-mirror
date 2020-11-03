import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './../src/styles/theme';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './containers/Sidebar/Sidebar';
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
  return (
    <Container>
      <Sidebar />
      <Router>
        <Routes />
      </Router>
    </Container>
  );
};
export default App;

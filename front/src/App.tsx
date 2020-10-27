import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './../src/styles/theme';
import styled, { css } from 'styled-components';
function App() {
  return (
    <ThemeProvider theme={theme.dark}>
      <Component />
    </ThemeProvider>
  );
}
// 스타일드-컴포넌트 정의
const Container = styled.div`
  background-color: ${props => props.theme.mainBackground};
  color: ${props => props.theme.primaryText};
`;

// 컴포넌트 정의
const Component = () => {
  return (
    <Container>
      <h1>테마적용하기🎨</h1>
    </Container>
  );
};
export default App;

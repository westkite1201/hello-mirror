import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
//import createSagaMiddleware from 'redux-saga';
// import rootReducer, { rootSaga } from './modules';
//import rootReducer, { rootSaga } from './store';
// import { composeWithDevTools } from 'redux-devtools-extension'; // 리덕스 개발자 도구
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import configureStore from './store/store';
import { GlobalStyle } from './styles/global-style';
// Saga Middleware 생성
//const sagaMiddleware = createSagaMiddleware();

import dotenv from 'dotenv';
dotenv.config();

const initialState = {};
const store = configureStore(initialState);

// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(sagaMiddleware)),
// );
//sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

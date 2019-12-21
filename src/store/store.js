import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import axios from 'axios';
import homeReducer from './home';
import userReducer from './user';

const reducer = combineReducers({
  home: homeReducer,
  user: userReducer,
});

const serverAxios = axios.create({
  baseURL: 'http://localhost:9090/'
});
const clientAxios = axios.create({
  baseURL: '/'
});
export const getServerStore = () => {
  // 通过服务端的dispatch获取和充实state
  return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));
};

export const getClientStore = () => {
  // 通过window.__context获取state
  const defaultState = window.__context || {};
  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
};

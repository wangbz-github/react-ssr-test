import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import homeReducer from './home';
import userReducer from './user';

const reducer = combineReducers({
  home: homeReducer,
  user: userReducer,
});

export const getServerStore = () => {
  // 通过服务端的dispatch获取和充实state
  return createStore(reducer, applyMiddleware(thunk));
};

export const getClientStore = () => {
  // 通过window.__context获取state
  const defaultState = window.__context || {};
  return createStore(reducer, defaultState, applyMiddleware(thunk));
};

export default createStore(reducer, applyMiddleware(thunk));

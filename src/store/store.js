import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import homeReducer from './home';

const reducer = combineReducers({
  home: homeReducer
});

export default createStore(reducer, applyMiddleware(thunk));
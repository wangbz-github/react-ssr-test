import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import App from '../src/App';
import routers from '../src/App';
import { Provider } from 'react-redux';
import { getClientStore } from '@store/store'
const store = getClientStore();
const Page = (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {routers.map(router => (<Route {...router} key={router.path} />))}
      </Switch>
    </BrowserRouter>
  </Provider>
);

//注水 客户端入口
ReactDom.hydrate(Page, document.getElementById('root'));

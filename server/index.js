import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import express from 'express';
import proxy from 'http-proxy-middleware';

import morgan from 'morgan';
import routers from '../src/App';
import { getServerStore } from '@store/store';
import { render, promiseFinally } from '@utils/util.js';
const app = express();

app.use(morgan('dev')); //日志

//client请求代理
app.use(
  '/api',
  proxy({ target: 'http://localhost:9090', changeOrigin: true })
);

app.use(express.static('public'));

app.get('*', (req, res) => {

  const promises = [];
  const store = getServerStore();

  routers.forEach(router => {
    const match = matchPath(req.path, router);
    if (match) {
      const { loadData } = router.component;
      if (loadData) {
        promises.push(loadData(store));
      }
    }
  });

  promiseFinally(promises).then(() => {
    try {
      const staticContext = {};
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={staticContext}>
            {/* <App /> */}
            <Switch>
              {routers.map(router => (<Route {...router} key={router.path} />))}
            </Switch>
          </StaticRouter>
        </Provider>
      );

      console.log(staticContext);
      if (staticContext.statusCode) {
        res.status(staticContext.statusCode);
      }

      if (staticContext.action === 'REPLACE') {
        res.redirect(301, staticContext.url);
      }

      res.send(render({ content, store }));
    } catch (err) {
      res.send('500 Internal Server Error!');
    }
  }).catch((err) => {
    res.send(err.toString());
  });
});

app.listen(9012, () => {
  console.log('监听成功');
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import express from 'express';
import proxy from 'http-proxy-middleware';

import morgan from 'morgan';
import routers from '../src/App';
import { getServerStore } from '@store/store';
import { render, promiseFinally, csrRender } from '@utils/util.js';
const app = express();

app.use(morgan('dev')); //日志

//client请求代理
app.use(
  '/api',
  proxy({ target: 'http://localhost:9090', changeOrigin: true })
);

app.use(express.static('public'));

app.get('*', (req, res) => {

  if (req.query._mode === 'csr') {
    console.log('url参数开启SEO降级');
    const html = csrRender();
    res.send(html);
    return;
  }

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
      const staticContext = {
        css: [] //用于接收组件内样式
      };
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={staticContext}>
            {/* <App /> */}
            <Switch>
              {routers.map(router => (<Route {...router} key={router.key} />))}
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

      res.send(render({ content, store, styles: staticContext.css }));
    } catch (err) {
      console.log(err);
      res.send('500 Internal Server Error!');
    }
  }).catch((err) => {
    res.send(err.toString());
  });
});

app.listen(9012, () => {
  console.log('监听成功');
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import express from 'express';
import proxy from 'http-proxy-middleware';

import morgan from 'morgan';
import routers from '../src/App';
import { getServerStore } from '@store/store';

const render = function ({ content, store }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>React SSR Test</title>
</head>
<body>
<div id="root">${content}</div>
<script>
  window.__context = ${JSON.stringify(store.getState())};
</script>
<script src="/index.js"></script>
</body>
</html>
  `;
};

const promiseFinally = function (promises) {
  let count = promises.length;
  let timeOut = 0;
  let timer = null;

  promises.forEach(item => {
    item.catch(err => {
      console.log(`${err.toString()}: ${err.config.url}`);
    }).finally(() => {
      count--;
    });
  });

  return new Promise((resolve, reject) => {
    timer = setInterval(() => {
      if (timeOut >= 500) {
        reject(new Error('Request Timeout！'));
        clearInterval(timer);
        return;
      }

      if (count <= 0) {
        resolve();
        clearInterval(timer);
        return;
      }

      timeOut++;

    }, 10);
  });
}

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
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          {/* <App /> */}
          {routers.map(router => (<Route {...router} key={router.path} />))}
        </StaticRouter>
      </Provider>
    );
    try {
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

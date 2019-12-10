import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import App from '../src/App';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  const content = renderToString(App);
  res.send(`
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
      <script src="/index.js"></script>
    </body>
    </html>
  `);
});

app.listen(9012, () => {
  console.log('监听成功')
});
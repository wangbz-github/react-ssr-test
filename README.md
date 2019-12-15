# react-ssr-test
## 第一节

###1. SSR是什么？
    在SSR出现之前，页面渲染要之前需要加载编译好的js文件然后在浏览器端渲染HTML，期间还有可能请求异步数据。这样，用户在看到真是的DOM结构之前会出现一段时间的白屏，影响用户体验，也会影响SEO优化。
    SSR是指，将同一个组件渲染为服务器端的 HTML字符串，将它们直接发送到浏览器。
###2.同构应用
 在webpack打包时，通过两个入口分别打包server端和client端的渲染文件。在用户首次访问时，在node中间层通过server.bundle.js将需要用到的组件渲染为HTMl字符串发送到浏览器（SSR）；在之后的用户操作中通过client.bundle.js来响应用户事件和获取数据（CSR）；这种SSR和CSR相结合的方式称之为同构。
 

```javascript
//两个入口的公用文件 app.js
import React, { useState } from 'react';

function App(props) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello {props.title}!</h1>
      <h2>点击了{count}次</h2>
      <button onClick={() => { setCount(count + 1) }}>计数器</button>
    </div>
  );
}

export default <App title="React SSR Test" />;
```

```javascript
//服务端入口
app.get('/', (req, res) => {
  const content = renderToString(App);

  //将App中的组件渲染成html字符串返回浏览器
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
```

```javascript
//client端入口
//注水 hydrate的作用： ReactDOM 复用 ReactDOMServer 服务端渲染的内容时尽可能保留结构，并补充事件绑定等 Client 特有内容的过程。
ReactDom.hydrate(App, document.getElementById('root'));
```

## 第二节
    1.使用concurrently，将多条命令合并执行，提升开发效率
```json
"scripts": {
    "dev:client": "webpack --config webpack.client.js --watch",
    "dev:server": "webpack --config webpack.server.js --watch",
    "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\"",
    "start": "concurrently \"npm run dev:client\" \"npm run dev:server\" \"npm run dev:start\""
  }
```
    2.SSR路由支持
```javascript
// client端使用BrowserRouter
<BrowserRouter>
  <Route path="/" exact component={Home} />
  <Route path="/about" exact component={About} />
</BrowserRouter>

```
```javascript
// server端使用StaticRouter，并通过requsest.url进行路由匹配
<StaticRouter location={requsest.url}>
  <Route path="/" exact component={Home} />
  <Route path="/about" exact component={About} />
</StaticRouter>
```
    3.SSR支持数据流（引入redux）
    为了前后端数据同步，在服务端渲染时，获取异步数据，并初始化store
    
```javascript
// 3.1 server端初始化store，同client一样，通过Provider传入即可
<Provider store={store}>
  <StaticRouter location={req.url}>
    <App />
  </StaticRouter>
</Provider>
```
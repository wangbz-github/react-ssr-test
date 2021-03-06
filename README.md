# react-ssr-test
### 第一节

1.SSR是什么？

    在SSR出现之前，页面渲染要之前需要加载编译好的js文件然后在浏览器端渲染HTML，期间还有可能请求异步数据。这样，用户在看到真是的DOM结构之前会出现一段时间的白屏，影响用户体验，也会影响SEO优化。
    SSR是指，将同一个组件渲染为服务器端的 HTML字符串，将它们直接发送到浏览器。

2.同构应用

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
### 第二节 & 第三节
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

    3.1初始化空store
```javascript
// 3.1 server端初始化store，同client一样，通过Provider传入即可
<Provider store={store}>
  <StaticRouter location={req.url}>
    <App />
  </StaticRouter>
</Provider>
```

    3.2服务端获取异步数据
    >00. 创建两个store分别用于server端和client端；
    >01. 通过设置组件的静态方法让服务端知道何时该加载异步数据；
    >02. 服务端创建store，在获取异步数据后修改store，服务端就可以将数据渲染到html字符串中。另外通过html中设置全局变量__context实现和client的通信，将store传递给client；
    >03.client获取全局变量中的__context并初始化client端store，是先前后端数据同步。
    
```javascript
// 创建两个store分别用于server端和client端

export const getServerStore = () => {
  // 通过服务端的dispatch获取和充实state
  return createStore(reducer, applyMiddleware(thunk));
};

export const getClientStore = () => {
  // 通过window.__context获取state
  const defaultState = window.__context || {};
  return createStore(reducer, defaultState, applyMiddleware(thunk));
};
```
    
```javascript
// 组件设置静态方法lodaData
Home.loadData = store => store.dispatch(getCourseList());
```

```javascript
// server端判断是否需要获取异步数据
const promises = [];
const store = getServerStore();
routers.forEach(router => {
    const match = matchPath(req.path, router);
    if (match) { //匹配路由
      const { loadData } = router.component;
      if (loadData) {
        promises.push(loadData(store)); //将获取请求放入Promist中
      }
    }
});
```

```javascript
// 服务端渲染HTML字符串，并将store放入全局变量__context中

//全部请求结束后开始渲染
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
});
  
//拼接HTML字符串
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
  window.__context = ${JSON.stringify(store.getState())}; //全局变量
</script>
<script src="/index.js"></script>
</body>
</html>
  `;
};
```

4.多数据处理
```javascript
// 设置计数器，当所有请求响应完毕后再渲染组件
const promiseFinally = function (promises) {
  let count = promises.length;
  let timeOut = 0;
  let timer = null;

  promises.forEach(item => {
    item.catch(err => {
    // 避免阻塞：错误的请求再服务端输出日志，不做其他处理
      console.log(`${err.toString()}: ${err.config.url}`);
    }).finally(() => {
      // 不论成功失败，请求结束后计数器减一
      count--;
    });
  });

  return new Promise((resolve, reject) => {
    timer = setInterval(() => {
      // 设置超时时间
      if (timeOut >= 500) {
        reject(new Error('Request Timeout！'));
        clearInterval(timer);
        return;
      }

      if (count <= 0) {
        // 全部请求结束后通知渲染
        resolve();
        clearInterval(timer);
        return;
      }

      timeOut++;
    }, 10);
  });
}
```

5.设置代理
```javascript
//解决node端请求跨域
export default axios.create({
  proxy: {
    host: '127.0.0.1',
    port: 9090
  }
});
```

```javascript
//拦截前端请求,
app.use('/api', proxy('http://localhost:9090', {
  proxyReqPathResolver: function (req, res) {
    //这个代理会把匹配到的url（下面的 ‘/api’等）去掉，转发过去直接404，这里手动加回来，
    req.url = req.baseUrl + req.url;
    return require('url').parse(req.url).path;
  },
})); //client请求代理
```

### 第三次作业讲解
1.利用thunk的静态方法withExtraArgument将 redux 和 axios 结合；
2.将中间件 express-http-proxy 替换为 http-proxy-middleware，前者不好用；

### 第四节
#### 4.1. 服务端加载css时
因为没有document对象，所以不能使用style-loader。服务端使用`isomorphic-style-loader`

#### 4.2.服务端路由状态码控制
1.设置一个组件负责拦截匹配不到的路由；
```javascript
{
  component: NotFound
}
```
2.在server端staticRouter上传入上下文context；
```javascript
const staticContext = {};
const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={staticContext}>
        {/* <App /> */}
        {routers.map(router => (<Route {...router} key={router.path} />))}
      </StaticRouter>
    </Provider>
);
```
3.在组件渲染是将状态码写入上下文context，服务端就能获取到状态码并进行下一步处理
`注：组件处理状态码见NotFound.js`
4.服务端处理
```javascript
if (staticContext.statusCode) {
    res.status(staticContext.statusCode);
}

res.send(render({ content, store }));
```
### 第五节
#### 5.1. SEO降级
1.当需要时开启降级（url参数开启、服务器配置，服务器负载过高、SSR报错）;
2.如何开启？同传统CSR一样，使用webpack-html-plugin打包好客户端文件，当需要SEO降级时，读取html文件直接返回给客户端；
3.客户端通过标志字段window.__context来判断是否为CSR，并选择合适的渲染方法（hydrate或render）;
`注：window.__context是用来同步server和client的store数据的载体`
#### 5.2 css细节优化
1.webpack配置css-loader为module方式加载
```javascript
rules: [
  {
    test: /\.css$/,
    loader: ['style-loader', {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }]
  }
]
```
2.组件内将css传入staticRouter的上下文context中
```javascript
if (props.staticContext) {
    //style._getCss() 为服务端独有
    props.staticContext.css.push(style._getCss());
}
```
3.server端将css接收，并拼接成字符串返回客户端。
#### 5.3 高阶组件优化css
1.用高阶组件实现对上面context逻辑的封装,详见utils/withStyles.js;
2.使用isomorphic-style-loader的withStyles,详见[github](https://github.com/kriasoft/isomorphic-style-loader)

5.3.1 withStyles引入的问题
在页面内部，为了在server端渲染异步数据，我们在页面组件上设置了静态方法，但是由于withStyles没有将静态方法复制，导致不能再server端渲染数据 
```javascript
// pages/home/index.js
Home.loadData = store => store.dispatch(getCourseList());
```
解决方法：React官方方案[复制静态方法](https://react.docschina.org/docs/higher-order-components.html#static-methods-must-be-copied-over)

### 第六节 其他的SSR实现思路
#### 6.1 [puppeteer](https://github.com/puppeteer/puppeteer)实现ssr 
当已有的项目已经很成熟、很复杂，不能进行大规模同构时，可以实现一些简单的静态资源返回，达到SEO优化的目的。利用puppeteer先抓取网页内容，然后返回客户端，可以实现伪SSR。
#### 6.2 [prerender](https://github.com/prerender/prerender)/[prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)
使用puppeteer实现SSR的时候，每次请求页面都会先去抓取网页内容，这样会有一定的延时。这时我们可以使用prerender或prerender-spa-plugin将所有路由提前渲染成html文件，访问时直接返回。
#### 6.3 使用成熟框架[nextjs](https://nextjs.org/)

### TODO
1.了解redux-thunk源码，结合使用axios配置；
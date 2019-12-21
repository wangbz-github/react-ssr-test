const path = require('path');
const fs = require('fs');


export const csrRender = function () {
  const fileName = path.resolve(process.cwd(), 'public/index.csr.html');
  return fs.readFileSync(fileName, 'utf-8');
};


export const render = function ({ content, store, styles }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>React SSR Test</title>
<style>
  ${styles.join('\n')}
</style>
</head>
<body>
<!-- 服务端渲染 -->
<div id="root">${content}</div>
<script>
  window.__context = ${JSON.stringify(store.getState())};
</script>
<script src="/index.js"></script>
</body>
</html>
  `;
};

export const promiseFinally = function (promises) {
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
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const urlCatch = {};

async function test(params) {
  const browser = await puppeteer.launch(); // 启动浏览器
  const page = await browser.newPage(); // 打开页面
  await page.goto('https://www.baidu.com/'); // 跳转地址
  await page.screenshot({ path: 'public/screenshot.png' }); // 获取页面截图
  await browser.close(); // 关闭浏览器

  console.log('截图完毕');
}
// test();

async function getPageHtml(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:9093${url}`, {
    waitUntil: ['networkidle0'] // 等待无网络请求
  });
  const html = await page.content();
  await browser.close();

  return html;
}

app.get('*', async (req, res) => {

  const url = req.url;

  if (url === '/favicon.ico') {
    res.send({
      code: 1
    });
    return;
  }

  console.log(req.url);
  /**
   * 1.加缓存
   * 2.lru缓存算法
   */

  if (urlCatch[url]) {
    res.send(urlCatch[url]);
  } else {
    getPageHtml(url).then(html => {
      urlCatch[url] = html;
      res.send(html);
    });
  }
});

app.listen(8081, () => {
  console.log('SSR Server Start');
})